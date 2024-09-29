module.exports.config = {
  name: "regboxspam",
  version: "1.0.0",
  hasPermission: 3,
  Rent: 2,
  credits: "Vtuan",
  description: "Spam tạo nhóm và gửi nội dung vào nhóm",
  commandCategory: "War",
  usages: "[UserID1] [UserID2] [UserID3...] | Tên Nhóm + Nội dung spam",
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
  const threadID = event.threadID;

  if (args[0] === "stop") {
    if (spamThreads.size === 0) {
      return api.sendMessage('Không có quá trình spam nào đang diễn ra!', threadID);
    }

    for (let groupId of spamThreads) {
      api.sendMessage('Đã dừng spam!', groupId);
    }
    
    spamThreads.clear();
    return api.sendMessage('Đã dừng spam ở tất cả các nhóm.', threadID);
  }

  const separatorIndex = args.indexOf("|");
  if (separatorIndex === -1 || separatorIndex < 2) {
    api.sendMessage("Vui lòng cung cấp ít nhất 2 ID người dùng và tên nhóm để tạo nhóm.", threadID);
    return;
  }

  const userIds = args.slice(0, separatorIndex);
  const groupTitle = args.slice(separatorIndex + 1, -1).join(" ");
  const spamContent = args.slice(-1).join(" ");

  if (userIds.length < 2) {
    api.sendMessage("Vui lòng cung cấp ít nhất 2 ID người dùng để tạo nhóm.", threadID);
    return;
  }

  api.createNewGroup(userIds, groupTitle, async (err, groupId) => {
    if (err) {
      api.sendMessage("Đã xảy ra lỗi khi tạo nhóm.", threadID);
      return;
    }

    spamThreads.add(groupId);
    api.sendMessage(`Bắt đầu spam vào nhóm mới!`, threadID);
    while (spamThreads.has(groupId)) {
      await delay(this.config.envConfig.spamDelay * 1000);
      if (spamThreads.has(groupId)) {
        api.sendMessage(spamContent, groupId);
      }
    }
  });
};
