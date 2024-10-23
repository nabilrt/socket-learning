import { FaArrowDown, FaArrowUp, FaUser } from "react-icons/fa";
import { IoMdAttach } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { LuDownload } from "react-icons/lu";
import { FaFileAlt } from "react-icons/fa";
import { useState } from "react";
const ChatOtherUserInfo = ({
  selectedConversation,
  user,
  conversationMessages,
  setShowProfile,
  showProfile,
  otherPerson,
  otherAvatar,
}) => {
  const [showAttchments, setShowAttachments] = useState(false);
  const [showProfileData, setShowProfileData] = useState(false);
  return (
    <div className=" h-[100vh] bg-white shadow overflow-y-hidden mb-[85px] lg:mb-0  border-l-4 border-gray-50  absolute xl:relative top-0 bottom-0">
      <div className="px-6 pt-6">
        <div className="text-end">
          <button
            type="button"
            className="text-2xl text-gray-500 border-0 btn "
            id="user-profile-hide"
            onClick={() => setShowProfile(!showProfile)}
          >
            <IoClose />
          </button>
        </div>
      </div>
      <div className="p-6 text-center border-b border-gray-100 ">
        <div className="mb-4">
          <img
            src={otherAvatar}
            className="w-24 h-24 p-1 mx-auto border border-gray-100 rounded-full "
            alt=""
          />
        </div>
        <h5 className="mb-1 text-16 ">{otherPerson}</h5>
      </div>
      {/* End profile user */}
      {/* Start user-profile-desc */}
      <div className="p-6 h-[550px]" data-simplebar="">
        <div data-tw-accordion="collapse">
          <div className="text-gray-700 accordion-item">
            <h2>
              <button
                type="button"
                className="flex items-center justify-between w-full px-3 py-2 font-medium text-left border border-gray-100 rounded-t accordion-header group active "
              >
                <FaUser />
                <span className="m-0 text-[14px]  font-semibold ">About</span>

                {showProfileData ? (
                  <FaArrowUp
                    onClick={() => setShowProfileData(!showProfileData)}
                  />
                ) : (
                  <FaArrowDown
                    onClick={() => setShowProfileData(!showProfileData)}
                  />
                )}
              </button>
            </h2>
            {showProfileData && (
              <div className="block bg-white border border-t-0 border-gray-100 accordion-body">
                <div className="p-5">
                  <div>
                    <p className="mb-1 text-gray-500 ">Name</p>
                    <h5 className="text-sm ">{otherPerson}</h5>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="mt-2 text-gray-700 accordion-item ">
            <h2>
              <button
                type="button"
                className="flex items-center justify-between w-full px-3 py-2 font-medium text-left border border-gray-100 rounded accordion-header group"
              >
                <IoMdAttach />
                <span className="m-0 text-[14px]  font-semibold ">
                  Attached Files
                </span>
                {showAttchments ? (
                  <FaArrowUp
                    onClick={() => setShowAttachments(!showAttchments)}
                  />
                ) : (
                  <FaArrowDown
                    onClick={() => setShowAttachments(!showAttchments)}
                  />
                )}
              </button>
            </h2>
            {showAttchments && (
              <div className="overflow-y-auto bg-white border border-t-0 border-gray-100 accordion-body ">
                <div className="p-5 ">
                  {conversationMessages?.messages?.map(
                    (message, index) =>
                      message?.attachments.length > 0 && (
                        <div key={index} className="">
                          {message?.attachments.map(
                            (attachment, attachmentIndex) => (
                              <div className="p-2 mb-2 border rounded border-gray-100/80 ">
                                <div className="flex items-center">
                                  <div className="flex items-center justify-center w-10 h-10 rounded ltr:mr-3 bg-violet-500/20 ">
                                    <div className="text-xl p-2 rounded-lg text-violet-500 ">
                                      <FaFileAlt />
                                    </div>
                                  </div>
                                  <div className="flex-grow">
                                    <div className="text-start ml-2">
                                      <h5 className="mb-1 text-sm ">
                                        {attachment
                                          .split("/")
                                          .pop()
                                          .substring(0, 9)}
                                        .
                                        {attachment
                                          .split("/")
                                          .pop()
                                          .split(".")
                                          .pop()}
                                      </h5>
                                      <p className="mb-0 text-gray-500 text-[13px] ">
                                        {message.sender.id === user?._id
                                          ? "Shared by you"
                                          : `Shared by ${message.sender.name}`}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatOtherUserInfo;
