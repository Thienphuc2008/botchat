module.exports.config = {
    name: "antiqtv",
    eventType: ["log:thread-admins"],
    version: "1.0.0",
    credits: "Vtuan",
    description: "Ngăn chặn việc thay đổi admin",
};

module.exports.run = async function ({ event, api, Threads, Users }) {
    const { logMessageType, logMessageData, senderID } = event;
    const data = (await Threads.getData(event.threadID)).data;

    if (!data.guard) return;

    switch (logMessageType) {
        case "log:thread-admins":
            handleAdminChange(event, api, data);
            break;
    }
};

async function handleAdminChange(event, api, data) {
    const { logMessageData } = event;

    if (logMessageData.ADMIN_EVENT === "add_admin" || logMessageData.ADMIN_EVENT === "remove_admin") {
        if (event.author === api.getCurrentUserID() || logMessageData.TARGET_ID === api.getCurrentUserID()) return;

        api.changeAdminStatus(event.threadID, event.author, false, editAdminsCallback);
        api.changeAdminStatus(event.threadID, logMessageData.TARGET_ID, logMessageData.ADMIN_EVENT === "add_admin");

        function editAdminsCallback(err) {
            if (err) {
                return api.sendMessage("[!]‣ Hiện tại bot không là quản trị viên nên không thể thực thi chế độ anti qtv", event.threadID, event.messageID);
            }

            return api.sendMessage(`[!]‣ Chống thay đổi quản trị viên đang được bật!`, event.threadID, event.messageID);
        }
    }
}
