const axios = require("axios"), fs = require("fs"), path = require("path");
module.exports.config = {
    name: "pincheck",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "Dũngkon", //đừng đổi credits pls                (địt mẹ thằng độc tôn)
    description: "check ảnh trên pinterest",
    commandCategory: "Tiện Ích",
    usages: "pin",
    cooldowns: 5,
};

module.exports.run = async function({ api, event, args }) {
  const { threadID } = event;
  const out = (msg) => api.sendMessage(msg, threadID);
  var linkUp = event.messageReply.attachments[0].url || args.join(" ");
  if(!linkUp) return api.sendMessage('Vui lòng reply hoặc nhập link 1 hình ảnh!!!', event.threadID, event.messageID)

  const search = event.type === "message_reply" ? event.messageReply.senderID : args.join(" ");

  const cacheDir = path.join(__dirname, "cache/dungkon");
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir);
  }

  const attachments = [], dungkon = [];

  try {
    const res = await axios.get(`https://sumiproject.io.vn/imgur?link=${encodeURIComponent(linkUp)}`)
        const link = res.data.uploaded.image
        console.log(link)
        api.sendMessage(`LOADING....!`, event.threadID , (err, info)  => setTimeout(() => { api.unsendMessage(info.messageID) }, 5000));
    const response = await axios.get(`https://apichatbot.sumiproject.io.vn/pins?url=${link}`);
    const data = response.data;

    for (let i = 0; i < 5; i++) {
      const message = `ảnh số ${i + 1}.\n${data.data[i].image_large_url}`;

      const url = data.data[i].image_large_url;
      const hi = path.join(cacheDir, `${i + 1}.jpg`);

      const imageResponse = await axios.get(url, { responseType: "arraybuffer" });

      fs.writeFileSync(hi, Buffer.from(imageResponse.data));

      attachments.push(fs.createReadStream(hi));
      dungkon.push(message); 

      console.log(`${i + 1}`);
    }

    // Gửi tất cả thông tin và ảnh trong một lần
    api.sendMessage({
      body: dungkon.join("\n\n"), 
      attachment: attachments
    }, threadID);
  } catch (error) {
    api.sendMessage("Lỗi: " + error, threadID);
    console.error("Đã xảy ra lỗi:", error); // Log ra tìm lỗi 
  }
};