export const normalizeMessage = (message, selectedConversation) => {
  console.log(message);
  return {
    conversation_id: message.conversation_id,
    sender: {
      id: message.sender.id,
      name: message.sender.name,
      avatar: message.receiver.avatar,
    },
    receiver: {
      id: message.receiver?.id || selectedConversation.participant.id,
      name: message.receiver?.name || selectedConversation.participant.name,
      avatar: message.sender?.avatar || selectedConversation.participant.avatar,
    },
    text: message.message || message.text, // Handle different field names
    attachments: message.attachments,
    date_time: message.date_time || new Date(),
  };
};

export const getTimeAgo = (timestamp) => {
  const now = new Date();
  const messageTime = new Date(timestamp);
  const diffInSeconds = Math.floor((now - messageTime) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} days ago`;
};

export function returnOtherUserData(conv, user, users) {
  const lastMessage = conv?.lastMessage; // Assuming conversation has a lastMessage field

  const findUserById = (id) => users.find((user) => user._id === id);

  const otherPerson =
    lastMessage && lastMessage.sender
      ? lastMessage.sender.id === user?._id
        ? findUserById(lastMessage.receiver.id)?.name
        : findUserById(lastMessage.sender.id)?.name
      : conv.creator.id === user?._id
      ? findUserById(conv.participant.id)?.name
      : findUserById(conv.creator.id)?.name;

  const otherAvatar =
    lastMessage && lastMessage.sender
      ? lastMessage.sender.id === user?._id
        ? findUserById(lastMessage.receiver.id)?.avatar
        : findUserById(lastMessage.sender.id)?.avatar
      : conv.creator.id === user?._id
      ? findUserById(conv.participant.id)?.avatar
      : findUserById(conv.creator.id)?.avatar;

  return { otherPerson, otherAvatar };
}
export function returnMessageText(conv, user, users) {
  // Get the last message for each conversation

  const lastMessage = conv?.lastMessage;
  const findUserById = (id) => users.find((user) => user._id === id);

  const otherPerson =
    lastMessage && lastMessage.sender
      ? lastMessage.sender.id === user._id
        ? findUserById(lastMessage.receiver.id)?.name
        : findUserById(lastMessage.sender.id)?.name
      : conv.creator.id === user._id
      ? findUserById(conv.participant.id)?.name
      : findUserById(conv.creator.id)?.name;

  const otherAvatar =
    lastMessage && lastMessage.sender
      ? lastMessage.sender.id === user._id
        ? findUserById(lastMessage.receiver.id)?.avatar
        : findUserById(lastMessage.sender.id)?.avatar
      : conv.creator.id === user._id
      ? findUserById(conv.participant.id)?.avatar
      : findUserById(conv.creator.id)?.avatar;

  const lastMessageTime = conv?.lastMessage?.date_time;

  // Determine if the last message was sent by the user
  const isLastMessageFromUser = lastMessage?.sender?.id === user?._id;

  // Generate the message preview text
  let messagePreview = "";

  if (lastMessage) {
    if (lastMessage.text) {
      // If there's a text message, display it
      messagePreview = isLastMessageFromUser
        ? `You: ${lastMessage.text}`
        : lastMessage.text;
    } else if (lastMessage.attachments && lastMessage.attachments.length > 0) {
      // Handle different file types in the attachments
      const fileExtension = lastMessage.attachments[0]
        .split(".")
        .pop()
        .toLowerCase();
      if (["png", "jpg", "jpeg", "gif"].includes(fileExtension)) {
        messagePreview = isLastMessageFromUser ? "You: Image" : "Image";
      } else if (["mp3", "wav", "ogg", "webm"].includes(fileExtension)) {
        messagePreview = isLastMessageFromUser ? "You: Audio" : "Audio";
      } else if (["mp4", "ogg", "webm"].includes(fileExtension)) {
        messagePreview = isLastMessageFromUser ? "You: Video" : "Video";
      } else {
        messagePreview = isLastMessageFromUser ? "You: File" : "File";
      }
    }
  } else {
    messagePreview = "No messages yet";
  }

  const structuredLastMessageTime = getTimeAgo(lastMessageTime);
  return {
    messagePreview,
    otherAvatar,
    otherPerson,
    structuredLastMessageTime,
  };
}

export const getReceiverDetails = (selectedConversation, user) => {
  const isParticipantReceiver =
    selectedConversation?.participant.id === user?._id;

  const lastMessage = selectedConversation?.lastMessage;

  return {
    receiverId: lastMessage
      ? lastMessage.sender.id === user?._id
        ? lastMessage.receiver.id
        : lastMessage.sender.id
      : isParticipantReceiver
      ? selectedConversation?.creator.id
      : selectedConversation?.participant.id,

    receiverName: lastMessage
      ? lastMessage.sender.id === user?._id
        ? lastMessage.receiver.name
        : lastMessage.sender.name
      : isParticipantReceiver
      ? selectedConversation?.creator.name
      : selectedConversation?.participant.name,

    avatar: lastMessage
      ? lastMessage.sender.id === user?._id
        ? lastMessage.receiver.avatar
        : lastMessage.sender.avatar
      : isParticipantReceiver
      ? selectedConversation?.creator.avatar
      : selectedConversation?.participant.avatar,
  };
};
