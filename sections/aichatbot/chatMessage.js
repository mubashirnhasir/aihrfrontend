import UserIcon from "@/public/icons/userIcon";


const ChatMessage = ({ message, isUser }) => (
  <div className={`flex items-start gap-2  my-2 ${isUser ? "justify-end" : "justify-start"}`}>
    {/* 👤 Profile image */}
    {!isUser && (
      <img
        src="/images/Aiavatar.png"
        alt="Bot Avatar"
        className="w-8 h-8 rounded-full"
      />
    )}

    <div
      className={`p-3 rounded-lg max-w-xl ${
        isUser
          ? "bg-gray-100 text-lg border border-[#E4E7EC] text-[#1B2559] "
          : "border border-[#E4E7EC] shadow-sm bg-[#FCFCFD] text-[#1B2559]"
      }`}
    >
      {message}
    </div>

    {isUser && (
      <div className="rounded-full shadow-md border border-gray-300">
        <img
        src="/images/avatar.jpg"
        alt="Bot Avatar"
        className="w-10 h-10 rounded-full"
      />
      </div>
    )}
  </div>
);

export default ChatMessage;
