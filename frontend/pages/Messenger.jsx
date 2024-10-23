import {
  createConversation,
  getAllConversationMessages,
  getAllConversations,
  getAllUsers,
  sendUserMessages,
  uploadAvatarForUser,
  userDetails,
} from "../libs/utils/api";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { useAuth } from "../libs/context/auth-context";
import { normalizeMessage, returnOtherUserData } from "../libs/utils/helper";
import { useRef } from "react";
import { returnMessageText } from "../libs/utils/helper";
import ChatCard from "../components/chat/ChatCard";
import MessageHeader from "../components/message/MessageHeader";
import MessageList from "../components/message/MessageList";
import MessageInput from "../components/message/MessageInput";
import ChatOtherUserInfo from "../components/chat/ChatOtherUserInfo";
import { ImageUploadLoader, RecordingLoader } from "../libs/utils/Loaders";
import { getReceiverDetails } from "../libs/utils/helper";
import ChatSidebar from "../components/chat/ChatSidebar";
import ChatSearchUser from "../components/chat/ChatSearchUser";
import { FaArrowDown, FaArrowUp, FaEdit } from "react-icons/fa";
import ChatProfileView from "../components/chat/ChatProfileView";

const socket = io("http://localhost:9000"); // Replace with your server URL

const Messenger = () => {
  const { user, logout, setUser } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [conversationMessages, setConversationMessages] = useState(null); // Initialize as null
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [isUploading, setIsUploading] = useState(false); // For file uploads
  const [showProfile, setShowProfile] = useState(false);
  const [selectedView, setSelectedView] = useState("chat");
  const [users, setAllUsers] = useState([]);

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

  const userClick = async (user) => {
    console.log(user);
    const data = {
      id: user._id,
      participant: user.name,
      avatar: user.avatar || null,
    };
    try {
      const response = await createConversation(data);
      setSelectedConversation(response.data.conversation);
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

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    const data = new FormData();
    data.append("file", file);
    try {
      const response = await uploadAvatarForUser(data);
      if (response.status === 200) {
        const response = await userDetails();
        if (response?.data && response?.data.user) {
          setUser(response.data.user);
          localStorage.setItem("user", JSON.stringify(response.data.user)); // <-- Sync with localStorage
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleFileClick = () => {
    fileRef.current.click();
  };

  const allUsers = async (searchQuery = "") => {
    try {
      const response = await getAllUsers(searchQuery);
      setAllUsers(response.data.users); // Update state with the returned users
    } catch (e) {
      console.log(e);
    }
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [profileDataToggle, setProfileDataToggle] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm); // Set the debounced search term
    }, 500); // 500ms delay

    // Cleanup timeout if user starts typing again before 500ms
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]); // Only run this effect if `searchTerm` changes

  // Fetch users whenever the debounced search term changes
  useEffect(() => {
    if (debouncedSearchTerm) {
      allUsers(debouncedSearchTerm); // Fetch users with the debounced search term
    } else {
      allUsers(); // Fetch all users if search term is empty
    }
  }, [debouncedSearchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value); // Update the search term on every input change
  };

  useEffect(() => {
    getConversations();
    allUsers();
  }, [selectedConversation]);

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

        getConversations();
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
        selectedConversation !== null && showProfile
          ? "grid-cols-[4%_21%_60%_15%]"
          : selectedConversation !== null && !showProfile
          ? "grid-cols-[4%_21%_75%]"
          : selectedConversation === null &&
            !showProfile &&
            "grid-cols-[4%_96%]"
      } `}
    >
      <ChatSidebar
        user={user}
        selectedView={selectedView}
        setSelectedView={setSelectedView}
        logout={logout}
      />

      <div className=" bg-[#f5f7fb]">
        {selectedView === "chat" ? (
          <div>
            <div className="px-6 pt-6">
              <h4 className="mb-0 text-gray-700 font-semibold">Chats</h4>

              <ChatSearchUser
                handleSearch={handleSearch}
                setDropdownOpen={setDropdownOpen}
                dropdownOpen={dropdownOpen}
                users={users}
                userClick={userClick}
              />
            </div>

            <div>
              <h5 className="px-6 mb-4 text-16 ">Recent</h5>

              <div className="h-[610px] px-2">
                <ul className="chat-user-list">
                  <div className=" flex flex-col gap-2 ">
                    {conversations?.map((conv) => {
                      const conversationData = returnMessageText(
                        conv,
                        user,
                        users
                      );
                      return (
                        <ChatCard
                          selectedConversation={selectedConversation}
                          conv={conv}
                          setSelectedConversation={setSelectedConversation}
                          conversationData={conversationData}
                          setShowProfile={setShowProfile}
                        />
                      );
                    })}
                  </div>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <ChatProfileView
            user={user}
            setProfileDataToggle={setProfileDataToggle}
            profileDataToggle={profileDataToggle}
            handleFileUpload={handleAvatarUpload}
            fileRef={fileRef}
            handleFileClick={handleFileClick}
          />
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
                users={users}
              />

              <div
                className="h-[80vh] p-4 lg:p-6 overflow-y-auto"
                data-simplebar=""
              >
                {conversationMessages.messages.map((msg, index) => {
                  const { otherAvatar } = returnOtherUserData(
                    selectedConversation,
                    user,
                    users
                  );

                  return (
                    <ul
                      key={index}
                      className={`mb-0 flex flex-col ${
                        msg.sender.id === user?._id
                          ? "items-end"
                          : "items-start"
                      }`}
                      ref={scrollRef}
                    >
                      <MessageList
                        msg={msg}
                        user={user}
                        otherAvatar={otherAvatar}
                      />
                    </ul>
                  );
                })}
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
      {showProfile &&
        (() => {
          const { otherPerson, otherAvatar } = returnMessageText(
            selectedConversation,
            user,
            users
          );
          return (
            <ChatOtherUserInfo
              selectedConversation={selectedConversation}
              user={user}
              conversationMessages={conversationMessages}
              setShowProfile={setShowProfile}
              showProfile={showProfile}
              otherPerson={otherPerson}
              otherAvatar={otherAvatar}
            />
          );
        })()}
    </div>
  );
};

export default Messenger;
