const fs = require('fs');
const request = require('request');

module.exports.config = {
    name: "noti",
    version: "1.0.0",
    hasPermssion: 3,
    Rent: 2,
    credits: "TruongMini",
    description: "Thông báo cho các nhóm",
    commandCategory: "Admin-Hệ Thống",
    usages: "noti [msg]",
    cooldowns: 5,
}

let atmDir = [];

const getAtm = (atm, body) => new Promise(async (resolve) => {
    let msg = {}, attachment = [];
    msg.body = body;
    for(let eachAtm of atm) {
        await new Promise(async (resolve) => {
            try {
                let response =  await request.get(eachAtm.url),
                    pathName = response.uri.pathname,
                    ext = pathName.substring(pathName.lastIndexOf(".") + 1),
                    path = __dirname + `/cache/${eachAtm.filename}.${ext}`
                response
                    .pipe(fs.createWriteStream(path))
                    .on("close", () => {
                        attachment.push(fs.createReadStream(path));
                        atmDir.push(path);
                        resolve();
                    })
            } catch(e) { console.log(e); }
        })
    }
    msg.attachment = attachment;
    resolve(msg);
})

module.exports.handleReply = async function ({ api, event, handleReply, Users, Threads }) {
    const { threadID, messageID, senderID, body } = event;
    let name = await Users.getNameUser(senderID);
    switch (handleReply.type) {
        case "noti": {
            let text = `» Phản Hồi Từ User «\n▱▱▱▱▱▱▱▱▱▱▱▱▱\n➜ Name: ${name}\nNhóm: ${(await Threads.getInfo(threadID)).threadName || "Unknow"}\n➜ Nội dung : ${body || "không nội dung"}\n▱▱▱▱▱▱▱▱▱▱▱▱▱\nReply để gửi lại thành viên`;
            if(event.attachments.length > 0) text = await getAtm(event.attachments, `» Phản Hồi Từ User «\n▱▱▱▱▱▱▱▱▱▱▱▱▱\n➜ Name: ${name}\n➜ Nhóm: ${(await Threads.getInfo(threadID)).threadName || "Unknow"}\n➜ Nội dung: ${body}\n▱▱▱▱▱▱▱▱▱▱▱▱▱\nReply để gửi lại thành viên`);
            api.sendMessage(text, handleReply.threadID, (err, info) => {
                atmDir.forEach(each => fs.unlinkSync(each))
                atmDir = [];
                global.client.handleReply.push({
                    name: this.config.name,
                    type: "reply",
                    messageID: info.messageID,
                    messID: messageID,
                    threadID
                })
            });
            break;
        }
        case "reply": {
            let text = `» Phản Hồi Từ Admin «\n▱▱▱▱▱▱▱▱▱▱▱▱▱\n\n➜ Name: ${name}\n➜ Nội dung : ${body}\n▱▱▱▱▱▱▱▱▱▱▱▱▱\nreply tin nhắn này để báo về admin`;
            if(event.attachments.length > 0) text = await getAtm(event.attachments, `» Phản Hồi Từ Admin «\n▱▱▱▱▱▱▱▱▱▱▱▱▱\n➜ Name: ${name}\n${body}\n▱▱▱▱▱▱▱▱▱▱▱▱▱\nreply tin nhắn này để báo về admin`);
            api.sendMessage(text, handleReply.threadID, (err, info) => {
                atmDir.forEach(each => fs.unlinkSync(each))
                atmDir = [];
                global.client.handleReply.push({
                    name: this.config.name,
                    type: "noti",
                    messageID: info.messageID,
                    threadID
                })
            }, handleReply.messID);
            break;
        }
    }
}

module.exports.run = async function ({ api, event, args, Users }) {
    const { threadID, messageID, senderID, messageReply } = event;
    if (!args[0]) return api.sendMessage("Nội dung??", threadID);
    let allThread = global.data.allThreadID || [];
    let can = 0, canNot = 0;
    let text = `» 𝗧𝗛𝗢̂𝗡𝗚 𝗕𝗔́𝗢 𝗔𝗗𝗠𝗜𝗡 «\n▱▱▱▱▱▱▱▱▱▱▱▱▱\n➜ Name: ${await Users.getNameUser(senderID)}\n➜ Nội dung: ${args.join(" ")}\n▱▱▱▱▱▱▱▱▱▱▱▱▱\nReply tin nhắn này để báo về admin`;
    if(event.type == "message_reply") text = await getAtm(messageReply.attachments, `» 𝗧𝗛𝗢̂𝗡𝗚 𝗕𝗔́𝗢 𝗔𝗗𝗠𝗜𝗡 «\n▱▱▱▱▱▱▱▱▱▱▱▱▱\n➜ Name: ${await Users.getNameUser(senderID)}\n➜ Nội dung: ${args.join(" ")}\n▱▱▱▱▱▱▱▱▱▱▱▱▱\nReply tin nhắn này để báo về admin`);
    await new Promise(resolve => {
        allThread.forEach((each) => {
            try {
                api.sendMessage(text, each, (err, info) => {
                    if(err) { canNot++; }
                    else {
                        can++;
                        atmDir.forEach(each => fs.unlinkSync(each))
                        atmDir = [];
                        global.client.handleReply.push({
                            name: this.config.name,
                            type: "noti",
                            messageID: info.messageID,
                            messID: messageID,
                            threadID
                        })
                        resolve();
                    }
                })
            } catch(e) { console.log(e) }
        })
    })
    api.sendMessage(`➜ Đã gửi tới ${can} nhóm!\n➜ Không thể gửi tới ${canNot} nhóm!`, threadID);
}
