module.exports.config = {
	name: "clean",
	version: "0.0.2",
	hasPermssion: 2,
	credits: "BraSL",
	description: "clean cache bot",
	commandCategory: "Admin",
	usages: "Y/N",
    cooldowns: 5,
};
const fs = require('fs')
module.exports.run = async function({ api, event, args, utils }) {
   api.sendMessage('Bạn muốn clean theo AI hay tự chọn Y/N',event.threadID, (e, info) => {
          global.client.handleReply.push({
                name: this.config.name,
                author: event.senderID,
                messageID: info.messageID
              })
      })
}

module.exports.handleReply = async function({api, event, args, handleReply }) {

  if(handleReply.type === 'n'){
    var a = [],
    success = [],
    txt = event.body.split(',');
    for (const type of txt) {
    a.push(type);
    const fileb = fs
      .readdirSync(__dirname +`/cache`)
      .filter((file) => file.endsWith(`.` + type));
    for (const filec of fileb) {
      try {
        fs.unlinkSync(__dirname + `/cache/` + filec);
        success.push(filec);
      } catch {
        api.sendMessage("[ ERROR ] - Error Clear Storage: " + filec, event.threadID);
      }
    }
  }
  if(success.length === 0) {
   return api.sendMessage(`[ Clear ] - Your Storage Has Been Cleared Before.`,event.threadID);
  }
  api.sendMessage(`[ Clear ] - Clean Storage Success!`,event.threadID);
  }

  switch(event.args[0]){
    case 'y':
    case 'Y': {
       const a = [],
    success = [],
    txt = ["png", "jpg", "mp4", "jpeg", "gif", "m4a", "txt", "mp3", "wav"];
  for (const type of txt) {
    a.push(type);
    const fileb = fs
      .readdirSync( __dirname + `/cache`)
      .filter((file) => file.endsWith(`.` + type));
    for (const filec of fileb) {
      try {
        fs.unlinkSync(__dirname + `/cache/` + filec);
        success.push(filec);
      } catch {
        api.sendMessage("[ ERROR ] - Error Clear Storage: " + filec, event.threadID);
      }
    }
  }
  if(success.length === 0) {
   return api.sendMessage(`[ Clear ] - Your Storage Has Been Cleared Before.`,event.threadID);
  }
  api.sendMessage(`[ Clear ] - Clean Storage Success!`,event.threadID);
    }
      break;
    case 'n':
    case 'N': {
       api.sendMessage('[ Clear ] - Vui lòng reply những dạng file cần xóa\nví dụ: jpn,png',event.threadID, (e, info) => {
          global.client.handleReply.push({
                type: 'n',
                name: this.config.name,
                author: event.senderID,
                messageID: info.messageID
              })
      })
    }
  }
    
}