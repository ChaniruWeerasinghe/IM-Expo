import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X } from "lucide-react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { defaultResponses } from "../data/chatResponses";

import { intents } from "../data/chatKnowledge";


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

    const generateBotResponse = (userMessage) => {
        const lower = userMessage.toLowerCase().trim();

        // helper: check similarity
        const similarity = (a, b) => {
            const wordsA = a.split(" ");
            const wordsB = b.split(" ");
            let matches = 0;
            for (const wa of wordsA) {
                if (wordsB.includes(wa)) matches++;
            }
            return matches / Math.max(wordsA.length, wordsB.length);
        };

        // find best match
        let bestMatch = null;
        let highestScore = 0;
        for (const intent of intents) {
            for (const example of intent.examples) {
                const score = similarity(lower, example.toLowerCase());
                if (score > highestScore) {
                    highestScore = score;
                    bestMatch = intent;
                }
            }
        }

        let response =
            highestScore > 0.3
                ? bestMatch.answer
                : "I'm not sure about that yet. Try asking about uploads, verification, or subscriptions.";

        setTimeout(() => {
            setMessages((prev) => [...prev, { sender: "bot", text: response }]);
        }, 400);
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
