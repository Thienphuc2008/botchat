module.exports.config = {
    name: "rule",
    version: "1.0.1",
    hasPermssion: 0,
    Rent: 1,
    credits: "CatalizCS",
    description: "Tùy biến luật cho từng nhóm",
    commandCategory: "Quản Trị Viên",
    usages: "[add/remove/all] [content/ID]",
    cooldowns: 0,
    dependencies: {
        "fs-extra": "",
        "path": ""
    }
};

const path = require('path');
const { existsSync, writeFileSync, readFileSync } = global.nodemodule["fs-extra"];
const pathData = path.join(__dirname, '../../SystemData/data/rules.json');

module.exports.onLoad = () => {
    if (!existsSync(pathData)) return writeFileSync(pathData, "[]", "utf-8");
};

module.exports.run = ({ event, api, args, permssion }) => {
    const { threadID, messageID } = event;
    const content = args.slice(1).join(" ");
    const dataJson = JSON.parse(readFileSync(pathData, "utf-8"));
    const thisThread = dataJson.find(item => item.threadID == threadID) || { threadID, listRule: [] };

    switch (args[0]) {
        case "add": {
            if (permssion == 0) return api.sendMessage("⚡️Bạn không đủ quyền hạn để có thể thêm luật!", threadID, messageID);
            if (content.length == 0) return api.sendMessage("⚡️Phần nhập thông tin không được để trống", threadID, messageID);
            if (content.includes("\n")) {
                const contentSplit = content.split("\n");
                thisThread.listRule.push(...contentSplit);
            } else {
                thisThread.listRule.push(content);
            }
            writeFileSync(pathData, JSON.stringify(dataJson, null, 4), "utf-8");
            api.sendMessage('⚡️Đã thêm luật mới cho nhóm thành công!', threadID, messageID);
            break;
        }
        case "list":
        case "all": {
            var msg = "", index = 0;
            for (const item of thisThread.listRule) msg += `${++index}/ ${item}\n`;
            if (msg.length == 0) return api.sendMessage("⚡️Nhóm của bạn hiện tại chưa có danh sách luật để hiển thị!", threadID, messageID);
            api.sendMessage(`=== Luật của nhóm ===\n\n${msg}`, threadID, messageID);
            break;
        }
        case "rm":
        case "remove":
        case "delete": {
            if (!isNaN(content) && content > 0) {
                if (permssion == 0) return api.sendMessage("⚡️Bạn không đủ quyền hạn để có thể xóa luật!", threadID, messageID);
                if (thisThread.listRule.length == 0) return api.sendMessage("⚡️Nhóm của bạn chưa có danh sách luật để có thể xóa!", threadID, messageID);
                thisThread.listRule.splice(content - 1, 1);
                api.sendMessage(`⚡️Đã xóa thành công luật có số thứ tự thứ ${content}`, threadID, messageID);
                break;
            } else if (content == "all") {
                if (permssion == 0) return api.sendMessage("⚡️Bạn không đủ quyền hạn để có thể xóa luật!", threadID, messageID);
                if (thisThread.listRule.length == 0) return api.sendMessage("⚡️Nhóm của bạn chưa có danh sách luật để có thể xóa!", threadID, messageID);
                thisThread.listRule = [];
                api.sendMessage(`⚡️Đã xóa thành công toàn bộ luật của nhóm!`, threadID, messageID);
                break;
            }
        }
        default: {
            if (thisThread.listRule.length !== 0) {
                var msg = "", index = 0;
                for (const item of thisThread.listRule) msg += `${++index}/ ${item}\n`;
                api.sendMessage(`=== Luật của nhóm ===\n\n${msg} \n[Việc tuân thủ luật của nhóm sẽ đóng góp tích cực đến cộng đồng của bạn!]`, threadID, messageID);
            } else {
                api.sendMessage("⚡️Nhóm của bạn chưa cài thêm luật\nDùng rule add + nội dung để thêm luật\nDùng rule remove + STT để xóa luật", threadID, messageID);
            }
            break;
        }
    }

    if (!dataJson.some(item => item.threadID == threadID)) dataJson.push(thisThread);
    writeFileSync(pathData, JSON.stringify(dataJson, null, 4), "utf-8");
};
