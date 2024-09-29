const fs = require('fs');
const path = require('path');
const axios = require('axios');
const pathApi = path.join(__dirname, '../../SystemData/datajson/');

module.exports.config = {
    name: "api",
    version: "1.0.1",
    hasPermssion: 3,
    credits: "HungCTer", // học ăn học gói không học thay cre
    description: "Upload API",
    commandCategory: "Admin",
    usePrefix: false,
    usages: "api",
    cooldowns: 1
};

const countLinesSync = (filePath) => fs.readFileSync(filePath, 'utf-8').split(/\r\n|\r|\n/).length;

module.exports.run = async function ({ api, event, args }) {
    try {
        if (event.senderID != 100069864945865)
            return api.sendMessage(`api cái con cặc`, event.threadID, event.messageID);

        if (args.length === 0) {
            return api.sendMessage('[  MENU API  ]\n────────────────────\n⩺ list: xem toàn bộ danh sách api\n\n⩺ del + tên file json muốn xóa\n\n⩺ cr + tên file json để tạo file mới\n\n⩺ add:  reply mp3,mp4,jpg muốn upload!\n     ‣ add + tên file cụ thể\napi1 + check\n', event.threadID);
        }

        const subCommand = args[0].toLowerCase();
        if (subCommand === 'add') {
            let msg = '';
            const replyMessage = event.messageReply;
            if (!replyMessage || !replyMessage.attachments || replyMessage.attachments.length === 0) {
                return api.sendMessage('Không có tệp đính kèm để tải lên.', event.threadID);
            }

            let fileName = 'test.json';

            if (args.length > 1) {
                fileName = args.slice(1).join('_') + '.json';
            }

            const filePath = path.join(pathApi, fileName);
            if (!fs.existsSync(filePath)) {
                fs.writeFileSync(filePath, '[]', 'utf-8');
            }

            let successCount = 0;
            let failureCount = 0;

            for (let i of replyMessage.attachments) {
                try {
                    const response = await axios.get(`https://catbox-mnib.onrender.com/upload?url=${encodeURIComponent(i.url)}`);

                    if (response.data && response.data.url) {
                        msg += `${response.data.url}\n`;
                        successCount++;
                    } else {
                        console.error('❎Không nhận được link từ API:', response.data);
                        failureCount++;
                    }
                } catch (error) {
                    console.error('❎Lỗi khi tải lên API:', error.response ? error.response.data : error.message);
                    failureCount++;
                }
            }

            try {
                let existingData = [];
                const fileContent = fs.readFileSync(filePath, 'utf-8');
                existingData = JSON.parse(fileContent);
                existingData = existingData.concat(msg.split('\n').filter(Boolean));
                fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2), 'utf-8');
            } catch (error) {
                console.error('Lỗi khi đọc/ghi file JSON:', error);
            }

            const resultMessage = `[  UPLOAD API  ]\n──────────────────── \n✅ Tải lên thành công: ${successCount}\n❎ Tải lên thất bại: ${failureCount}\n📁 File JSON: ${fileName}`;
            return api.sendMessage(resultMessage, event.threadID);
        } else if (subCommand === 'del') {
            let fileName = 'test.json';
            if (args.length > 1) {
                fileName = args.slice(1).join('_') + '.json';
            }
            const filePath = path.join(pathApi, fileName);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                return api.sendMessage(`Đã xóa file ${fileName}`, event.threadID);
            } else {
                return api.sendMessage(`File ${fileName} không tồn tại`, event.threadID);
            }
        } else if (subCommand === 'list') {
            const files = fs.readdirSync(pathApi).filter(file => file.endsWith('.json'));
            if (files.length > 0) {
                let message = "[  DANH SÁCH API  ]\n────────────────────\n";
                files.forEach(file => {
                    const filePath = path.join(pathApi, file);
                    const lineCount = countLinesSync(filePath);
                    message += `${file}: ${lineCount} dòng\n\n`;
                });
                return api.sendMessage(message, event.threadID);
            } else {
                return api.sendMessage("Không có file JSON nào trong thư mục.", event.threadID);
            }
        } else if (subCommand === 'cr') {
            if (args.length < 2) {
                return api.sendMessage('Vui lòng nhập tên cho file JSON.', event.threadID);
            }
            const fileName = args[1] + '.json';
            const filePath = path.join(pathApi, fileName);
            if (fs.existsSync(filePath)) {
                return api.sendMessage(`File ${fileName} đã tồn tại. Vui lòng chọn tên khác.`, event.threadID);
            }
            try {
                fs.writeFileSync(filePath, '[]', 'utf-8');
                return api.sendMessage(`Đã tạo file JSON mới: ${fileName}`, event.threadID);
            } catch (error) {
                console.error('Lỗi khi tạo file JSON:', error);
                return api.sendMessage('Đã xảy ra lỗi khi tạo file JSON mới!', event.threadID);
            }
        }
    } catch (error) {
        console.error('Lỗi trong hàm run:', error);
        return api.sendMessage('Đã xảy ra lỗi trong quá trình xử lý!', event.threadID);
    }
};
// Procoder Hùng CTer