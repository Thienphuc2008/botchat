module.exports.config = {
name: "checktuvi",
version: "1.0.0",
hasPermssion: 0,
credits: "SenProject",//fix by Qz
description: "check tương tác theo phong cách tu tiên",
commandCategory: "Nhóm",
usages: "checktt",
cooldowns: 0,
dependencies: {
"fs-extra": ""
}
}

const path = __dirname + '/cache/checktt/';

module.exports.onLoad = () => {
    const fs = require('fs');
    if (!fs.existsSync(path) || !fs.statSync(path).isDirectory()) {
        fs.mkdirSync(path, { recursive: true });
const request = require("request");
    const dirMaterial = __dirname + `/noprefix/`;
    if (!fs.existsSync(dirMaterial + "noprefix")) fs.mkdirSync(dirMaterial, { recursive: true });
    if (!fs.existsSync(dirMaterial + "checkrank.jpg")) request("https://i.imgur.com/KjtFAjS.jpg " , "https://i.imgur.com/4vuwDZ4.jpg").pipe(fs.createWriteStream(dirMaterial + "checkrank.jpg"));
    }
}

module.exports.handleEvent = function ({ event }) {
    const { messageID, threadID, senderID } = event;
    if (!global.data.allThreadID.some(tid => tid == threadID)) return;
    const fs = global.nodemodule['fs'];
    const threadPath = path + threadID + '.json';
    if (!fs.existsSync(threadPath) || fs.statSync(threadPath).isDirectory()) {
        fs.writeFileSync(threadPath, JSON.stringify({}, null, 4));
    }
    const getThreadJSON = JSON.parse(fs.readFileSync(threadPath)) || {};
    if (!getThreadJSON.hasOwnProperty(senderID)) {
        getThreadJSON[senderID] = 0;
    }
    getThreadJSON[senderID]++;
    fs.writeFileSync(threadPath, JSON.stringify(getThreadJSON, null, 4));
}


