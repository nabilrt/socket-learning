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
import { BsChatSquareDots } from "react-icons/bs";
import { FiUser } from "react-icons/fi";
import ChatSidebar from "../components/chat/ChatSidebar";

const socket = io("http://localhost:9000"); // Replace with your server URL

const Messenger = () => {
  const { user, logout } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [conversationMessages, setConversationMessages] = useState(null); // Initialize as null
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [isUploading, setIsUploading] = useState(false); // For file uploads
  const [showProfile, setShowProfile] = useState(false);
  const [selectedView, setSelectedView] = useState("chat");

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
    <div
      className={`grid ${
        showProfile ? "grid-cols-[5%_20%_60%_15%]" : "grid-cols-[5%_20%_75%]"
      } overflow-y-hidden`}
    >
      <ChatSidebar
        user={user}
        selectedView={selectedView}
        setSelectedView={setSelectedView}
        logout={logout}
      />

      <div className="tab-content bg-slate-100">
        {selectedView === "chat" ? (
          <div>
            <div className="px-6 pt-6">
              <h4 className="mb-0 text-gray-700 ">Chats</h4>

              <div className="mt-5 mb-5 rounded bg-slate-100 ">
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-200   placeholder:text-[14px] bg-white text-[14px] focus:ring-0 outline-none rounded-md"
                  placeholder="Search messages or users"
                  aria-label="Search messages or users"
                  aria-describedby="basic-addon1"
                />
              </div>
            </div>

            <div>
              <h5 className="px-6 mb-4 text-16 ">Recent</h5>

              <div className="h-[610px] px-2">
                <ul className="chat-user-list">
                  <li className="  ">
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
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div>Profile View</div>
        )}
      </div>
      <div class="w-full overflow-hidden transition-all duration-150 bg-white user-chat ">
        <div class="lg:flex">
          {selectedConversation !== null && conversationMessages ? (
            <div class="relative w-full overflow-hidden ">
              <MessageHeader
                selectedConversation={selectedConversation}
                user={user}
                setShowProfile={setShowProfile}
                showProfile={showProfile}
                setSelectedConversation={setSelectedConversation}
              />

              <div
                className="h-[80vh] p-4 lg:p-6 overflow-y-auto"
                data-simplebar=""
              >
                {conversationMessages.messages.map((msg, index) => (
                  <ul
                    className={`mb-0 flex flex-col ${
                      msg.sender.id === user?._id ? "items-end" : "items-start"
                    }`}
                    ref={scrollRef}
                  >
                    <MessageList msg={msg} user={user} />
                  </ul>
                ))}
                <div className="flex items-center text-right space-x-2">
                  {isUploading && <ImageUploadLoader />}
                  {isRecording && <RecordingLoader />}
                </div>
              </div>
              <div className="z-40 w-full p-6 mb-0 bg-white border-t lg:mb-1 border-gray-50 ">
                <div className="flex gap-2">
                  <div className="flex-grow">
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
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-screen text-xl text-center">
              Please Select A Conversation
            </div>
          )}
        </div>
      </div>
      {showProfile && (
        <ChatOtherUserInfo
          selectedConversation={selectedConversation}
          user={user}
          conversationMessages={conversationMessages}
          setShowProfile={setShowProfile}
          showProfile={showProfile}
        />
      )}
    </div>
  );
};

export default Messenger;
