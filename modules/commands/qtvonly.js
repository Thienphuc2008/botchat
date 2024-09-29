const { writeFileSync, existsSync } = require('fs-extra');
const { resolve } = require("path");

module.exports.config = {
    name: "qtvonly",
    version: "1.0",
    Rent: 1,
    hasPermssion: 1,
    credits: "D-Jukie fix Kadeer",
    description: "Quản lý admin bot",
    commandCategory: "Quản Trị Viên",
    usages: "qtvonly",
    cooldowns: 5,
    dependencies: {
        "fs-extra": ""
    }
};

module.exports.onLoad = function () {
    const dataFilePath = resolve(__dirname, '../../SystemData/data/data.json');
    if (!existsSync(dataFilePath)) {
        const obj = {
            adminbox: {}
        };
        writeFileSync(dataFilePath, JSON.stringify(obj, null, 4));
    } else {
        const data = require(dataFilePath);
        if (!data.hasOwnProperty('adminbox')) data.adminbox = {};
        writeFileSync(dataFilePath, JSON.stringify(data, null, 4));
    }
}

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID, mentions } = event;
    const dataFilePath = resolve(__dirname, '../../SystemData/data/data.json');
    const database = require(dataFilePath);
    const { adminbox } = database;

    if (adminbox[threadID] == true) {
        adminbox[threadID] = false;
        api.sendMessage("➜ 𝐓𝐚̆́𝐭 𝐭𝐡𝐚̀𝐧𝐡 𝐜𝐨̂𝐧𝐠 𝐜𝐡𝐞̂́ đ𝐨̣̂ 𝐪𝐭𝐯𝐨𝐧𝐥𝐲 (𝐭𝐚̂́𝐭 𝐜𝐚̉ 𝐦𝐨̣𝐢 𝐧𝐠𝐮̛𝐨̛̀𝐢 đ𝐞̂̀𝐮 𝐜𝐨́ 𝐭𝐡𝐞̂̉ 𝐬𝐮̛̉ 𝐝𝐮̣𝐧𝐠 𝐛𝐨𝐭)", threadID, messageID);
    } else {
        adminbox[threadID] = true;
        api.sendMessage("➜ 𝐁𝐚̣̂𝐭 𝐭𝐡𝐚̀𝐧𝐡 𝐜𝐨̂𝐧𝐠 𝐜𝐡𝐞̂́ đ𝐨̣̂ 𝐪𝐭𝐯𝐨𝐧𝐥𝐲 (𝐜𝐡𝐢̉ 𝐚𝐝𝐦𝐢𝐧 𝐯𝐨̛́𝐢 𝐪𝐭𝐯 𝐛𝐨𝐱 𝐦𝐨̛́𝐢 𝐜𝐨́ 𝐭𝐡𝐞̂̉ 𝐬𝐮̛̉ 𝐝𝐮̣𝐧𝐠 𝐛𝐨𝐭)", threadID, messageID);
    }
}
