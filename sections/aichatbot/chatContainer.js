import ChatMessage from "./chatMessage";

const ChatContainer = ({ messages }) => (
  <div className="flex flex-col p-4 overflow-y-auto h-[80vh]">
    {messages.map((msg, idx) => (
      <ChatMessage key={idx} message={msg.text} isUser={msg.sender === 'user'} />
    ))}
  </div>
);

export default ChatContainer;
