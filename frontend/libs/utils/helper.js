export const normalizeMessage = (message, selectedConversation) => {
  return {
    conversation_id: message.conversation_id,
    sender: {
      id: message.sender.id,
      name: message.sender.name,
      avatar: message.sender.avatar,
    },
    receiver: {
      id: message.receiver?.id || selectedConversation.participant.id,
      name: message.receiver?.name || selectedConversation.participant.name,
      avatar: message.receiver?.avatar || selectedConversation.participant.avatar,
    },
    text: message.message || message.text, // Handle different field names
    attachments: message.attachments,
    date_time: message.date_time || new Date(),
  };
};
