module.exports.config = {
  name: "idbox",
  version: "1.0.0",
  hasPermssion: 0,
  Rent: 1,
  credits: "manhIT",
  description: "Kiểm tra thông tin nhóm chat.",
  commandCategory: "Công Cụ",
  usages: "",
  cooldowns: 5,
  dependencies: {

  }
};

module.exports.run = async({api,event, Threads}) => {
    return api.sendMessage(`${event.threadID}`, event.threadID, event.messageID);
}