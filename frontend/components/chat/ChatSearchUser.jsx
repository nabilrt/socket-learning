const ChatSearchUser = ({
  handleSearch,
  setDropdownOpen,
  dropdownOpen,
  users,
  userClick,
}) => {
  return (
    <div className="mt-5 mb-5 rounded bg-slate-100 relative">
      <input
        type="text"
        className="w-full px-4 py-2 border border-gray-200   placeholder:text-[14px] bg-white text-[14px] focus:ring-0 outline-none rounded-md"
        placeholder="Search messages or users"
        aria-label="Search messages or users"
        aria-describedby="basic-addon1"
        onChange={handleSearch} // Trigger search on input change
        onFocus={() => setDropdownOpen(true)} // Show dropdown when focused
        onBlur={() => setTimeout(() => setDropdownOpen(false), 100)} // Close dropdown on blur with a slight delay
      />
      {dropdownOpen && (
        <div className="absolute w-full bg-white shadow-lg z-100">
          <ul>
            {users.map((user) => (
              <li
                key={user._id}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                <div
                  className="flex items-center"
                  onClick={() => {
                    userClick(user);
                  }}
                >
                  <img
                    src={user.avatar}
                    alt="avatar"
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <span>{user.name}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ChatSearchUser;
