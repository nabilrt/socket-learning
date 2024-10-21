import { CiLogout } from "react-icons/ci";

const ChatBottomBar = ({ user, logout }) => {
  return (
    <div className="fixed bottom-0 m-auto flex w-[28%]  space-x-3 bg-[#e6daff] p-4 ">
      <div className="mr-auto flex items-center justify-between space-x-3">
        <img
          src={user?.avatar}
          height="40px"
          width="40px"
          className="inline rounded-full "
        />
        <p className=" ">{user?.name}</p>
      </div>
      <div className="mt-3">
        <CiLogout
          className="cursor-pointer h-[16px] w-[16px]"
          onClick={logout}
        />
      </div>
    </div>
  );
};

export default ChatBottomBar;
