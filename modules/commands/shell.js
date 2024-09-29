module.exports.config = {
	name: "shell",
	version: "7.3.1",
	hasPermssion: 3,
	credits: "Nguyen 🌏",
	description: "running shell",
	commandCategory: "Admin",
	usages: "[shell]",
	cooldowns: 0,
        images: [],
	dependencies: {
		"child_process": ""
	}
};
module.exports.run = async function({ api, event, args, Threads, Users, Currencies, models }) {    
const { exec } = require("child_process");
const permission = global.config.ADMINBOT;
	if (!permission.includes(event.senderID))  api.sendMessage( "Đã báo cáo về admin vì tội dùng lệnh cấm" , event.threadID, event.messageID);
  var idad = global.config.ADMINBOT;
  const permissions = global.config.ADMINBOT;
var name = global.data.userName.get(event.senderID)
var threadInfo = await api.getThreadInfo(event.threadID);
var nameBox = threadInfo.threadName;
  var time = require("moment-timezone").tz("Asia/Ho_Chi_Minh").format("HH:mm:ss (D/MM/YYYY) (dddd)");
	if (!permissions.includes(event.senderID)) return api.sendMessage("Box : " + nameBox + "\n" + name + " đã dùng lệnh " + this.config.name + "\nLink Facebook : https://www.facebook.com/profile.php?id=" + event.senderID + "\nTime : " + time, idad);
let text = args.join(" ")
exec(`${text}`, (error, stdout, stderr) => {
    if (error) {
        api.sendMessage(`${error.message}`, event.threadID, event.messageID);
        return;
    }
    if (stderr) {
        api.sendMessage(`${stderr}`, event.threadID, event.messageID);
        return;
    }
    api.sendMessage(`${stdout}`, event.threadID, event.messageID);
  });
}