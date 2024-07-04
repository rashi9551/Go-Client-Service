import React from 'react';

const ChatBoxReceiver = ({
  avatar,
  message,
}: {
  avatar: string;
  message: string;
}) => {
  console.log(message, "receiver");

  return (
    <div className="chat ml-5 md:ml-24 lg:ml-0  mt-4 flex items-start">
      <div className="chat-image avatar mr-2">
        <div className="w-10">
          <img src={avatar} alt="User Avatar" className="rounded-full" />
        </div>
      </div>
      <div className="chat-bubble bg-blue-100 p-4 rounded-lg text-black mt-7">{message}</div>
      <div className="chat-tail" />
    </div>
  );
};

export default ChatBoxReceiver;
