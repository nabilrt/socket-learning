import { FaTrashAlt, FaUser } from "react-icons/fa";

const MessageHeader = ({
  selectedConversation,
  user,
  setShowProfile,
  showProfile,
}) => {
  return (
    <div className="px-4 py-4 border border-blue-400 bg-blue-300 flex justify-between items-center">
      <p className="ml-4">
        {
          selectedConversation.creator.id === user?._id
            ? selectedConversation.participant.name // If the logged-in user is the creator, show the participant's name
            : selectedConversation.creator.name // Otherwise, show the creator's name
        }
      </p>
      {/* Use the participant's name from the messages data */}
      <div className="flex gap-4 items-center">
        <FaUser
          onClick={() => setShowProfile(!showProfile)}
          className="cursor-pointer"
        />
        <FaTrashAlt />
      </div>
    </div>
  );
};

export default MessageHeader;
