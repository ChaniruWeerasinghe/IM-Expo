import React from "react";

const ChatMessage = ({ sender, text }) => {
  const isBot = sender === "bot";

  return (
    <div
      className={`flex ${
        isBot ? "justify-start" : "justify-end"
      } mb-2`}
    >
      <div
        className={`px-3 py-2 rounded-lg max-w-[75%] text-sm ${
          isBot
            ? "bg-gray-100 text-gray-800"
            : "bg-blue-600 text-white"
        }`}
      >
        {text}
      </div>
    </div>
  );
};

export default ChatMessage;
