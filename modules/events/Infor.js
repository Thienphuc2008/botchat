const fs = require('fs-extra');
const path = require('path');
module.exports.config = {
  name: "infor",
  eventType: ["log:subscribe"],
  version: "1.0.0",
  credits: "",
  description: "Thông báo bot hoặc người vào nhóm",
};

module.exports.run = async function ({ api, event, Threads }) {
  const threadInfo = await api.getThreadInfo(event.threadID);
  const threadData = (await Threads.getData(event.threadID)).data || {};
  const { threadID } = event;

  if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
    await api.changeNickname(`${global.config.BOTNAME}`, threadID, api.getCurrentUserID());
    return api.shareContact(`\nKết nối thành công!\nMình là bot của ${global.config.ADMIN_NAME || "VLjnh"}\nDùng ${global.config.PREFIX}help,menu để xem danh sách lệnh.\nFB_ADMIN: ${(!global.config.FACEBOOK_ADMIN) ?  "Thêm facebook admin ở config!" : global.config.FACEBOOK_ADMIN}
`, global.config.CONTACT[0], event.threadID);
  } 
};
