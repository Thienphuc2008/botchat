module.exports.config = {
    name: "gettoken",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "Niio-team (Dũngkon)", 
    description: "Get token EAAD6V7 từ cookie",
    commandCategory: "Tiện Ích",
    usages: "cookie",
    cooldowns: 5
};
module.exports.run = async function ({ api, event, args,}) {

  const { threadID, messageID, senderID } = event;
  var out = (msg) => api.sendMessage(msg, threadID, messageID);
  if (!args.join(" ")) return out("gettoken (cookie)");
  if (event.type == "message_reply") cookie  = event.messageReply.senderID
  else cookie = args.join(" ");
  api.sendMessage(`🔄 Tiến hành gettoken...`, event.threadID , (err, info)  => setTimeout ( () => { api.unsendMessage(info.messageID) } , 5000));
  var data = await
  global.utils.getContent(`https://hoanghao.me/api/cookietotoken?cookie=${cookie}`);
  const token = data.data.access_token;
  return api.sendMessage(`${token}`, event.threadID);
};