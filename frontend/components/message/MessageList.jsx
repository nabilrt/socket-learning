import { getTimeAgo } from "../../libs/utils/helper";
import { IoMdAttach } from "react-icons/io";

const MessageList = ({ msg, user, otherAvatar }) => {
  return (
    <li className="clear-both py-4">
      <div className="flex items-end gap-3">
        <div>
          {msg.sender.id !== user?._id && (
            <img src={otherAvatar} alt="" className="rounded-full h-9 w-9" />
          )}
        </div>
        <div>
          <div className="flex gap-2 mb-2">
            <div className="relative px-5 py-3 text-white rounded-lg  bg-violet-500 ">
              {msg.attachments.length === 0 && (
                <p className="mb-0">{msg.text}</p>
              )}
              {msg.attachments && msg.attachments.length > 0 && (
                <div className="flex flex-col ">
                  {msg.attachments.map((attachment, attIndex) => {
                    const fileExtension = attachment
                      .split(".")
                      .pop()
                      ?.toLowerCase();

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
                          className="w-40 h-auto rounded-md "
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
                          <source
                            src={attachment}
                            type={`audio/${fileExtension}`}
                          />
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
                          className="w-[150px] h-[150px] rounded-md "
                        >
                          <source
                            src={attachment}
                            type={`video/${fileExtension}`}
                          />
                          Your browser does not support the video element.
                        </video>
                      );
                    }

                    // For other file types, show a download link
                    return (
                      <div
                        key={attIndex}
                        className="flex items-center space-x-2"
                      >
                        <a
                          href={attachment}
                          download
                          className="flex items-center gap-2 text-blue-500 hover:underline"
                        >
                          <IoMdAttach />
                          <p className="truncate">
                            {attachment.split("/").pop()}
                          </p>
                        </a>
                      </div>
                    );
                  })}
                </div>
              )}

              <p className="mt-1 mb-0 text-xs text-right text-white/50">
                <span className="align-middle">
                  {getTimeAgo(msg?.date_time)}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default MessageList;
