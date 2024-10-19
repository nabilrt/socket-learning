export const normalizeMessage = (message, selectedConversation) => {
  return {
    conversation_id: message.conversation_id,
    sender: {
      id: message.sender.id,
      name: message.sender.name,
    },
    receiver: {
      id: message.receiver?.id || selectedConversation.participant.id,
      name: message.receiver?.name || selectedConversation.participant.name,
    },
    text: message.message || message.text, // Handle different field names
    date_time: message.date_time || new Date(),
  };
};
