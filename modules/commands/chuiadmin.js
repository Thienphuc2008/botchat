module.exports.config = {
  name: "goiadmin",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Mirai Team",
  description: "Tag admin",
  commandCategory: "Hệ Thống",
  usages: "",
  cooldowns: 1
};
module.exports.handleEvent = async function ( { api, event } ) {
    var idad = ["100069864945865"];
    // var idad = global.config.ADMINBOT;
    for (const id of idad) {
    if (!id) return
    if (!idad) return
    if(!event.body) return
    if (Object.keys(event.mentions) == id) {
      var msg = ["nwng lồn thì bảo để admin t giúp","tag cái lozz admin đang bận yêu em linh","tag cái lozz admin đang bận yêu em nhi","admin t bảo thèm lozz em linh muốn chịch em nhi","bảo anh cuto a cho bú"];
      return api.sendMessage({body: msg[Math.floor(Math.random()*msg.length)]}, event.threadID, event.messageID);
    }
    else return
    }
}
module.exports.run = async function ( { api, event } ) {
api.sendMessage(`Tự động chửi thằng chó tag admin bot`,event.threadID,event.messageID)
}