const getRankName = count => {
    return count > 4440 ? 'Tôn Tổ (Tạo Ra Vũ Trụ)'
    : count > 3440 ? 'Siêu Thoát'
    : count > 3240 ? 'Hợp Đạo Cảnh Đỉnh Phog'
    : count > 3040 ? 'Hợp Đạo Cảnh Hậu Kì'
    : count > 2840 ? 'Hợp Đạo Cảnh Trung Kì'
    : count > 2640 ? 'Hợp Đạo Cảnh Sơ Kì'
    : count > 2440 ? 'Thánh Vương Cảnh Đỉnh Phong'
    : count > 2240 ? 'Thánh Vương Cảnh Hậu Kì'
    : count > 2220 ? 'Thánh Vương Cảnh Trung Kì'
    : count > 2200 ? 'Thánh Vương Cảnh Sơ Kì'
    : count > 2180 ? 'Thánh Cảnh Đỉnh Phong'
    : count > 2160 ? 'Thánh Cảnh Hậu Kì'
    : count > 2140 ? 'Thánh Cảnh Trung Kì'
    : count > 2120 ? 'Thánh Cảnh Sơ Kì'
    : count > 2100 ? 'Chí Tôn Đỉnh Phong'
    : count > 2080 ? 'Chí Tôn Hậu Kì'
    : count > 2060 ? 'Chí Tôn Trung Kì'
    : count > 2040 ? 'Chí Tôn Sơ Kì'
    : count > 2020 ? 'Đại Thánh Đỉnh Phong'
    : count > 2000 ? 'Đại Thánh Hậu Kì'
    : count > 1980 ? 'Đại Thánh Trung Kì '
    : count > 1960 ? 'Đại Thánh Sơ Kì'
    : count > 1940 ? 'Tiểu Thánh Đỉnh Phong'
    : count > 1920 ? 'Tiểu Thánh Hậu Kì'
    : count > 1900 ? 'Tiểu Thánh Trung Kì'
    : count > 1880 ? 'Tiểu Thánh Sơ Kì'
    : count > 1860 ? 'Đạo Tổ Đỉnh Phong'
    : count > 1840 ? 'Đạo Tổ Hậu Kì'
    : count > 1820 ? 'Đạo Tổ Trung Kì'
    : count > 1800 ? 'Đạo Tổ Sơ Kì'
    : count > 1780 ? 'Đạo Đế Đỉnh Phong'
    : count > 1760 ? 'Đạo Đế Hậu Kì'
    : count > 1740 ? 'Đạo Đế Trung Kì'
    : count > 1720 ? 'Đạo Đế Sơ Kì'
    : count > 1700 ? 'Đạo Tôn Đỉnh Phong'
    : count > 1680 ? 'Đạo Tôn Hậu Kì'
    : count > 1660 ? 'Đạo Tôn Trung Kì'
    : count > 1640 ? 'Đạo Tôn Sơ Kì'
    : count > 1620 ? 'Tiên Đế Đỉnh Phong'
    : count > 1600 ? 'Tiên Đế Hậu Kì'
    : count > 1580 ? 'Tiên Đế Trung Kì'
    : count > 1560 ? 'Tiên Đế Sơ Kì'
    : count > 1540 ? 'Tiên Tôn Đỉnh Phong'
    : count > 1520 ? 'Tiên Tôn Hậu Kì'
    : count > 1500 ? 'Tiên Tôn Trung Kì'
    : count > 1480 ? 'Tiên Tôn Sơ Kì'
    : count > 1460 ? 'Tiên Vương Đỉnh Phong'
    : count > 1440 ? 'Tiên Vương Hậu Kì'
    : count > 1420 ? 'Tiên Vương Trung Kì'
    : count > 1400 ? 'Tiên Vương Sơ Kì'
    : count > 1380 ? 'Đại La Kim Tiên'
    : count > 1360 ? 'Đại La Chân Tiên'
    : count > 1340 ? 'Đại La Tán Tiên'
    : count > 1320 ? 'Thái Ất Kim Tiên'
    : count > 1300 ? 'Thái Ất Chân Tiên'
    : count > 1280 ? 'Thái Ất Tán Tiên'
    : count > 1260 ? 'Kim Tiên Đỉnh Phong'
    : count > 1240 ? 'Kim Tiên Hậu Kì'
    : count > 1220 ? 'Kim Tiên Trung Kì'
    : count > 1200 ? 'Kim Tiên Sơ Kì'
    : count > 1180 ? 'Thiên Tiên Đỉnh Phong'
    : count > 1160 ? 'Thiên Tiên Hậu Kì'
    : count > 1140 ? 'Thiên Tiên Trung Kì'
    : count > 1120 ? 'Thiên Tiên Sơ Kì'
    : count > 1100 ? 'Địa Tiên Đỉnh Phong'
    : count > 1080 ? 'Địa Tiên Hậu Kì'
    : count > 1060 ? 'Địa Tiên Trung Kì'
    : count > 1040 ? 'Địa Tiên Sơ Kì'
    : count > 1020 ? 'Nhân Tiên Đỉnh Phong'
    : count > 1000 ? 'Nhân Tiên Hậu Kì'
    : count > 980 ? 'Nhân Tiên Trung Kì'
    : count > 960 ? 'Nhân Tiên Sơ Kì'
    : count > 940 ? 'Bán Tiên Đỉnh Phong'
    : count > 920 ? 'Bán Tiên Hậu Kì'
    : count > 900 ? 'bán Tiên Trung Kì'
    : count > 880 ? 'Bán Tiên Sơ Kì'
    : count > 860 ? 'Đại Thừa Cảnh Đỉnh Phong'
    : count > 840 ? 'Đại Thừa Cảnh Hậu Kì'
    : count > 820 ? 'Đại Thừa Cảnh Trung Kì'
    : count > 800 ? 'Đại Thùa Cảnh Sơ Kì'
    : count > 780 ? 'Độ Kiếp Cảnh Đỉnh Phong'
    : count > 760 ? 'Độ Kiếp Cảnh Hậu Kì'
    : count > 740 ? 'Độ Kiếp Cảnh Trung Kì'
    : count > 720 ? 'Độ Kiếp Cảnh Sơ Kì'
    : count > 700 ? 'Hợp Thể Cảnh Đỉnh Phong'
    : count > 680 ? 'Hợp Thể Cảnh Hậu Kì'
    : count > 660 ? 'Hợp Thể Cảnh Trung Kì'
    : count > 640 ? 'Hợp Thể Cảnh Sơ Kì'
    : count > 620 ? 'Luyện Hư Cảnh Đỉnh Phong'
    : count > 600 ? 'Luyện Hư Cảnh Hậu Kì'
    : count > 580 ? 'Luyện Hư Cảnh Trung Kì'
    : count > 560 ? 'Luyện Hư Cảnh Sơ Kì'
    : count > 540 ? 'Anh Biến Cảnh Đỉnh Phong'
    : count > 520 ? 'Anh Biến Cảnh Hậu Kì'
    : count > 500 ? 'Anh Biến Cảnh Trung Kì'
    : count > 480 ? 'Anh Biến Cảnh Sơ Kì'
    : count > 460 ? 'Nguyên Anh Đỉnh Phong'
    : count > 440 ? 'Nguyên Anh Hậu Kì'
    : count > 420 ? 'Nguyên Anh Trung Kì'
    : count > 400 ? 'Nguyên Anh Sơ Kì'
    : count > 380 ? 'Kim Đan Đỉnh Phong'
    : count > 360 ? 'Kim Đan Hậu Kì'
    : count > 340 ? 'Kim Đan Trung Kì'
    : count > 320 ? 'Kim Đan Sơ Kì'
    : count > 300 ? 'Trúc Cơ Đỉnh Phong'
    : count > 280 ? 'Trúc Cơ Hậu Kì'
    : count > 260 ? 'Trúc Cơ Trung Kì'
    : count > 240 ? 'Trúc Cơ Sơ Kì'
    : count > 220 ? 'Luyện Khí Đỉnh Phong'
    : count > 200 ? 'Luyện Khí Tầng X'
    : count > 180 ? 'Luyện Khí Tầng IX'
    : count > 160 ? 'Luyện Khí VIII'
    : count > 140 ? 'Luyện Khí Tầng VII'
    : count > 120 ? 'Luyện Khí Tầng VI'
    : count > 100 ? 'Luyện Khí Tầng V'
    : count > 80 ? 'Luyện Khí Tầng IV'
    : count > 60 ? 'Luyện Khí Tầng III'
    : count > 40 ? 'Luyện Khí Tầng II'
    : count > 20 ? 'Luyện Khí Tầng I'
    : '𝐍𝐡𝐚̣̂𝐩 𝐌𝐨̂𝐧'
}



