module.exports.config = {
  name: "spamregbox",
  version: "1.0.0",
  hasPermssion: 3,
  credits: "Vtuan",
  description: "spam tạo nhóm",
  commandCategory: "War",
  usages: "prefix spamregbox uid uid | text",
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
  const content = args.length !== 0 ? args.join(" ") : "con đĩ xin lỗi t lẹ";
  if (args[0] === "stop") {
    if (spamThreads.has(threadID)) {
      spamThreads.delete(threadID);
      return api.sendMessage("Đã dừng spam!", threadID, messageID);
    }
    return api.sendMessage("Không có quá trình spam nào đang diễn ra!", threadID, messageID);
  }

  const separatorIndex = args.indexOf("|");
  if (separatorIndex === -1 || separatorIndex < 1) {
    api.sendMessage("Vui lòng cung cấp danh sách ID người dùng và nội dung để tạo nhóm.", threadID);
    return;
  }

  const userIds = args.slice(0, separatorIndex);
  const groupContent = args.slice(separatorIndex + 1).join(" ");

  if (userIds.length < 2) {
    api.sendMessage("Vui lòng cung cấp ít nhất 2 ID người dùng để tạo nhóm.", threadID);
    return;
  }

  if (!spamThreads.has(threadID)) {
    spamThreads.add(threadID);
    api.sendMessage("Bắt đầu spam!", threadID, messageID);

    while (spamThreads.has(threadID)) {
      await delay(module.exports.config.envConfig.spamDelay * 1000);

      if (spamThreads.has(threadID)) {
        // Tạo nhóm mới
        api.createNewGroup(userIds, groupContent, async (err, groupId) => {
          if (err) {
            console.error("Đã xảy ra lỗi khi tạo nhóm:", err);
            return;
          }

          api.sendMessage(`Đã gửi nội dung vào nhóm mới ${groupId}!`, threadID);
          api.sendMessage(content );

          // Comment hoặc xóa phần rời khỏi nhóm sau khi gửi tin nhắn
           await delay(3000); // Đợi 3 giây trước khi rời khỏi nhóm
          
           try {
             await api.removeUserFromGroup(api.getCurrentUserID(), groupId);
           } catch (error) {
             console.error(`Đã xảy ra lỗi khi rời khỏi nhóm ${groupId}.`, error);
          
           }
        });
      }
    }
  } else {
    api.sendMessage("Đang spam rồi cut!", threadID, messageID);
  }
};