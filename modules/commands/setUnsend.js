const fs = require('fs-extra');
const path = require('path');
const iconUnsend = path.join(__dirname, '../../SystemData/data/iconUnsend.json');

module.exports.config = {
  name: "setUnsend",
  version: "1.0.0",
  hasPermission: 1,
  Rent: 2,
  credits: "Vtuan",
  description: "Cài đặt icon để gỡ tin nhắn bot",
  commandCategory: "Quản Trị Viên",
  usages: "setUnsend + icon",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
  const input = args[0];
  const groupId = event.threadID;

  if (!input || !input.trim()) {
    api.sendMessage('‣ Vui lòng nhập icon!', event.threadID, event.messageID);
    return;
  }

  if (!isNaN(input) || input.match(/[a-zA-Z/"';+.,!@#$%^&*(){}[\]<>?_=|~`]/)) {
    api.sendMessage('‣ Vui lòng nhập icon không chứa ký tự đặc biệt!', event.threadID, event.messageID);
    return;
  }

  let data = [];
  if (fs.existsSync(iconUnsend)) {
    const fileData = fs.readFileSync(iconUnsend, 'utf-8');
    data = JSON.parse(fileData);
  }

  const existingGroup = data.find(item => item.groupId === groupId);
  if (existingGroup) {
    existingGroup.iconUnsend = input;
  } else {
    data.push({ groupId, iconUnsend: input });
  }

  fs.writeFileSync(iconUnsend, JSON.stringify(data, null, 2));
  api.sendMessage('Đã cài đặt icon thành công!', event.threadID, event.messageID);
};
