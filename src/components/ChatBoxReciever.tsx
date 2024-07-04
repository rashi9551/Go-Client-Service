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
      <div className="w-11 h-11 bg-white rounded-full overflow-hidden">
          <img src={avatar} alt="User Avatar" className="w-full h-full object-cover" />
        </div>
      </div>
      <div className="chat-bubble bg-blue-100 px-4 py-2 rounded-lg text-black  mt-7 shadow-xl">{message}</div>
      <div className="chat-tail" />
    </div>
  );
};

export default ChatBoxReceiver;
