import { FaArrowDown, FaArrowUp, FaEdit } from "react-icons/fa";
import { RiPencilFill } from "react-icons/ri";

const ChatProfileView = ({
  user,
  setProfileDataToggle,
  profileDataToggle,
  fileRef,
  handleFileUpload,
  handleFileClick,
}) => {
  return (
    <div>
      <div className="px-6 pt-6">
        <h4 className="mb-0 text-gray-700 font-semibold">Profile</h4>
      </div>
      <div>
        <div className="p-6 text-center border-b border-gray-100 ">
          <div className="relative mb-4">
            <img
              src={user?.avatar}
              className="w-24 h-24 p-1 mx-auto border border-gray-200 rounded-full "
              alt=""
            />
            <button
              className="absolute bottom-0 p-3  w-10 h-10 bg-gray-200 rounded-full "
              onClick={handleFileClick}
            >
              <RiPencilFill className="leading-10 h-[16px] w-[16px]" />
            </button>
            <input
              type="file"
              className="hidden"
              ref={fileRef}
              onChange={handleFileUpload}
            />
          </div>
          <h5 className="mb-1 text-[16px] ">{user?.name}</h5>
        </div>
        <div className="p-6 h-[550px]" data-simplebar="">
          <div>
            <div className="text-gray-700 accordion-item">
              <h2>
                <button
                  type="button"
                  className="flex items-center justify-between w-full px-3 py-2 font-medium text-left border border-gray-200 rounded-t  "
                  onClick={() => setProfileDataToggle(!profileDataToggle)}
                >
                  <span className="m-0 text-[14px] font-medium">
                    Personal Info
                  </span>
                  {profileDataToggle ? (
                    <FaArrowUp className="cursor-pointer" />
                  ) : (
                    <FaArrowDown className="cursor-pointer" />
                  )}
                </button>
              </h2>
              {profileDataToggle && (
                <div className=" bg-white border border-t-0 border-gray-100   ">
                  <div className="p-5">
                    <div className="flex justify-between">
                      <div>
                        <p className="mb-1 text-gray-500 ">Name</p>
                        <h5 className="text-sm ">{user?.name}</h5>
                      </div>
                      <div className="flex ">
                        <button
                          type="button"
                          className="px-2 py-0 flex gap-1 items-center btn bg-slate-200 border-transparent rounded hover:bg-slate-300 transition-all ease-in-out "
                        >
                          <FaEdit />
                          <p className="text-sm">Edit</p>
                        </button>
                      </div>
                    </div>
                    <div className="mt-5">
                      <p className="mb-1 text-gray-500 ">Email</p>
                      <h5 className="text-sm ">{user?.email}</h5>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatProfileView;
