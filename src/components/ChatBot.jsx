import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X } from "lucide-react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";


import { intents } from "../data/chatKnowledge";
import openai from "../utils/openaiClient";
import { imexpoData } from "../data/imexpoData";




const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: "bot", text: "Hi! 👋 I’m IM-Expo Assistant. How can I help you today?" },
    ]);
    const chatEndRef = useRef(null);

    const toggleChat = () => setIsOpen(!isOpen);

    const handleSend = (userMessage) => {
        if (!userMessage.trim()) return;
        const newMsg = { sender: "user", text: userMessage };
        setMessages((prev) => [...prev, newMsg]);
        generateBotResponse(userMessage);
    };

    const generateBotResponse = async (userMessage) => {
        const cleanedMsg = userMessage.trim().toLowerCase();

        // --- Local Fallback ---
        const localFallback = () => {
            const similarity = (a, b) => {
                const wordsA = a.split(" ");
                const wordsB = b.split(" ");
                let matches = 0;
                for (const wa of wordsA) if (wordsB.includes(wa)) matches++;
                return matches / Math.max(wordsA.length, wordsB.length);
            };

            let bestMatch = null;
            let highestScore = 0;
            for (const intent of intents) {
                for (const example of intent.examples) {
                    const score = similarity(cleanedMsg, example.toLowerCase());
                    if (score > highestScore) {
                        highestScore = score;
                        bestMatch = intent;
                    }
                }
            }

            return highestScore > 0.3
                ? bestMatch.answer
                : "I'm not sure about that yet. Try asking about uploading, verification, or subscriptions.";
        };

        try {
            const platformInfo = JSON.stringify(imexpoData).slice(0, 16000);

            // --- AI request ---
            const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: `
You are the IM-Expo Assistant for a Sri Lanka–based import/export platform.
You must ALWAYS use the provided IM-Expo data to answer questions.
Be conversational, short, and natural — but stay factual.
If the question isn't related to the platform, politely say:
"I'm not sure about that yet. Please check our Resources page or Contact Us."

Here is your knowledge base: ${platformInfo}
          `,
                    },
                    {
                        role: "user",
                        content: `
User said: "${userMessage}"

1. If this message is unclear, rephrase it to find intent (like "How can I upload?" → "upload help").
2. Then answer using IM-Expo data only.
3. Keep the reply helpful and friendly (1–3 lines max).
          `,
                    },
                ],
                temperature: 0.4,
                max_tokens: 250,
            });

            const aiReply =
                completion?.choices?.[0]?.message?.content?.trim() || localFallback();

            setMessages((prev) => [...prev, { sender: "bot", text: aiReply }]);
        } catch (error) {
            console.error("AI Error:", error);
            const fallback = localFallback();
            setMessages((prev) => [...prev, { sender: "bot", text: fallback }]);
        }
    };





    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {/* Floating Button */}
            {!isOpen && (
                <button
                    onClick={toggleChat}
                    className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
                >
                    <MessageCircle size={24} />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="w-80 md:w-96 bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="bg-blue-600 text-white px-4 py-2 flex justify-between items-center">
                        <span className="font-semibold">IM-Expo Assistant</span>
                        <button onClick={toggleChat} className="hover:text-gray-300">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Chat Body */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-2">
                        {messages.map((msg, idx) => (
                            <ChatMessage key={idx} sender={msg.sender} text={msg.text} />
                        ))}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Quick Questions */}
                    <div className="px-3 pb-2 flex flex-wrap gap-2 border-t border-gray-100 bg-gray-50">
                        {["How to upload a product?", "What are subscription plans?", "How to get verified?"].map((q, i) => (
                            <button
                                key={i}
                                onClick={() => handleSend(q)}
                                className="text-xs bg-white border border-gray-300 rounded-full px-3 py-1 hover:bg-blue-100 text-gray-700 transition"
                            >
                                {q}
                            </button>
                        ))}
                    </div>

                    {/* Input */}
                    <ChatInput onSend={handleSend} />

                </div>
            )}
        </div>
    );
};

export default ChatBot;
