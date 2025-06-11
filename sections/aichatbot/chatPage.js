import { useState } from "react";
import ChatMessage from "./chatMessage";
import ChatInput from "./chatInput";

const ChatWrapper = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! I'm your HRMS assistant. Ask me anything about attendance, leaves, documents, career development, or other HR topics!" }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (text) => {
    const newMessages = [...messages, { sender: "user", text }];
    setMessages(newMessages);
    setLoading(true); 

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text }),
      });
      const data = await res.json();

      setMessages([
        ...newMessages,
        { sender: "bot", text: data.reply }
      ]);
    } catch (err) {
      setMessages([
        ...newMessages,
        { sender: "bot", text: "Something went wrong. Try again." }
      ]);
    } finally {
      setLoading(false); 
    }
  };

  return (
  <div className="relative flex flex-col h-[90vh] overflow-hidden">
     <img
      src="/images/BG-Image.png"
      alt="chat background"
      className="absolute inset-0 w-full h-full object-cover opacity-30 z-[-10] pointer-events-none"
    />


    {/* Chat Messages */}
    <div className="flex-1 p-4 overflow-y-auto">
      {messages.map((msg, idx) => (
        <ChatMessage key={idx} message={msg.text} isUser={msg.sender === "user"} />
      ))}

      {loading && (
        <ChatMessage
          message={<span className="animate-pulse">Typing...</span>}
          isUser={false}
        />
      )}
    </div>

    {/* Input */}
    <div>
      <ChatInput onSend={handleSend} />
    </div>
  </div>
);

};

export default ChatWrapper;
