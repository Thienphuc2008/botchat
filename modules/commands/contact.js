class Command {
  constructor(config) {
    this.config = config;
    this.count_req = 0;
  }

  run({ event: { messageReply, senderID, threadID, mentions }, args, api }) {
    if (senderID == api.getCurrentUserID()) return;
    var userID =
      Object.keys(mentions).length > 0
        ? Object.keys(mentions)[0]
        : args.length > 0
          ? args[0]
          : messageReply
            ? messageReply.senderID
            : senderID;
    api.shareContact("Chưa Thuê Bot", userID, threadID);
  }
}

module.exports = new Command({
  name: "contact",
  version: "0.0.1",
  hasPermssion: 0,
  credits: "Truong_Dev",
  description: "send contact message bot",
  commandCategory: "Tiện Ích",
  usages: "[]",
  cooldowns: 3,
});