module.exports.run = async function ({ api, event, args, Users }) {
    const fs = global.nodemodule['fs'];
    const { messageID, threadID, senderID, mentions } = event;
    const threadPath = path + threadID + '.json';
    if (!fs.existsSync(threadPath) || fs.statSync(threadPath).isDirectory()) {
        fs.writeFileSync(threadPath, JSON.stringify({}, null, 4));
    }
    const query = args[0] ? args[0].toLowerCase() : '';
    const getThreadJSON = JSON.parse(fs.readFileSync(threadPath)) || {};
    if (!getThreadJSON.hasOwnProperty(senderID)) {
        getThreadJSON[senderID] = 1;
    }
    var storage = [],
        msg = '';
    if (query == 'all') {
        const allThread = await api.getThreadInfo(threadID) || { participantIDs: [] };
        for (id of allThread.participantIDs) {
            if (!getThreadJSON.hasOwnProperty(id)) {
                getThreadJSON[id] = 0;
            }
        }
    }
    for (const id in getThreadJSON) {
        const name = await Users.getNameUser(id);
        storage.push({ id, name, count: getThreadJSON[id] });
    }
    storage.sort((a, b) => {
        if (a.count > b.count) return -1;
        else if (a.count < b.count) return 1;
        else return a.name.localeCompare(b.name);
    });
    if (query == 'all') {
        let count = 1;
        msg += '〘 ==== 𝐂𝐇𝐄𝐂𝐊 𝐀𝐋𝐋 ==== 〙';
        for (const user of storage) {
            msg += `\n${count++}〉『 ${user.name} 』➜ ${user.count}\n𝐓𝐮 𝐕𝐢: ${getRankName(storage.count)}`;
        }
    } else if (query == 'help') {
        msg += '》𝐇𝐚̣ 𝐆𝐢𝐨̛́𝐢 (0 tin nhắn)\n》𝐇𝐚̣ 𝐆𝐢𝐨̛́𝐢 (200 tin nhắn)\n》𝐇𝐚̣ 𝐆𝐢𝐨̛́𝐢 (440 tin nhắn)\n》𝐇𝐚̣ 𝐆𝐢𝐨̛́𝐢 (760 tin nhắn)\n》𝐓𝐢𝐞̂𝐧 𝐆𝐢𝐨̛́𝐢 (1260 tin nhắn)\n》𝐓𝐡𝐚̂̀𝐧 𝐆𝐢𝐨̛́𝐢 (1760 tin nhắn)\n》𝗖𝗮𝗼 𝗧𝗵𝘂̉ 𝐓𝐡𝐚̂̀𝐧 𝐆𝐢𝐨̛́𝐢 (2260 tin nhắn)\n》𝐇𝐨̂̃𝐧 Đ𝐨̣̂𝐧 𝐆𝐢𝐨̛́𝐢 (3440 tin nhắn)\n》𝐂𝐚𝐨 𝐓𝐡𝐮̉ 𝐇𝐨̂̃𝐧 Đ𝐨̣̂𝐧 𝐆𝐢𝐨̛́𝐢 (4440 tin nhắn)\n𝗦𝗮̆́𝗽 𝘅𝗲̂́𝗽 𝘁𝗵𝗲𝗼 𝘁𝗵𝘂̛́ 𝘁𝘂̛̣ 𝘁𝘂̛̀ 𝐇𝐚̣ 𝐆𝐢𝐨̛́𝐢 -> 𝐇𝐨̂̃𝐧 Đ𝐨̣̂𝐧 𝐆𝐨̛́𝐢 𝗻𝗵𝘂̛ 𝐏𝐡𝐢 𝐓𝐡𝐚̆𝐧𝐠 𝐓𝐫𝐨𝐧𝐠 𝐓𝐢𝐞̂𝐧 𝐇𝐢𝐞̣̂𝐩\n𝗠𝗼̂̃𝗶 𝟮𝟬 𝘁𝗶𝗻 𝗻𝗵𝗮̆́𝗻 𝗯𝗮̣𝗻 𝘀𝗲̃ đ𝘂̛𝗼̛̣𝗰 𝐯𝐚̀𝐢 𝐭𝐫𝐚̆𝐦 𝐧𝐚̆𝐦 𝐭𝐮 𝐯𝐢 𝐥𝐞̂𝐧 𝐜𝐚𝐨 𝐬𝐞̃ 𝐯𝐚̀𝐢 𝐯𝐚̣𝐧 𝐧𝐚̆𝐦 𝐭𝐮𝐢 𝐯𝐢'
    } else if (!query) {
      const moment = require("moment-timezone");
  const timeNow = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss");
        const userID = event.type == "message_reply" && !event.args[1] ? event.messageReply.senderID : !event.args[1] ? event.senderID : Object.keys(event.mentions)[0];
        const rankUser = storage.findIndex(e => e.id == userID);
        msg += `=== 𝗖𝗛𝗘𝗖𝗞 𝗧𝘂 𝗩𝗶 ===\n\n🏆 𝗧𝗼𝗽 𝗰𝘂̉𝗮 ${userID == senderID ? '𝗯𝗮̣𝗻' : storage[rankUser].name} : ${rankUser + 1}\n💬 𝗧𝗼̂̉𝗻𝗴 𝘀𝗼̂́ 𝘁𝗶𝗻 𝗻𝗵𝗮̆́𝗻 : ${storage[rankUser].count}\n🏅 𝐓𝐮 𝐕𝐢 : ${getRankName(storage[rankUser].count)}\n⏰ 𝗧𝗶𝗺𝗲: ${timeNow}\n❓ [checktuvi 𝗵𝗲𝗹𝗽 ] , [checktuvi 𝗮𝗹𝗹 ]\n🔷 𝗖𝗵𝘂́𝗰 𝗯𝗮̣𝗻 𝘁𝘂̛𝗼̛𝗻𝗴 𝘁𝗮́𝗰 𝘃𝘂𝗶 𝘃𝗲̉`;
    }
    api.sendMessage({body:`${msg}`, attachment: fs.createReadStream(__dirname + `/noprefix/checkrank.jpg`)},event.threadID);
    return;
}