import React, { useState } from "react";
import { Send } from "lucide-react";

const ChatInput = ({ onSend }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center border-t border-gray-200 p-2"
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 p-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        type="submit"
        className="ml-2 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
      >
        <Send size={16} />
      </button>
    </form>
  );
};

export default ChatInput;
