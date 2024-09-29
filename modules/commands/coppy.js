const axios = require('axios');
const fs = require('fs');
let globalUserID, copy = false;

module.exports.config = {
  name: "copy",
  version: "4.0.0",
  hasPermssion: 2,
  credits: "Vtuan",
  Rent: 2,
  description: "Copy",
  commandCategory: "War",
  usages: "[User ID]",
  cooldowns: 1
};

module.exports.run = async function ({ api, event, args }) {
  const { messageReply, mentions, threadID } = event;
  if (args[0] === 'stop') {
    manage(false, messageReply?.senderID || Object.keys(mentions)[0]);
    return api.sendMessage("Copying stopped.", threadID);
  }
  manage(true, messageReply?.senderID || Object.keys(mentions)[0]);
  return api.sendMessage("Copying started.", threadID);
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, senderID, body, attachments } = event;

  if (copy && senderID == globalUserID) {
    const mediaPromises = [];
    for (const attachment of attachments) {
      if (attachment.type === 'photo' || attachment.type === 'video' || attachment.type === 'audio') {
        const mediaUrl = attachment.url;
        const mediaPath = __dirname + `/cache/data/copiedMedia/${threadID}_${Date.now()}${attachment.type === 'photo' ? '.jpg' : attachment.type === 'video' ? '.mp4' : '.mp3'}`;
        mediaPromises.push(downloadAndSendMedia(api, mediaUrl, mediaPath, threadID));
      }
    }

    const mediaFiles = await Promise.all(mediaPromises);
    const validMediaFiles = mediaFiles.filter(mediaFile => mediaFile !== null);
    let messageType = {};
    if (validMediaFiles.length > 0) {
      messageType.attachment = validMediaFiles;
    }
    if (body) {
      messageType.body = body;
    }
    api.sendMessage(messageType, threadID);
    validMediaFiles.forEach(file => {
      fs.unlink(file.path, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
        }
      });
    });
  }
};

async function downloadAndSendMedia(api, mediaUrl, mediaPath, threadID) {
    const response = await axios.get(mediaUrl, { responseType: 'stream' });
    const writer = fs.createWriteStream(mediaPath);
    await new Promise((resolve, reject) => {
      response.data.pipe(writer);
      let error = null;
      writer.on('error', (err) => {
        error = err;
        writer.close();
        reject(err);
      });
      writer.on('close', () => {
        if (!error) {
          resolve();
        }
      });
    });

    return fs.createReadStream(mediaPath);
}

function manage(start, userID) {
  if (start) {
    globalUserID = userID;
    copy = true;
  } else {
    copy = false;
  }
}
