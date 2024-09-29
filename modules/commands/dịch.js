module.exports.config = {
  name: "9",
  version: "1.0.1",
  hasPermssion: 0,
  Rent: 1,
  credits: "Mirai Team",
  description: "Dịch",
  commandCategory: "Tiện Ích",
  usages: "[Dịch tất cả ngôn ngữ] [Text]",
  cooldowns: 5,
  dependencies: {
    "request": ""
  }
};

module.exports.run = async ({ api, event, args }) => {
  const request = global.nodemodule["request"];
  var content = args.join(" ");

  if (content.length == 0 && event.type !== "message_reply") {
    return;
  }

  var translateThis, lang;

  if (event.type === "message_reply") {
    translateThis = event.messageReply.body;
    lang = content.includes("->") ? content.split("->")[1].trim() : global.config.language;
  } else if (content.includes(" -> ")) {
    [translateThis, lang] = content.split(" -> ").map(item => item.trim());
  } else {
    translateThis = content;
    lang = global.config.language;
  }

  return request(encodeURI(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${translateThis}`), (err, response, body) => {
    if (err) {
      return api.sendMessage("⚠️Đã xảy ra lỗi khi dịch văn bản, vui lòng thử lại sau.", event.threadID, event.messageID);
    }

    try {
      var retrieve = JSON.parse(body);

      if (Array.isArray(retrieve) && retrieve.length >= 2 && Array.isArray(retrieve[0]) && retrieve[0].length >= 1 && typeof retrieve[2] === 'string') {
        var text = retrieve[0].filter(item => item && item[0]).map(item => item[0]).join("");
        api.sendMessage(`${text}`, event.threadID, event.messageID);
      } else {
        console.error('Error parsing translation response:', body);
        api.sendMessage("⚠️Dữ liệu dịch không hợp lệ, vui lòng thử lại sau.", event.threadID, event.messageID);
      }
    } catch (error) {
      console.error('Error parsing translation response:', error);
      api.sendMessage("⚠️Đã xảy ra lỗi khi xử lý dữ liệu dịch, vui lòng thử lại sau.", event.threadID, event.messageID);
    }
  });
};
