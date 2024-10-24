import { FaUser } from "react-icons/fa";

import { IoIosArrowBack } from "react-icons/io";
import { returnMessageText } from "../../libs/utils/helper";
const MessageHeader = ({
  selectedConversation,
  user,
  setShowProfile,
  showProfile,
  setSelectedConversation,
  users,
}) => {
  const conversationData = returnMessageText(selectedConversation, user, users);
  return (
    <div className="p-4 border-b border-gray-100 lg:p-6 ">
      <div className="grid items-center grid-cols-12">
        <div className="col-span-8 sm:col-span-4">
          <div className="flex gap-4 items-center">
            <IoIosArrowBack
              className="cursor-pointer"
              onClick={() => {
                setShowProfile(false);
                setSelectedConversation(null);
              }}
            />
            <div className="rtl:ml-3 ltr:mr-3">
              <img
                src={conversationData.otherAvatar}
                className="rounded-full h-9 w-9"
                alt=""
              />
            </div>
            <div className="flex-grow overflow-hidden">
              <h5 className="mb-0 truncate text-16 ltr:block rtl:hidden">
                <p className="text-gray-800 ">{conversationData.otherPerson}</p>
              </h5>
            </div>
          </div>
        </div>
        <div className="col-span-4 sm:col-span-8">
          <ul className="flex items-center justify-end lg:gap-4">
            <li className="px-3">
              <div className="relative dropstart">
                <button
                  className="p-0 text-xl text-gray-500 border-0 btn dropdown-toggle "
                  type="button"
                  data-bs-toggle="dropdown"
                  id="dropdownMenuButton10"
                  data-tw-auto-close="outside"
                >
                  <FaUser
                    onClick={() => setShowProfile(!showProfile)}
                    className="cursor-pointer"
                  />
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MessageHeader;
