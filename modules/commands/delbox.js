module.exports.config = {
  name: "delbox",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "Vtuan",
  Rent: 1,
  description: "Dùng để rã box",
  commandCategory: "Quản Trị Viên",
  usages: "",
  cooldowns: 5,
};

module.exports.run = async function({ api, event, Threads }) {
  const threadID = event.threadID;
  const botID = api.getCurrentUserID();
  const threadInfo = await api.getThreadInfo(threadID);
  const botIsAdmin = threadInfo.adminIDs.some(e => e.id == botID);
  if (!botIsAdmin) return api.sendMessage("Bot phải là quản trị viên thì mới rã box được!", threadID);
  const memberIDs = threadInfo.participantIDs.filter(id => {
    return id != botID && !threadInfo.adminIDs.some(admin => admin.id == id);
  });

  for (const userID of memberIDs) {
    await new Promise(resolve => setTimeout(resolve, 500));
    api.removeUserFromGroup(userID, threadID);
  }
  api.sendMessage("Vĩnh Biệt Box!!", threadID);
};