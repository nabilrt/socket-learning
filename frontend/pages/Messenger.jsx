import { FaTrashAlt } from "react-icons/fa";
import { IoMdAttach, IoMdSend } from "react-icons/io";
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
import { FaMicrophone } from "react-icons/fa";

const socket = io("http://localhost:9000"); // Replace with your server URL

const Messenger = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [conversationMessages, setConversationMessages] = useState(null); // Initialize as null
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [isUploading, setIsUploading] = useState(false); // For file uploads
  const [isDataRecording, setIsDataRecording] = useState(false); // For audio recording
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
    data.append("conversationId", selectedConversation._id);
    data.append(
      "receiverId",
      selectedConversation?.participant.id === user?._id
        ? selectedConversation?.creator.id
        : selectedConversation?.participant.id
    );
    data.append(
      "receiverName",
      selectedConversation?.participant.id === user?._id
        ? selectedConversation?.creator.name
        : selectedConversation?.participant.name
    );
    data.append(
      "avatar",
      selectedConversation?.participant.id === user?._id
        ? selectedConversation?.creator.avatar
        : selectedConversation?.participant.avatar
    );
    data.append("message", messageText);

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
      const newMessage = {
        conversationId: selectedConversation._id,
        receiverId:
          selectedConversation?.participant.id === user?._id
            ? selectedConversation?.creator.id
            : selectedConversation?.participant.id, // Replace with the actual user ID from your auth logic
        receiverName:
          selectedConversation?.participant.id === user?._id
            ? selectedConversation?.creator.name
            : selectedConversation?.participant.name, // Replace with the actual username from your auth logic
        avatar:
          selectedConversation?.participant.id === user?._id
            ? selectedConversation?.creator.avatar
            : selectedConversation?.participant.avatar, // Replace with the actual username from your auth logic
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

        // Prepare the FormData
        const data = new FormData();
        data.append("files", file);
        data.append("conversationId", selectedConversation._id);
        data.append(
          "receiverId",
          selectedConversation?.participant.id === user?._id
            ? selectedConversation?.creator.id
            : selectedConversation?.participant.id
        );
        data.append(
          "receiverName",
          selectedConversation?.participant.id === user?._id
            ? selectedConversation?.creator.name
            : selectedConversation?.participant.name
        );
        data.append(
          "avatar",
          selectedConversation?.participant.id === user?._id
            ? selectedConversation?.creator.avatar
            : selectedConversation?.participant.avatar
        );
        data.append("message", messageText); // If there's any message text

        try {
          setIsDataRecording(true);

          // Send the FormData to the server
          const response = await sendUserMessages(data);
          console.log("Audio message sent successfully:", response);
          setIsDataRecording(false);
        } catch (error) {
          setIsDataRecording(false);
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
                    ref={scrollRef}
                  >
                    <div className="flex items-center space-x-2">
                      {isUploading && (
                        <>
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                          <p className="ml-2 text-blue-500">Uploading...</p>
                        </>
                      )}
                      {isDataRecording && (
                        <>
                          <span className="h-3 w-3 bg-red-500 rounded-full animate-pulse"></span>
                          <p className="ml-2 text-red-500">Recording...</p>
                        </>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      {msg.text !== "" && (
                        <p className="rounded-md bg-blue-200 p-2">{msg.text}</p>
                      )}
                    </div>

                    {/* Attachments Section */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="flex flex-col space-y-2">
                        {msg.attachments.map((attachment, attIndex) => {
                          const fileExtension = attachment
                            .split(".")
                            .pop()
                            ?.toLowerCase();

                          // Check if the attachment is an image
                          if (
                            fileExtension &&
                            ["png", "jpg", "jpeg", "gif"].includes(
                              fileExtension
                            )
                          ) {
                            return (
                              <img
                                key={attIndex}
                                src={attachment}
                                alt={`attachment-${attIndex}`}
                                className="w-40 h-auto rounded-md border"
                              />
                            );
                          }

                          // Check if the attachment is an audio file
                          if (
                            fileExtension &&
                            ["mp3", "wav", "ogg"].includes(fileExtension)
                          ) {
                            return (
                              <audio key={attIndex} controls className="w-full">
                                <source
                                  src={attachment}
                                  type={`audio/${fileExtension}`}
                                />
                                Your browser does not support the audio element.
                              </audio>
                            );
                          }

                          // Check if the attachment is a video file
                          if (
                            fileExtension &&
                            ["mp4", "ogg", "webm"].includes(fileExtension)
                          ) {
                            return (
                              <video
                                key={attIndex}
                                controls
                                className="w-[150px] h-[150px] rounded-md border"
                              >
                                <source
                                  src={attachment}
                                  type={`video/${fileExtension}`}
                                />
                                Your browser does not support the video element.
                              </video>
                            );
                          }

                          // For other file types, show a download link
                          return (
                            <div
                              key={attIndex}
                              className="flex items-center space-x-2"
                            >
                              <a
                                href={attachment}
                                download
                                className="flex items-center gap-2 text-blue-500 hover:underline"
                              >
                                <IoMdAttach />
                                <p className="truncate">
                                  {attachment.split("/").pop()}
                                </p>
                              </a>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <div className="mb-2 px-2 flex gap-2">
              <button
                className="px-3 py-2 bg-blue-800 hover:bg-blue-950 text-white rounded-md m-auto"
                onClick={handleFileClick}
              >
                <IoMdAttach />
              </button>
              <input
                type="file"
                className="hidden"
                ref={fileRef}
                onChange={handleFileUpload}
                multiple
                disabled={isUploading}
              />
              <input
                type="text"
                className="px-4 py-2 outline-none border border-blue-400 rounded-md w-full"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type a message..."
              />
              <button
                className="px-3 py-2 bg-blue-800 hover:bg-blue-950 text-white rounded-md m-auto"
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onMouseLeave={stopRecording} // In case the user drags the mouse away
                disabled={isRecording}
              >
                <FaMicrophone />
              </button>
              <button
                type="submit"
                className="px-3 py-2 bg-blue-800 hover:bg-blue-950 text-white rounded-md m-auto"
                onClick={handleSendMessage}
                disabled={isUploading || isRecording}
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
