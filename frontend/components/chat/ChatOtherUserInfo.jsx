const ChatOtherUserInfo = ({
  selectedConversation,
  user,
  conversationMessages,
}) => {
  return (
    <div
      className={`transition-all duration-300 ease-in-out transform  overflow-hidden`}
    >
      {selectedConversation !== null && (
        <div
          className={`p-4 flex flex-col gap-4 items-center transition-all duration-300 ease-in-out transform overflow-hidden`}
        >
          <div className="mt-4">
            <img
              src={
                selectedConversation.creator.id !== user?._id
                  ? selectedConversation.creator.avatar
                  : selectedConversation.participant.avatar
              }
              height="150"
              width="150"
              className="rounded-full p-1 border border-gray-300"
              alt="User Avatar"
            />
          </div>
          <div>
            <p className="text-xl">
              {selectedConversation.creator.id !== user?._id
                ? selectedConversation.creator.name
                : selectedConversation.participant.name}
            </p>
          </div>
          <p>Attachments</p>
          <div className="bg-blue-100 border border-slate-100 p-2 mr-auto">
            {/* Render all attachments here */}
            {conversationMessages?.messages?.map(
              (message, index) =>
                message?.attachments.length > 0 && (
                  <div key={index} className="flex items-center gap-4 mb-2">
                    {message?.attachments.map((attachment, attachmentIndex) => (
                      <div
                        key={attachmentIndex}
                        className="flex items-center p-2 bg-slate-100 border w-full justify-between"
                      >
                        {/* Attachment link */}
                        <div className="flex flex-col gap-2">
                          <a
                            href={attachment}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            {attachment.split("/").pop()}
                          </a>
                          <p>
                            {message.sender.id === user?._id
                              ? "Shared by you"
                              : `Shared by ${message.sender.name}`}
                          </p>
                        </div>

                        {/* Download icon */}
                        <a
                          href={attachment}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V3"
                            />
                          </svg>
                        </a>
                      </div>
                    ))}
                  </div>
                )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatOtherUserInfo;
