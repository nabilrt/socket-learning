import { IoMdAttach, IoMdSend } from "react-icons/io";
import { FaMicrophone } from "react-icons/fa";

const MessageInput = ({
  handleFileClick,
  fileRef,
  handleFileUpload,
  isUploading,
  messageText,
  setMessageText,
  startRecording,
  stopRecording,
  isRecording,
  handleSendMessage,
}) => {
  return (
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
  );
};

export default MessageInput;
