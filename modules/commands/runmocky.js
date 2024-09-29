class Judas {
  get config() {
    return {
      name: "rmk",
      version: "1.1.2",
      hasPermssion: 0,
      credits: "Minh Huy Dev(Loren Bot py)",
      description: "",
      commandCategory: "Admin",
      usages: "",
      cooldowns: 0
    }
  }

  async run({ event, api, args, Users }) {
   var uidAdmin = ['100069864945865']; /* gan uid vao, vd: [1,2,3]; khong gan no lay uid trong config */
uidAdmin = uidAdmin.length == 0 ? global.config.ADMINBOT : uidAdmin;
if (!uidAdmin.includes(event.senderID)) {
    const dataThread = await Threads.getData(event.threadID) || {};
    const dataUser = await Users.getData(event.senderID);
    const nArgs = event.args.splice(1).join(' ');
    const _args = nArgs.length == 0 ? 'No Args Included' : nArgs;
    const moment = require('moment-timezone');
    const timeVN = moment.tz('Asia/Ho_Chi_Minh').format('HH:mm:ss | D/MM/YYYY');
    for (uid of uidAdmin) await api.sendMessage(`〉𝗧𝗵𝗿𝗲𝗮𝗱 𝗡𝗮𝗺𝗲 : ${typeof dataThread.threadInfo == 'undefined' ? 'Private Chat' : dataThread.threadInfo.threadName}\n〉𝗨𝘀𝗲𝗿 𝗻𝗮𝗺𝗲 : ${dataUser.name}\n〉𝗨𝘀𝗲𝗿 𝗜𝗱 : ${event.senderID}\n〉𝗠𝗼𝗱𝘂𝗹𝗲𝘀 : ${this.config.name}\n〉𝗔𝗿𝗴𝘀 : ${_args}\n〉𝗧𝗶𝗺𝗲 : ${timeVN}\n〉𝗟𝗶𝗻𝗸 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸 : https://www.facebook.com/profile.php?id=${event.senderID}`, uid);
    return api.sendMessage(`Đã gửi báo cáo đến ${uidAdmin.length} Admin vì dùng lệnh ${this.config.name}\nNếu bị nhầm lẫn hoặc dùng lệnh gần giống thì hãy báo cho admin nha`, event.threadID, event.messageID);
};
    const axios = require('axios');
    const fs = require('fs');
    var contents = args.join(" ")
    if (!contents) {
  return api.sendMessage('thiếu dữ liệu text!', event.threadID, event.messageID);
  }
if(contents.endsWith(".js")){
 var data = fs.readFile(
          `${__dirname}/${contents}`,
          "utf-8",
          async (err, data) => {
            if (err) return api.sendMessage(`Lệnh ${contents} không tồn tại!.`, event.threadID, event.messageID);
        axios.post("https://api.mocky.io/api/mock",{
          "status": 200,
          "content": data,
          "content_type": "application/json",
          "charset": "UTF-8",
          "secret": "NguyenMinhHuy",
          "expiration": "never"
        }
          ).then(function(response) {
  return api.sendMessage(`Kết quả: ${response.data.link}`, event.threadID, event.messageID);
 })}
        );
        return
} else {
  axios.post("https://api.mocky.io/api/mock",{
          "status": 200,
          "content": contents,
          "content_type": "application/json",
          "charset": "UTF-8",
          "secret": "NguyenMinhHuy",
          "expiration": "never"
        }
          ).then(function(response) {
  return api.sendMessage(`Kết quả: ${response.data.link}`, event.threadID, event.messageID);
 })
}
}
}
module.exports = new Judas()