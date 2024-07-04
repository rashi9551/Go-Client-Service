import React from 'react';

const ChatBoxSender = ({
  avatar,
  message,
}: {
  avatar: string;
  message: string;
}) => {
  // const chatStyle = {
  //   marginLeft: w,
  // };

  console.log(message, "sender");

  return (
    <div className={`chat mt-4 flex ml-auto items-start`} >
      <div className="chat-bubble  p-4  rounded-lg text-black  mt-7 shadow-xl ml-auto chat-bubble bg-glass px-4 py-2  overflow-hidden">
        {message}
      </div>
      <div className="chat-image avatar ml-2">
        <div className="w-11 h-11 bg-white rounded-full overflow-hidden">
          <img src={avatar} alt="User Avatar" className="rounded-full" />
        </div>
      </div>
      <div className="chat-tail" />
    </div>
  );
};

export default ChatBoxSender;
