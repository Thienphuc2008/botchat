module.exports.config = {
  name: "restart",
  version: "2.0.2",
  hasPermssion: 3,
  Rent: 2,
  credits: "Mirai Team mod by Jukie",
  description: "Khởi động lại bot",
  commandCategory: "Admin",
  usages: "restart",
  cooldowns: 5,
  dependencies: {}
}

module.exports.run = async function({ api, args, event }) {
  if (args.length == 0) {
    api.sendMessage(`Tiến hành khởi động lại!!`, event.threadID, async () => {
      await new Promise(resolve => setTimeout(resolve, 10000));
      api.sendMessage(`Bot đã khởi động lại thành công!`, event.threadID);
      process.exit(1);
    });
  }
}
