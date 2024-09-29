module.exports.config = {
  name: "4k",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "",
  description: "",
  commandCategory: "Tiện Ích",
  usages: "[reply]",
  cooldowns: 0
};

module.exports.run = async function({ api, event, args }) {
  const fs = global.nodemodule["fs-extra"];
  const axios = require('axios').default;
  const isLink = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(args[0]);
  var linkUp = event.messageReply.attachments[0].url || (isLink ? args[0] : '');
  if (!linkUp) return api.sendMessage('Please reply with a photo or enter a photo link!', event.threadID, event.messageID);
  try {
    if (isLink) {
      const response = await axios.get(linkUp, { responseType: "arraybuffer" });
      api.sendMessage("Waiting while loading!", event.threadID);
      fs.writeFileSync(__dirname + `/cache/netanh.png`, Buffer.from(response.data, "binary"));
    } else {
      const res = await axios.get(`https://apibot.dungkon.me/imgur?link=${encodeURIComponent(linkUp)}`);
      const link = res.data.uploaded.image;
      const response = await axios.get(`https://apibot.dungkon.me/lamnet?link=${link}`, { responseType: "arraybuffer" });
      api.sendMessage("Please wait....!", event.threadID);
      fs.writeFileSync(__dirname + `/cache/netanh.png`, Buffer.from(response.data, "binary"));
    }
    return api.sendMessage({
      body: `Your photo has been sharpened!`,
      attachment: fs.createReadStream(__dirname + `/cache/netanh.png`)
    }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/netanh.png`), event.messageID);
  } catch (e) {
    return api.sendMessage(e, event.threadID, event.messageID);
  }
};
