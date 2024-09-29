module.exports.config = {
	name: "uid",
	version: "1.2.0",
	hasPermssion: 0,
	credits: "TrúcCute",// chính chủ, xin đừng hiểu nhầm thay credits
	description: "Lấy ID người dùng.",
	commandCategory: "Tiện Ích",
	cooldowns: 0
}

module.exports.run = async function ({ api, event, Users, args }) {
  const { type, threadID, messageID, mentions, senderID, messageReply } = event;
  if (type == "message_reply") {
      uid = messageReply.senderID
    } else if (args.join().indexOf('@') !== -1) {
        var uid = Object.keys(mentions)[0]
    }  else {
        var uid = senderID
  } 
  var name = await Users.getNameUser(uid)
    return api.sendMessage(uid, threadID, messageID);
}
