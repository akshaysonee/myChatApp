import { useEffect } from "react";
import { io } from "socket.io-client";
import useConversation from "../zustand/useConversation";
import { useAuthContext } from "../context/AuthContext";

// Initialize socket only once
const socket = io(import.meta.env.PORT || "http://localhost:5000" , {
  withCredentials: true,
});

const useListenMessages = () => {
  const { authUser } = useAuthContext();
  const { messages, setMessages, selectedConversation } = useConversation();

  useEffect(() => {
    if (!authUser?._id) return;

    // join the user room
    socket.emit("join", authUser._id);

    // listen for new messages
    socket.on("newMessage", (message) => {
      console.log("New message received:", message);

      if (
        (message.senderId === selectedConversation?._id &&
          message.receiverId === authUser._id) ||
        (message.senderId === authUser._id &&
          message.receiverId === selectedConversation?._id)
      ) {
        setMessages([...messages, message]); // update Zustand store
      }
    });

    return () => {
      socket.off("newMessage");
    };
  }, [authUser?._id, selectedConversation?._id, messages, setMessages]);
};

export default useListenMessages;
