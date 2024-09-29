module.exports.config = {
 name: "thamgia",
 version: "1.0.0", 
 hasPermssion: 2,
 Rent: 2,
 credits: "cherry",//vtuan fix :( 
 description: "...",
 commandCategory: "Admin-Hệ Thống", 
 usages: "bủh", 
 cooldowns: 0,
 dependencies: {
   "request": "",
   "fs-extra":"",
   "axios":""
}};

module.exports.handleReply = async ({ event, api, handleReply, Threads }) => {
    var { threadID, messageID, body, senderID } = event;
    var { threadList, author } = handleReply;
    if (senderID != author) return;
    api.unsendMessage(handleReply.messageID);

    if (!body || !body.split(" ").every(value => parseInt(value))) {
        return api.sendMessage('Sai rồi ba', threadID, messageID);
    }

    const selectedNumbers = body.split(",").map(value => parseInt(value.trim()));

    for (const selectedNumber of selectedNumbers) {
        if (!threadList[selectedNumber - 1]) {
            return api.sendMessage(`Lựa chọn ${selectedNumber} không nằm trong danh sách.`, threadID, messageID);
        }

        try {
            const threadInfo = threadList[selectedNumber - 1];
            const { participantIDs } = threadInfo;

            if (participantIDs.includes(senderID)) {
                api.sendMessage(`Bạn đã có mặt trong nhóm ${threadInfo.name}.`, threadID, messageID);
            } else {
                api.addUserToGroup(senderID, threadInfo.threadID, (e) => {});
            }
        } catch (error) {
            api.sendMessage(`:( Em bị lỗi: ${error}`, threadID, messageID);
        }
    }
};

module.exports.run = async function({ api, event, Threads }) {
    var { threadID, messageID, senderID } = event;
    var allThreads = (await api.getThreadList(500, null, ["INBOX"])).filter(i => i.isGroup),
    msg = `Danh sách tất cả các box bạn có thể tham gia:\n\n`,
    number = 0;
    var joinableThreads = allThreads.filter(thread => thread.participantIDs.includes(api.getCurrentUserID()));

    for (var thread of joinableThreads) {
        number++;
        msg += `${number}. ${thread.name}\n`;
    }
    msg += `\nReply tin nhắn này kèm số tương ứng với box mà bạn muốn vào\nCó thể reply nhiều cùng 1 lúc cách nhau bằng dấu cách. vd: 1 2 3 4 ...`;
    if (joinableThreads.length === 0) {
        msg += '\nLưu ý: Bot không có mặt trong một số nhóm và không thể tham gia.';
    }

    return api.sendMessage(msg, threadID, (error, info) => {
        global.client.handleReply.push({
            name: this.config.name,
            messageID: info.messageID,
            author: senderID,
            threadList: joinableThreads
        });
    }, messageID);
};
