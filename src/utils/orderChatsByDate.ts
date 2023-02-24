export default function orderChatsByDate(chats: Message[]) {
  // this gives an object with dates as keys
  const groups = chats.reduce((groups: any, message: any) => {
    const date = new Date(message.timestamp).toDateString();

    if (!groups[date]) {
      groups[date] = [];
    }

    groups[date].push(message);

    return groups;
  }, {});

  // Edit: to add it in the array format instead
  const groupArrays = Object.keys(groups).map((date) => {
    return {
      date,
      messages: groups[date],
    };
  });

  return groupArrays;
}
