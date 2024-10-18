import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io.connect("http://localhost:9000");

function App() {
  const [userName, setUserName] = useState("");
  const [roomNumber, setRooomNumber] = useState("");
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");
  const [messages, setMessages] = useState([]);
  const [usersInChat, setUsersInChat] = useState([]);

  const joinRoom = () => {
    if (roomNumber !== "" && userName !== "") {
      socket.emit("join_room", { roomNumber, userName });
    }
  };

  const sendMessage = () => {
    const messageData = {
      message,
      roomNumber,
      userName,
    };

    // Emit the message to the server
    socket.emit("send_message", messageData);

    // Update the local messages state to include this message immediately
    setMessages((prevMessages) => [...prevMessages, messageData]);

    // Clear the message input after sending
    setMessage("");
  };

  useEffect(() => {
    const receiveMessage = (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    };

    const usersJoined = (data) => {
      setUsersInChat((prevUsers) => [...prevUsers, data]);
    };
    socket.on("receive_message", receiveMessage);
    socket.on("user_joined", usersJoined);

    // Cleanup the listener when the component unmounts
    return () => {
      socket.off("receive_message", receiveMessage);
      socket.off("user_joined", usersJoined);
    };
  }, [socket]);

  return (
    <div className="font-serif flex flex-col items-center mt-4 gap-4">
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Enter room number"
          className="px-4 py-2 text-sm border border-blue-200 rounded-md focus:border focus:border-blue-300 "
          value={roomNumber}
          onChange={(e) => setRooomNumber(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter username"
          className="px-4 py-2 text-sm border border-blue-200 rounded-md focus:border focus:border-blue-300 "
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <button
          className="px-4 py-2 text-center bg-blue-700 hover:bg-blue-900 rounded-lg text-white"
          onClick={joinRoom}
        >
          Join
        </button>
      </div>

      <div className="mt-4 w-1/2">
        {usersInChat?.map((msg, index) => (
          <div key={index} className="mb-2 border-b border-gray-300 py-2">
            <p className="text-sm">
              <strong>{msg.userName} Joined the Chat!</strong>
            </p>
          </div>
        ))}
      </div>

      <p className="font-serif text-base uppercase">Enter your message</p>
      <input
        type="text"
        placeholder="Enter a message"
        className="px-4 py-2 text-sm border border-blue-200 rounded-md focus:border focus:border-blue-300 w-1/2"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        className="px-4 py-2 text-center bg-blue-700 hover:bg-blue-900 rounded-lg text-white"
        onClick={sendMessage}
      >
        Send
      </button>
      <div className="mt-4 w-1/2">
        {messages?.map((msg, index) => (
          <div key={index} className="mb-2 border-b border-gray-300 py-2">
            <p className="text-sm">
              <strong>{msg.userName}:</strong> {msg.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
