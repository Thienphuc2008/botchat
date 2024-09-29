const fs = require('fs');
const path = require('path');
const axios = require('axios');

module.exports.config = {
  name: "api1",
  version: "2.1.9",
  hasPermssion: 3,
  credits: "N.Trung",
  description: "Tải link/quản lý link ảnh/video/nhạc ở kho lưu trữ link",
  commandCategory: "Admin",
  usages: "[]",
  cooldowns: 5,
  images: [],
};

module.exports.run = async ({ api, event, args }) => {
  try {
    const projectHome = path.resolve('./');
    const srcapi = path.join(projectHome, 'SystemData/datajson');
    global.srcapi = srcapi;

    switch (args[0]) {
      case 'add': {
        if (args.length === 1) {
          api.sendMessage("⚠️ Vui lòng nhập tên tệp", event.threadID, event.messageID);
          return;
        }

        const tip = args[1];
        const dataPath = path.join(srcapi, `${tip}.json`);
        if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, '[]', 'utf-8');
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

        for (const i of event.messageReply.attachments) {
          const response = await axios.get(`https://catbox-mnib.onrender.com/upload?url=${encodeURIComponent(i.url)}`);
          if (Array.isArray(response.data)) {
            data.push(...response.data.map(linkObj => linkObj.url));
          } else {
            data.push(response.data.url);
          }
        }

        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');
        api.sendMessage(`✅ Tải link lên api thành công`, event.threadID, event.messageID);
        break;
      }

      case 'check': {
        const files = fs.readdirSync(srcapi);
        let fileIndex = 1;
        let totalLinks = 0;

        const results = [];

        for (const file of files) {
          const filePath = path.join(srcapi, file);
          const fileContent = fs.readFileSync(filePath, 'utf8');
          const linksArray = JSON.parse(fileContent);

          totalLinks += linksArray.length;
          results.push(`${fileIndex}. ${file} - tổng ${linksArray.length} link`);
          fileIndex++;
        }

        const messageToSend = `🗂️ Tổng có ${files.length} file trong kho lưu trữ:\n──────────────────\n${results.join('\n')}\n\n──────────────────\n|› 📝 Tổng tất cả link: ${totalLinks}\n|› 📌 Reply (phản hồi) STT để check link status\n|› ✏️ Reply (phản hồi) del + STT để xóa file tương ứng`;

        api.sendMessage(messageToSend, event.threadID, (error, info) => {
          if (!error) {
            global.client.handleReply.push({
              type: "choosee",
              name: module.exports.config.name,
              author: info.senderID,
              messageID: info.messageID,
              dataaa: files,
            });
          }
        });
        break;
      }

      default:
        api.sendMessage("📝 Sử dụng add, check hoặc del", event.threadID, event.messageID);
    }
  } catch (error) {
    console.log(error);
    api.sendMessage(`❎ Đã xảy ra lỗi trong quá trình thực hiện lệnh: ${error}`, event.threadID, event.messageID);
  }
};

module.exports.handleReply = async function ({ event, api, handleReply }) {
  const { threadID: tid, messageID: mid, body } = event;
  const args = body.split(" ");

  switch (handleReply.type) {
    case 'choosee':
      const choose = parseInt(body);
      api.unsendMessage(handleReply.messageID);

      if (!isNaN(choose)) {
        const selectedFile = handleReply.dataaa[choose - 1];

        if (!selectedFile) {
          return api.sendMessage('❎ Lựa chọn không nằm trong danh sách!', tid, mid);
        }
        const filePath = path.join(global.srcapi, selectedFile);

        try {
          const fileContent = fs.readFileSync(filePath, 'utf8');
          const linksArray = JSON.parse(fileContent);

          let liveCount = 0;
          let deadCount = 0;

          const chunkSize = 10;
          const linkChunks = [];
          for (let i = 0; i < linksArray.length; i += chunkSize) {
            linkChunks.push(linksArray.slice(i, i + chunkSize));
          }

          const checkLinkPromises = linkChunks.map(async chunk => {
            await Promise.all(chunk.map(async link => {
              try {
                const response = await axios.head(link);
                if (response.status === 200) {
                  liveCount++;
                } else {
                  deadCount++;
                }
              } catch (error) {
                deadCount++;
              }
            }));
          });

          await Promise.all(checkLinkPromises);

          if (deadCount === 0) {
            return api.sendMessage(`✅ File ${selectedFile} không có liên kết nào die!`, tid, mid);
          }

          api.sendMessage(`|› 🗂️ Name file: ${selectedFile}\n|› 📝 Total: ${linksArray.length}\n|› ✅ Live: ${liveCount}\n|› ❎ Die: ${deadCount}\n\n──────────────────\n|› 📌 Thả cảm xúc '👍' để lọc link die\n|› ✏️ Lưu ý, trong quá trình lọc vẫn sẽ có sự khác biệt về số lượng link die so với khi check`, tid, async (error, info) => {
            if (!error) {
              global.client.handleReaction.push({
                name: module.exports.config.name,
                messageID: info.messageID,
                author: event.senderID,
                selectedFile: selectedFile
              });
            }
          });
        } catch (error) {
          console.log(error);
          api.sendMessage(`❎ Đã xảy ra lỗi trong quá trình kiểm tra file: ${error}`, tid, mid);
        }
      } else if (args[0] === 'del' && !isNaN(parseInt(args[1]))) {
        try {
          const selectedFileIndex = parseInt(args[1]) - 1;
          const files = handleReply.dataaa;

          if (selectedFileIndex < 0 || selectedFileIndex >= files.length) {
            return api.sendMessage('❎ Lựa chọn không hợp lệ', tid, mid);
          }

          const selectedFile = files[selectedFileIndex];
          const filePath = path.join(global.srcapi, selectedFile);
          fs.unlinkSync(filePath);
          api.sendMessage(`✅ Đã xóa file ${selectedFile} thành công!`, tid, mid);
        } catch (error) {
          console.log(error);
          api.sendMessage(`❎ Đã xảy ra lỗi khi xóa file: ${error}`, tid, mid);
        }
      } */else {
        api.sendMessage("❎ Bạn không phải người dùng lệnh, vui lòng không thực hiện hành động này", tid, mid);
      }
      break;
  }
};

module.exports.handleReaction = async ({ api, event, handleReaction }) => {
  const { messageID, selectedFile } = handleReaction;
  const { threadID } = event;

  if (event.reaction == '👍') {
   try {
      api.unsendMessage(handleReaction.messageID);

      const filePath = path.join(global.srcapi, selectedFile);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const linksArray = JSON.parse(fileContent);

      let liveLinks = [];
      let deadLinks = [];

      const chunkSize = 10;
      const linkChunks = [];
      for (let i = 0; i < linksArray.length; i += chunkSize) {
        linkChunks.push(linksArray.slice(i, i + chunkSize));
      }

const checkLinkPromises = linkChunks.map(async chunk => {
   await Promise.all(chunk.map(async link => {
          try {
            const response = await axios.head(link);
            if (response.status === 200) {
              liveLinks.push(link);
            } else {
              deadLinks.push(link);
            }
          } catch (error) {
            deadLinks.push(link);
          }
        }));
      });

      await Promise.all(checkLinkPromises);

      fs.writeFileSync(filePath, JSON.stringify(liveLinks, null, 2), 'utf-8');

      api.sendMessage(`✅ Đã lọc thành công ${deadLinks.length} link die từ file ${selectedFile}`, threadID, messageID);
    } catch (error) {
      console.log(error);
    }
  }
};