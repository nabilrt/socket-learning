import {
  getAllConversationMessages,
  getAllConversations,
  sendUserMessages,
} from "../libs/utils/api";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { useAuth } from "../libs/context/auth-context";
import { normalizeMessage } from "../libs/utils/helper";
import { useRef } from "react";
import { returnMessageText } from "../libs/utils/helper";
import ChatCard from "../components/chat/ChatCard";
import ChatBottomBar from "../components/chat/ChatBottomBar";
import MessageHeader from "../components/message/MessageHeader";
import MessageList from "../components/message/MessageList";
import MessageInput from "../components/message/MessageInput";
import ChatOtherUserInfo from "../components/chat/ChatOtherUserInfo";
import { ImageUploadLoader, RecordingLoader } from "../libs/utils/Loaders";
import { getReceiverDetails } from "../libs/utils/helper";

const socket = io("http://localhost:9000"); // Replace with your server URL

const Messenger = () => {
  const { user, logout } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [conversationMessages, setConversationMessages] = useState(null); // Initialize as null
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [isUploading, setIsUploading] = useState(false); // For file uploads
  const [showProfile, setShowProfile] = useState(false);

  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversationMessages]);

  // Audio Recording State
  const mediaStream = useRef(null);
  const mediaRecorder = useRef(null);
  const chunks = useRef([]);
  const [isRecording, setIsRecording] = useState(false);
  const fileRef = useRef(null);

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

  const handleFileUpload = async (e) => {
    setIsUploading(true);
    const file = e.target.files;
    const data = new FormData();
    for (let i = 0; i < file.length; i++) {
      data.append("files", file[i]);
    }
    const { receiverId, receiverName, avatar } = getReceiverDetails(
      selectedConversation,
      user
    );

    data.append("conversationId", selectedConversation._id);
    data.append("receiverId", receiverId);
    data.append("receiverName", receiverName);
    data.append("avatar", avatar);
    data.append("message", messageText); // If there's any message text

    try {
      const response = await sendUserMessages(data);
      setIsUploading(false);
    } catch (e) {
      setIsUploading(false);
      console.log(e);
    }
    setMessageText("");
  };

  const handleFileClick = () => {
    fileRef.current.click();
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
      const { receiverId, receiverName, avatar } = getReceiverDetails(
        selectedConversation,
        user
      );

      const newMessage = {
        conversationId: selectedConversation._id,
        receiverId,
        receiverName,
        avatar,
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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStream.current = stream;
      mediaRecorder.current = new MediaRecorder(stream);

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.current.push(e.data);
        }
      };

      mediaRecorder.current.onstop = async () => {
        // Create a Blob from the recorded chunks
        const recordedBlob = new Blob(chunks.current, { type: "audio/webm" });

        // Create a File object
        const file = new File([recordedBlob], "recording.webm", {
          type: "audio/webm",
        });

        const { receiverId, receiverName, avatar } = getReceiverDetails(
          selectedConversation,
          user
        );

        const data = new FormData();
        data.append("files", file);
        data.append("conversationId", selectedConversation._id);
        data.append("receiverId", receiverId);
        data.append("receiverName", receiverName);
        data.append("avatar", avatar);
        data.append("message", messageText); // If there's any message text

        try {
          // Send the FormData to the server
          const response = await sendUserMessages(data);
          console.log("Audio message sent successfully:", response);
        } catch (error) {
          console.error("Error sending audio message:", error);
        } finally {
          // Reset the chunks after sending
          chunks.current = [];
        }
      };

      // Start recording
      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.stop();
    }
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach((track) => track.stop());
    }
    setIsRecording(false);
  };

  return (
    <div className="w-11/12 m-auto border h-screen">
      <div
        className={`grid ${
          showProfile ? "grid-cols-[30%_50%_20%]" : "grid-cols-[30%_70%]"
        } gap-4`}
      >
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
            const conversationData = returnMessageText(
              conv,
              conversationMessages,
              user
            );

            return (
              <ChatCard
                selectedConversation={selectedConversation}
                conv={conv}
                setSelectedConversation={setSelectedConversation}
                conversationData={conversationData}
              />
            );
          })}
          <ChatBottomBar user={user} logout={logout} />
        </div>

        {/* Chat Section */}
        {selectedConversation !== null && conversationMessages ? (
          <div className="border border-l h-screen flex flex-col gap-3 justify-between">
            <MessageHeader
              selectedConversation={selectedConversation}
              user={user}
              setShowProfile={setShowProfile}
              showProfile={showProfile}
            />
            <div className="flex flex-grow flex-col space-y-3 p-4 overflow-y-auto">
              <div className="flex flex-col justify-between space-y-6">
                {conversationMessages.messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex flex-col space-y-1 ${
                      msg.sender.id === user?._id ? "items-end" : "items-start"
                    }`}
                    ref={scrollRef}
                  >
                    <MessageList msg={msg} user={user} />
                  </div>
                ))}
                <div className="flex items-center text-right space-x-2">
                  {isUploading && <ImageUploadLoader />}
                  {isRecording && <RecordingLoader />}
                </div>
              </div>
            </div>

            {/* Message Input */}
            <MessageInput
              handleFileClick={handleFileClick}
              fileRef={fileRef}
              handleFileUpload={handleFileUpload}
              isUploading={isUploading}
              messageText={messageText}
              setMessageText={setMessageText}
              startRecording={startRecording}
              stopRecording={stopRecording}
              isRecording={isRecording}
              handleSendMessage={handleSendMessage}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-screen text-xl">
            Please Select A Conversation
          </div>
        )}

        {showProfile && (
          <ChatOtherUserInfo
            selectedConversation={selectedConversation}
            user={user}
            conversationMessages={conversationMessages}
          />
        )}
      </div>
    </div>
  );
};

export default Messenger;
