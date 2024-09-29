const path = require('path');
const fs = require('fs-extra');

const filePath = path.resolve(__dirname, "../../SystemData/data/autoRules.json");
fs.ensureFileSync(filePath);
let data = fs.readJsonSync(filePath, { throws: false }) || [];
const rulesDataPath = path.join(__dirname, '../../SystemData/data/rules.json');
module.exports.config = {
  hasPermission: 1,
  credits: "Vtuan",
  Rent: 2,
  name: "autorules",
  commandCategory: "Quản Trị Viên",
  usages: "Auto gửi luật khi có thành viên mới vào nhóm",
  version: "1.0.0",
  cooldowns: 0,
  description: 'auto',
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID } = event;

  if (args.length !== 1 || (args[0] !== "on" && args[0] !== "off")) {
    return api.sendMessage(`
      ${global.config.PREFIX}autorules on để bật chức năng auto gửi luật khi có thành viên mới vào nhóm, 
      ${global.config.PREFIX}autorules off để tắt chức năng.
    `, threadID);
  }

  let threadEntry = data.find(entry => entry.threadID === threadID);

  if (args[0] === "on") {
    if (!threadEntry) {
      threadEntry = { threadID: threadID, status: true };
      data.push(threadEntry);
    } else {
      threadEntry.status = true;
    }
  } else if (args[0] === "off") {
    if (threadEntry) threadEntry.status = false;
  }

  try {
    fs.writeJsonSync(filePath, data, { spaces: 2 });
    let rulesData;
    try {
      rulesData = fs.readJsonSync(rulesDataPath, { throws: false }) || [];
    } catch (error) {
      console.error('Error reading rules.json:', error);
      api.sendMessage(`Nhóm chưa thêm luật.`, threadID);
      return;
    }

    const thisThreadRules = rulesData.find(entry => entry.threadID === threadID);

    if (thisThreadRules && thisThreadRules.listRule && thisThreadRules.listRule.length > 0) {
      api.sendMessage(`Đã ${threadEntry.status ? "bật" : "tắt"} chức năng auto gửi luật khi có thành viên mới vào nhóm.`, threadID);
    } else {
      api.sendMessage(`
Nhóm chưa thêm luật
hãy dùng rule add + luật(add từng dòng) để thêm luật cho nhóm!
ví dụ: 
rule add không spam
rule add không gửi link 18+
....
dùng help + rule để xem cách sử dụng!
hoặc liên hệ trực tiếp admin để biết cách sử dụng!`, threadID);
    }
  } catch (error) {
    api.sendMessage("Đã xảy ra lỗi khi cố gắng cập nhật cài đặt, vui lòng thử lại sau.", threadID);
    console.error("Không thể ghi vào tệp .json:", error);
  }
}
