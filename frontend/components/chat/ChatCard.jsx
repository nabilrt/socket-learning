const ChatCard = ({
  selectedConversation,
  conv,
  conversationData,
  setSelectedConversation,
}) => {
  return (
    <div
      className={`flex space-x-3 bg-[#e6daff] ${
        selectedConversation && selectedConversation._id === conv._id
          ? "bg-[#e6daff]  "
          : "bg-white "
      }  overflow-y-auto p-4 pl-4 shadow-sm hover:bg-[#e2dcf3]`}
      onClick={() => setSelectedConversation(conv)}
    >
      <div className="flex w-full  space-x-3">
        <div className="mr-auto flex items-center space-x-3">
          <img src={conversationData.otherAvatar} height="50" width="50" />
          <div className="flex flex-col space-y-2">
            <h2 className="text-sm font-semibold">
              {conversationData.otherPerson}
            </h2>
            <p className="text-xs">{conversationData.messagePreview}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatCard;
