const ChatCard = ({
  selectedConversation,
  conv,
  conversationData,
  setSelectedConversation,
}) => {
  return (
    <div
      className={`px-5 py-[15px]  hover:bg-purple-200 ${
        selectedConversation && selectedConversation._id === conv._id
          ? "bg-purple-100"
          : "bg-purple-200"
      }`}
      onClick={() => setSelectedConversation(conv)}
    >
      <div className="flex gap-4">
        <div className="relative self-center ltr:mr-3 rtl:ml-3">
          <img
            src={conversationData.otherAvatar}
            className="rounded-full w-9 h-9"
            alt=""
          />
        </div>

        <div className="flex-grow overflow-hidden">
          <h5 className="mb-1 text-sm truncate ">
            {conversationData.otherPerson}
          </h5>
          <p className="mb-0 text-gray-500 truncate text-[12px]">
            {conversationData.messagePreview}
          </p>
        </div>
        <div className="text-gray-500 text-[11px] ">
          {conversationData.structuredLastMessageTime}
        </div>
      </div>
    </div>
  );
};

export default ChatCard;
