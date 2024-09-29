module.exports.config = {
	name: "log",
	eventType: ["log:unsubscribe","log:subscribe","log:thread-name"],
	version: "1.0.0",
	credits: "Mirai Team",//Mod by H.Thanh
	description: "Ghi lại thông báo các hoạt động của Bot",
    envConfig: {
        enable: true
    }
};

module.exports.run = async function({ api, event, Threads }) {
    const logger = require("../../utils/log");
    if (!global.configModule[this.config.name].enable) return;
  const moment = require("moment-timezone");
  const time = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss - D/MM/YYYY");
  let threadInfo = await api.getThreadInfo(event.threadID);
  nameThread =threadInfo.threadName;
  let threadMem = threadInfo.participantIDs.length;
  let qtv = threadInfo.adminIDs.length;
  let color = threadInfo.color;
  let sex = threadInfo.approvalMode;
  var pd = sex == false ? 'Tắt' : sex == true ? 'Bật' : '\n';
  let icon = threadInfo.emoji;
  const nameUser = global.data.userName.get(event.author) || await Users.getNameUser(event.author);
    var formReport =  "==== BOT THÔNG BÁO ====" +
"\n━━━━━━━━━━━━━━━━━━\n→ Tên nhóm: " + nameThread +     
"\n→ ID nhóm: " + event.threadID +
"\n→ Tổng số thành viên: " + threadMem +
"\n→ Số quản trị viên: " + qtv +
"\n→ Phê duyệt: " + pd + 
"\n→ Biểu tượng: " + icon +
"\n→ Mã giao diện: " + color +
"\n━━━━━━━━━━━━━━━━━━\n→ Hành động: {task}" +
"\n→ Tên: " + nameUser +      
"\n→ Link Fb: https://www.facebook.com/profile.php?id=" + event.author +
"\n→ Thời gian: " + time + " ",
        task = "";
    switch (event.logMessageType) {
        case "log:thread-name": {
                    newName = event.logMessageData.name || "Tên không tồn tại";
            task = "Người dùng thay đổi tên nhóm thành " + newName + "";
            await Threads.setData(event.threadID, {name: newName});
            break;
        }
        case "log:subscribe": {
            if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) task = "✅ Người dùng đã thêm Bot vào một nhóm mới";
            break;
        }
        case "log:unsubscribe": {
            if (event.logMessageData.leftParticipantFbId== api.getCurrentUserID()) task = "⛔ Người dùng đã kick Bot ra khỏi nhóm"
            break;
        }
        default: 
            break;
    }

    if (task.length == 0) return;

    formReport = formReport
    .replace(/\{task}/g, task);

    return api.sendMessage(formReport, global.config.ADMINBOT[0], (error, info) => {
        if (error) return logger(formReport, "Events đang được thực thi");
    });
}