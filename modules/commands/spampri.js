module.exports.config = {
    name: "spampri",
    version: "1.0.0",
    hasPermssion: 3,
    Rent: 2,
    credits: "Vtuan",
    description: "spam riêng cho 1 người",
    commandCategory: "War",
    usages: "{id} [nội dung]",
    cooldowns: 1,
    envConfig: {
      spamDelay: 2
    }
  };
  
  const spamThreads = new Set();
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    const [id, ...contentArgs] = args;
    const content = (contentArgs.length !== 0) ? contentArgs.join(" ") : "Hi chao cau";
    
    if (!id) {
      return api.sendMessage('Vui lòng nhập ID của người cần spam!', threadID, messageID);
    }
    
    if (id === "stop") {
      if (spamThreads.has(threadID)) {
        spamThreads.delete(threadID);
        return api.sendMessage('Đã dừng spam!', threadID, messageID);
      }
      return api.sendMessage('Không có quá trình spam nào đang diễn ra!', threadID, messageID);
    }
  
    if (!spamThreads.has(threadID)) {
      spamThreads.add(threadID);
      api.sendMessage(`Bắt đầu spam đến ID: ${id}!`, threadID, messageID);
      while (spamThreads.has(threadID)) {
        await delay(this.config.envConfig.spamDelay * 1000);
        if (spamThreads.has(threadID)) {
          api.sendMessage(content, id);
        }
      }
    } else {
      api.sendMessage('Đang spam rồi cut!', threadID, messageID);
    }
  };
  