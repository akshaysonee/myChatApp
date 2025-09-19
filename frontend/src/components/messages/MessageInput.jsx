import { useState } from "react";
import useConversation from "../zustand/useConversation";

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  const sendMessage = async (messageText) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/messages/${selectedConversation._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: messageText }),
      });

      const data = await res.json();

      // Update state immediately so you see your own message
      setMessages([...messages, data]);

      setLoading(false);
      return data;
    } catch (error) {
      console.error("Error sending message:", error);
      setLoading(false);
    }
  };

  return { loading, sendMessage };
};

export default useSendMessage;