import { useEffect, useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import useConversation from "../../zustand/useConversation";
import Message from "./Message";
import { io } from "socket.io-client";

// Initialize socket (do this once globally ideally, but okay for now)
const socket = io(import.meta.env.VITE_BACKEND_URL , {
  withCredentials: true,
});

const Messages = () => {
  const { authUser } = useAuthContext();
  const { selectedConversation } = useConversation();
  const [messages, setMessages] = useState([]);

  // Load old messages whenever a new chat is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedConversation?._id) return;
      try {
        const res = await fetch(`/api/messages/${selectedConversation._id}`);
        const data = await res.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [selectedConversation]);

  // Listen for incoming socket messages
  useEffect(() => {
    if (!authUser?._id) return;

    socket.emit("join", authUser._id);

    socket.on("newMessage", (message) => {
      console.log("New message:", message);

      // Only add message if it belongs to the current chat
      if (
        (message.senderId === selectedConversation?._id &&
          message.receiverId === authUser._id) ||
        (message.senderId === authUser._id &&
          message.receiverId === selectedConversation?._id)
      ) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.off("newMessage");
    };
  }, [authUser?._id, selectedConversation?._id]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
      {messages.length > 0 ? (
        messages.map((msg) => <Message key={msg._id} message={msg} />)
      ) : (
        <p className="text-center text-gray-400">No messages yet</p>
      )}
    </div>
  );
};

export default Messages;
