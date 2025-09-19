import { useEffect, useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import useConversation from "../../zustand/useConversation";
import { io } from "socket.io-client";

// initialize socket only once
const socket = io(import.meta.env.PORT || "http://localhost:5000" , {
  withCredentials: true,
});

const Messages = () => {
  const { authUser } = useAuthContext();
  const { selectedConversation } = useConversation();
  const [messages, setMessages] = useState([]);

  // Load old messages when conversation changes
  useEffect(() => {
    const fetchMessages = async () => {
      const res = await fetch(`/api/messages/${selectedConversation._id}`);
      const data = await res.json();
      setMessages(data);
    };

    if (selectedConversation?._id) {
      fetchMessages();
    }
  }, [selectedConversation]);

  // Listen for new messages
  useEffect(() => {
    socket.emit("join", authUser._id);

    socket.on("newMessage", (message) => {
      console.log("New message:", message);

      // only add if related to current conversation
      if (
        (message.senderId === selectedConversation._id &&
          message.receiverId === authUser._id) ||
        (message.senderId === authUser._id &&
          message.receiverId === selectedConversation._id)
      ) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.off("newMessage");
    };
  }, [authUser._id, selectedConversation?._id]);

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((msg) => (
        <div
          key={msg._id}
          className={`mb-2 p-2 rounded ${
            msg.senderId === authUser._id
              ? "bg-blue-500 text-white self-end"
              : "bg-gray-200 text-black self-start"
          }`}
        >
          {msg.message}
        </div>
      ))}
    </div>
  );
};

export default Messages;