const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
    name: "lọc",
    version: "1.0.0",
    hasPermssion: 1,
    Rent: 2,
    credits: "Vtuan",
    description: "Lọc thành viên",
    commandCategory: "Nhóm",
    usages: "[Số nguyên dương]",
    cooldowns: 5,
    dependencies: {
        "fs-extra": ""
    }
};

module.exports.run = async ({ api, event, args }) => {
    const messageCountFolderPath = path.join(__dirname, '../../SystemData/data/messageCounts');
    fs.ensureDirSync(messageCountFolderPath);
    const threadFilePath = path.join(messageCountFolderPath, `${event.threadID}.json`);
    const { prefix } = global.config;

    try {
        let messageCountData = fs.readJsonSync(threadFilePath, { throws: false }) || { data: [] };
        const threadInfo = await api.getThreadInfo(event.threadID);
        const botID = api.getCurrentUserID();
        const isAdmin = threadInfo.adminIDs.some(admin => admin.id.toString() === botID);

        if (!isAdmin) {
            api.sendMessage("Bot cần là quản trị viên để sử dụng chức năng này.", event.threadID);
            return;
        }

        const minMessages = parseInt(args[0]);
        if (isNaN(minMessages) || minMessages < 0) {
            api.sendMessage(`Vui lòng nhập mức tương tác muốn lọc\nVD: ${prefix}lọc 0\nBot sẽ lọc người có số tương tác bằng 0`, event.threadID);
            return;
        }

        let currentMemberIDs = threadInfo.participantIDs.map(id => id.toString());
        let kickedMembers = [];

        for (let i = messageCountData.data.length - 1; i >= 0; i--) {
            const memberData = messageCountData.data[i];
            const isUserInGroup = currentMemberIDs.includes(memberData.userID);
            if (!isUserInGroup || memberData.count <= minMessages) {
                if (isUserInGroup) {
                    await api.removeUserFromGroup(memberData.userID, event.threadID);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
                kickedMembers.push(memberData.name || `UserID: ${memberData.userID}`);
                messageCountData.data.splice(i, 1);
            }
        }

        await fs.writeJson(threadFilePath, messageCountData, { spaces: 2 });
        if (kickedMembers.length > 0) {
            api.sendMessage(`Danh sách người có ${minMessages} tin nhắn:\n- ${kickedMembers.join('\n- ')}`, event.threadID);
        } else {
            api.sendMessage(`Không có thành viên nào với số tin nhắn <= ${minMessages}.`, event.threadID);
        }
    } catch (error) {
        console.error(`Có lỗi xảy ra khi thực hiện chức năng:`, error);
    }
};
