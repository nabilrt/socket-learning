import { FaTrashAlt } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import {
  getAllConversationMessages,
  getAllConversations,
  sendUserMessages,
} from "../libs/utils/api";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { useAuth } from "../libs/context/auth-context";
import { normalizeMessage } from "../libs/utils/helper";

const socket = io("http://localhost:9000"); // Replace with your server URL

const Messenger = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [conversationMessages, setConversationMessages] = useState(null); // Initialize as null
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageText, setMessageText] = useState("");

  const getConversations = async () => {
    try {
      const response = await getAllConversations();
      setConversations(response.data.conversations);
    } catch (e) {
      console.log(e);
    }
  };

  const getConversationMessages = async () => {
    if (!selectedConversation) return;
    try {
      const response = await getAllConversationMessages(
        selectedConversation._id
      );
      setConversationMessages(response.data.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getConversations();
  }, []);

  useEffect(() => {
    getConversationMessages();
  }, [selectedConversation]);

  useEffect(() => {
    socket.on("new_message", (newMessage) => {
      if (newMessage.message.conversation_id === selectedConversation?._id) {
        // Normalize and append the new message from socket
        setConversationMessages((prevMessages) => ({
          ...prevMessages,
          messages: [
            ...prevMessages.messages,
            normalizeMessage(newMessage.message, selectedConversation),
          ],
        }));
      }
    });

    return () => {
      socket.off("new_message");
    };
  }, [selectedConversation]);

  // Sending a new message
  const handleSendMessage = async () => {
    if (messageText.trim()) {
      const newMessage = {
        conversationId: selectedConversation._id,
        receiverId: selectedConversation?.participant.id, // Replace with the actual user ID from your auth logic
        receiverName: selectedConversation?.participant.name, // Replace with the actual username from your auth logic
        message: messageText,
      };

      try {
        const response = await sendUserMessages(newMessage);
      } catch (e) {
        console.log(e);
      }

      setMessageText("");
    }
  };

  return (
    <div className="w-11/12 m-auto border h-screen">
      <div className="grid grid-cols-[30%_70%]">
        {/* Conversations List */}
        <div className="flex flex-col gap-2">
          <div className="p-2 border border-blue-400 bg-blue-300">
            <p>Messenger</p>
          </div>
          <div className="p-2">
            <input
              type="text"
              className="px-4 py-2 outline-none border border-blue-400 rounded-md w-full"
              placeholder="Search People..."
            />
          </div>
          {conversations?.map((conv) => {
            // Determine the other person in the conversation
            const otherPerson =
              conv.creator.id === user?._id
                ? conv.participant.name
                : conv.creator.name;

            return (
              <div
                className="mx-2 px-2 h-[65px] border border-slate-200 bg-slate-100 flex flex-col gap-2 rounded-md cursor-pointer"
                key={conv._id}
                onClick={() => setSelectedConversation(conv)}
              >
                <p className="text-purple-400 cursor-pointer">{otherPerson}</p>
                <p>You: Hi There!</p>
              </div>
            );
          })}
        </div>

        {/* Chat Section */}
        {selectedConversation !== null && conversationMessages ? (
          <div className="border border-l h-screen flex flex-col gap-3 justify-between">
            <div className="px-4 py-4 border border-blue-400 bg-blue-300 flex justify-between">
              <p className="ml-4">
                {
                  selectedConversation.creator.id === user?._id
                    ? selectedConversation.participant.name // If the logged-in user is the creator, show the participant's name
                    : selectedConversation.creator.name // Otherwise, show the creator's name
                }
              </p>
              {/* Use the participant's name from the messages data */}
              <FaTrashAlt />
            </div>
            <div className="flex flex-grow flex-col space-y-3 p-4">
              <div className="flex flex-col justify-between space-y-6">
                {conversationMessages.messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex flex-col space-y-1 ${
                      msg.sender.id === user?._id ? "items-end" : "items-start"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <p className="rounded-md bg-blue-200 p-2">{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Message Input */}
            <div className="mb-2 px-2 flex gap-2">
              <input
                type="text"
                className="px-4 py-2 outline-none border border-blue-400 rounded-md w-full"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type a message..."
              />
              <button
                type="submit"
                className="px-3 py-2 bg-blue-800 hover:bg-blue-950 text-white rounded-md m-auto"
                onClick={handleSendMessage}
              >
                <IoMdSend />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-screen text-xl">
            Please Select A Conversation
          </div>
        )}
      </div>
    </div>
  );
};

export default Messenger;
