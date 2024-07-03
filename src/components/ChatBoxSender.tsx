const ChatBoxSender = ({
  avatar,
  message,
}: {
  avatar: string;
  message: string;
}) => {
  return (
    <div className="chat chat-end w-full mt-4 flex items-start">
  <div className="chat-image avatar mr-2">
    <div className="w-10">
      <img src={avatar} alt="User Avatar" className="rounded-full" />
    </div>
  </div>
  <div className="chat-bubble text-black">{message}</div>
</div>

  );
};

export default ChatBoxSender;
