import { BsChatSquareDots } from "react-icons/bs";
import { FiUser } from "react-icons/fi";
import { CiLogout } from "react-icons/ci";

const ChatSidebar = ({ user, selectedView, setSelectedView, logout }) => {
  return (
    <div className="sidebar-menu w-full lg:w-[75px] shadow lg:flex lg:flex-col flex h-screen flex-row justify-between items-center fixed lg:relative z-40 bottom-0 bg-white ">
      <div class="hidden lg:my-5 lg:block">
        <span>
          <img src="/logo.svg" alt="" className="h-[30px]" />
        </span>
      </div>

      <div class="w-full mx-auto lg:my-auto">
        <ul
          id="tabs"
          className="flex flex-row justify-center w-full lg:flex-col lg:flex nav-tabs"
        >
          <li class="flex-grow lg:flex-grow-0">
            <li className="flex-grow lg:flex-grow-0">
              <button
                href="#second"
                className={`tab-button active relative flex items-center justify-center mx-auto h-14 w-14 leading-[14px] group/tab my-2 rounded-lg hover:p-2 hover:rounded-md hover:bg-[#f3f2fd] ${
                  selectedView === "profile" && "bg-[#f3f2fd]"
                }`}
                onClick={() => setSelectedView("profile")}
              >
                <div className="absolute items-center hidden -top-10 ltr:left-0 group-hover/tab:flex rtl:right-0">
                  <div className="absolute -bottom-1 left-[40%] w-3 h-3 rotate-45 bg-black"></div>
                  <span className="relative z-10 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black rounded shadow-lg">
                    Profile
                  </span>
                </div>
                <FiUser className="w-[16px] h-[16px] " />
              </button>
            </li>
          </li>
          <li className="flex-grow lg:flex-grow-0">
            <button
              href="#second"
              className={`tab-button active relative flex items-center justify-center mx-auto h-14 w-14 leading-[14px] group/tab my-2 rounded-lg hover:p-2 hover:rounded-md hover:bg-[#f3f2fd]  ${
                selectedView === "chat" && "bg-[#f3f2fd]"
              }`}
              onClick={() => setSelectedView("chat")}
            >
              <div className="absolute items-center hidden -top-10 ltr:left-0 group-hover/tab:flex rtl:right-0">
                <div className="absolute -bottom-1 left-[40%] w-3 h-3 rotate-45 bg-black"></div>
                <span className="relative z-10 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black rounded shadow-lg">
                  Chats
                </span>
              </div>
              <BsChatSquareDots className="w-[16px] h-[16px] " />
            </button>
          </li>
        </ul>
      </div>

      <div className="w-20 my-5 lg:w-auto">
        <ul className="lg:block">
          <li className="relative lg:mt-4 dropdown lg:dropup flex flex-col gap-3 items-center">
            <img
              src={user?.avatar}
              alt=""
              className="w-10 h-10 p-1 mx-auto rounded-full bg-gray-50 "
            />
            <CiLogout
              className="cursor-pointer w-5 h-5"
              onClick={logout}
            />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ChatSidebar;
