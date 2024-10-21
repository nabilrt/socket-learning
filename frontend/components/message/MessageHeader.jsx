import { FaTrashAlt, FaUser } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";

const MessageHeader = ({
  selectedConversation,
  user,
  setShowProfile,
  showProfile,
  setSelectedConversation,
}) => {
  return (
    <div className="px-4 py-4 border border-blue-400 bg-blue-300 flex justify-between items-center">
      <div className="flex  items-center">
        <IoIosArrowBack
          className="cursor-pointer"
          onClick={() => setSelectedConversation(null)}
        />
        <p className="ml-4 font-semibold">
          {
            selectedConversation.creator.id === user?._id
              ? selectedConversation.participant.name // If the logged-in user is the creator, show the participant's name
              : selectedConversation.creator.name // Otherwise, show the creator's name
          }
        </p>
      </div>

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
