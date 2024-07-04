import React from 'react';

const ChatBoxSender = ({
  avatar,
  message,
  w
}: {
  avatar: string;
  message: string;
  w: string;
}) => {
  const chatStyle = {
    marginLeft: w,
  };

  console.log(message, w, "sender");

  return (
    <div className="chat mt-4 flex  items-start" style={chatStyle}>
      <div className="chat-bubble bg-gray-100 p-4  rounded-lg text-black mt-7 overflow-hidden">
        {/* Ensure chat-bubble grows vertically */}
        <div className="whitespace-pre-wrap">{message}</div>
      </div>
      <div className="chat-image avatar ml-2">
        <div className="w-10">
          <img src={avatar} alt="User Avatar" className="rounded-full" />
        </div>
      </div>
      <div className="chat-tail" />
    </div>
  );
};

export default ChatBoxSender;
