import { getTimeAgo } from "../../libs/utils/helper";
import { IoMdAttach } from "react-icons/io";

const MessageList = ({ msg, user }) => {
  return (
    <>
      <div className="flex items-center space-x-2">
        {msg.sender.id !== user?._id && (
          <img
            src={`${
              msg.sender.id === user?._id
                ? msg.sender.avatar
                : msg.receiver.avatar
            }`}
            height="40"
            width="40"
            className="rounded-full"
          ></img>
        )}

        {msg.attachments.length === 0 && (
          <p className="rounded-md bg-blue-200 p-2">{msg.text}</p>
        )}
      </div>

      {/* Attachments Section */}
      {msg.attachments && msg.attachments.length > 0 && (
        <div className="flex flex-col space-y-2">
          {msg.attachments.map((attachment, attIndex) => {
            const fileExtension = attachment.split(".").pop()?.toLowerCase();

            // Check if the attachment is an image
            if (
              fileExtension &&
              ["png", "jpg", "jpeg", "gif"].includes(fileExtension)
            ) {
              return (
                <img
                  key={attIndex}
                  src={attachment}
                  alt={`attachment-${attIndex}`}
                  className="w-40 h-auto rounded-md border"
                />
              );
            }

            // Check if the attachment is an audio file
            if (
              fileExtension &&
              ["mp3", "wav", "ogg"].includes(fileExtension)
            ) {
              return (
                <audio key={attIndex} controls className="w-full">
                  <source src={attachment} type={`audio/${fileExtension}`} />
                  Your browser does not support the audio element.
                </audio>
              );
            }

            // Check if the attachment is a video file
            if (
              fileExtension &&
              ["mp4", "ogg", "webm"].includes(fileExtension)
            ) {
              return (
                <video
                  key={attIndex}
                  controls
                  className="w-[150px] h-[150px] rounded-md border"
                >
                  <source src={attachment} type={`video/${fileExtension}`} />
                  Your browser does not support the video element.
                </video>
              );
            }

            // For other file types, show a download link
            return (
              <div key={attIndex} className="flex items-center space-x-2">
                <a
                  href={attachment}
                  download
                  className="flex items-center gap-2 text-blue-500 hover:underline"
                >
                  <IoMdAttach />
                  <p className="truncate">{attachment.split("/").pop()}</p>
                </a>
              </div>
            );
          })}
        </div>
      )}
      <p className="text-gray-500 text-sm">{getTimeAgo(msg.date_time)}</p>
    </>
  );
};

export default MessageList;
