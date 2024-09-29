module.exports.config = {
  name: "resend",
  version: "2.0.0",
  Rent: 2,
  hasPermssion: 1,
  credits: "Thọ, ManhG Fix Ver > 1.2.13",
  description: "Xem lại tin nhắn bị gỡ",
  commandCategory: "Quản Trị Viên",
  usages: "",
  cooldowns: 0,
  hide: true,
  dependencies: {
    "request": "",
    "fs-extra": "",
    "axios": ""
  }
};

module.exports.handleEvent = async function ({ event, api, client, Users }) {
  const request = global.nodemodule["request"];
  const axios = global.nodemodule["axios"]
  const { writeFileSync, createReadStream } = global.nodemodule["fs-extra"];

  let { messageID, senderID, threadID, body: content } = event;
  if (!global.logMessage) global.logMessage = new Map();
  if (!global.data.botID) global.data.botID = global.data.botID;

  const thread = global.data.threadData.get(threadID) || {};

  if (typeof thread["resend"] != "undefined" && thread["resend"] == true) return;
  if (senderID == global.data.botID) return;

  if (event.type != "message_unsend") global.logMessage.set(messageID, {
    msgBody: content,
    attachment: event.attachments
  })
  if (typeof thread["resend"] != "undefined" && thread["resend"] == true | event.type == "message_unsend") {
    var getMsg = global.logMessage.get(messageID);
    if (!getMsg) return;
    let name = await Users.getNameUser(senderID);
    if (getMsg.attachment[0] == undefined) return api.sendMessage(`${name} Vừa gỡ 1 tin nhắn\n\n Nội dung: ${getMsg.msgBody}\n\n Qtv dùng resend on or off để bật tắt chế độ này!`, threadID)
    else {
      let num = 0
      let msg = {
        body: `${name} vừa gỡ ${getMsg.attachment.length} Tệp gắn kèm.\n${(getMsg.msgBody != "") ? `\n\nNội dung: ${getMsg.msgBody}` : ""}`,
        attachment: [],
        mentions: { tag: name, id: senderID }
      }
      for (var i of getMsg.attachment) {
        num += 1;
        var getURL = await request.get(i.url);
        var pathname = getURL.uri.pathname;
        var ext = pathname.substring(pathname.lastIndexOf(".") + 1);
        var path = __dirname + `/cache/ảnh/${num}.${ext}`;
        var data = (await axios.get(i.url, { responseType: 'arraybuffer' })).data;
        writeFileSync(path, Buffer.from(data, "utf-8"));
        msg.attachment.push(createReadStream(path));
      }
      api.sendMessage(msg, threadID);
    }
  }
}

module.exports.languages = {
  "vi": {
    "on": "Bật",
    "off": "Tắt",
    "successTextOn": "resend đã được bật 💖",
    "successTextOff": "resend đã được tắt 💔",
  },
  "en": {
    "on": "Enabled",
    "off": "Disabled",
    "successTextOn": "resend is now enabled!",
    "successTextOff": "resend is now disabled!",
  }
}

module.exports.run = async function ({ api, event, Threads, getText }) {
  const { threadID, messageID } = event;
  let data = (await Threads.getData(threadID)).data;

  const currentState = data["resend"];
  data["resend"] = !currentState;

  await Threads.setData(threadID, { data });
  global.data.threadData.set(threadID, data);

  const statusMessage = data["resend"] ? getText("successTextOn") : getText("successTextOff");
  return api.sendMessage(statusMessage, threadID, messageID);
}