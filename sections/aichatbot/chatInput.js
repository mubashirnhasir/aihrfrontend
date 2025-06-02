import { useState } from 'react'

const ChatInput = ({ onSend }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4">
      <input
        className="flex-1  border rounded-lg focus:outline-blue-400 px-4 shadow-md bg-white border-gray-200 py-3"
        placeholder="Ask Anything"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button type="submit" className="bg-blue-600 shadow-md cursor-pointer min-w-[120px] font-semibold text-lg text-white px-4 py-2 rounded-lg">Send</button>
    </form>
  );
};

export default ChatInput;
