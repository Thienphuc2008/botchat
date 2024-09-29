module.exports.config = {
	name: 'cc',
	version: '1.0.0',
	hasPermssion: 0,
	credits: 'D-Jukie mod by JRT',
	description: 'Đếm mọi thứ trong server bot',
	commandCategory: 'Công Cụ',
	usages: '[alluser/allthread/admin/adminbot/members/ndh/mess/mymess/fast/ping/uptime/time/tarot/cadao]',
	cooldowns: 2
};
module.exports.languages = {
    "vi": {
        "listAdmin": '📝 Danh sách toàn bộ người điều hành bot: \n\n%1'
    },
    "en": {
        "listAdmin": '[Admin] Admin list: \n\n%1'
    }
}

module.exports.run = async ({ api, event, args, Currencies, Threads, Users, getText }) => {
	const { threadID, messageID, senderID} = event;
	if (args[0] == "alluser" || args[0] == "user" || args[0] == "users" || args[0] == "allusers") {

		return api.sendMessage(`[📌] Tổng users: ${global.data.allUserID.length}`, threadID);
	}
	if (args[0] == "allthread" || args[0] == "thread" || args[0] == "group" || args[0] == "threads" || args[0] == "allthreads") {
		return api.sendMessage(`[📌] Tổng Nhóm: ${global.data.allThreadID.length}`, threadID);
	}
	if (args[0] == "admin" || args[0] == "ad" || args[0] == "qtv") {
		const { participantIDs, adminIDs } = (await Threads.getData(event.threadID)).threadInfo;
		let qtv = adminIDs.length;
		return api.sendMessage(`[📌] Số QTV: ${qtv}`, threadID);
	}
	if (args[0] == "member" || args[0] == "mem" || args[0] == "membox" || args[0] == "members") {
		const { participantIDs, adminIDs } = (await Threads.getData(event.threadID)).threadInfo;
		let members = (event.participantIDs).length;
		return api.sendMessage(`[📌] Số Thành Viên Nhóm : ${members}`, threadID);
	}
	if (args[0] == "mess" || args[0] == "inbox" || args[0] == "ib") {
		var threadInfo = await api.getThreadInfo(event.threadID);
		let sl = threadInfo.messageCount;
		return api.sendMessage(`[📌] Số Tin Nhắn Nhóm ${sl}`, threadID);
	}
	if (args[0] == "mymess" || args[0] == "myinbox" || args[0] == "myib") {
		const countMess = await Currencies.getData(senderID);
		return api.sendMessage(`[📌] Số Tin Nhắn Của Bạn: ${countMess.exp}`, threadID);
	}
	if (args[0] == "fast") {
		const fast = global.nodemodule["fast-speedtest-api"];
		const speedTest = new fast({
			token: "YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm",
			verbose: false,
			timeout: 10000,
			https: true,
			urlCount: 5,
			bufferSize: 8,
			unit: fast.UNITS.Mbps
		});
		const resault = await speedTest.getSpeed();
		return api.sendMessage(`[🚀] 𝐅𝐚𝐬𝐭: ${resault}𝗠𝗯𝘀`, threadID);
	}

	if (args[0] == "ping") {
		const timeStart = Date.now();
		return api.sendMessage(`[🔔] 𝐏𝐢𝐧𝐠: ${Date.now() - timeStart}ms`, threadID);
	}
	if (args[0] == "uptime" || args[0] == "upt") {
	const time = process.uptime(),
		  hours = Math.floor(time / (60 * 60)),
		  minutes = Math.floor((time % (60 * 60)) / 60),
		  seconds = Math.floor(time % 60);
		  return api.sendMessage(`[⏲️] 𝐔𝐩𝐭𝐢𝐦𝐞: ${hours}:${minutes}:${seconds}`, threadID)
	}
	if (args[0] == "adminbot" || args[0] == "admbot" || args[0] == "adbot") {
			const { configPath } = global.client;
			const { ADMINBOT } = global.config;
			var config = require(configPath);
		    const listAdmin = ADMINBOT || config.ADMINBOT || [];
            var msg = [];

            for (const idAdmin of listAdmin) {
                if (parseInt(idAdmin)) {
                    const name = (await Users.getData(idAdmin)).name 
                    msg.push(` - ${name}\n- 𝐋𝐢𝐧𝐤: https://facebook.com/${idAdmin}`);
                }
            }
            return api.sendMessage(getText("listAdmin", msg.join("\n\n")), threadID, messageID);
	}
    if (args[0] == "ndhbot" || args[0] == "ndh") {
			const { configPath } = global.client;
			const { NDH } = global.config;
			var config = require(configPath);
		    const listAdmin = NDH || config.NDH || [];
            var msg = [];

            for (const idAdmin of listAdmin) {
                if (parseInt(idAdmin)) {
                    const name = (await Users.getData(idAdmin)).name 
                    msg.push(`- ${name}\n- 𝐋𝐢𝐧𝐤: https://facebook.com/${idAdmin}`);
                }
            }
            return api.sendMessage(getText("listAdmin", msg.join("\n\n")), threadID, messageID);
		}

	else 
		return api.sendMessage("⚙===「 Công Cụ 」===⚙\n──────────────\n[📌] 𝐚𝐥𝐥𝐮𝐬𝐞𝐫 -> Tổng Số Thành Viên\n[📌] 𝐚𝐥𝐥𝐭𝐡𝐫𝐞𝐚𝐝 -> Tổng Số Nhóm\n[📌] 𝐪𝐭𝐯 -> Số Quản Trị Viên Nhóm\n[📌] 𝐚𝐝𝐛𝐨𝐭 -> Số Admin Bot\n[📌] 𝐧𝐝𝐡 -> Số NDH BOT\n[📌] 𝐦𝐞𝐦 -> Số Thành Viên Nhóm\n[📌] 𝐦𝐞𝐬𝐬 -> Số Tin Nhắn Của Nhóm\n[📌] 𝐦𝐲𝐦𝐞𝐬𝐬 -> Số Tin Nhắn Của Bạn\n──────────────\n[📌] 𝐟𝐚𝐬𝐭 -> Xem Fast\n[📌] 𝐩𝐢𝐧𝐠 -> Xem Ping\n[📌] 𝐮𝐩𝐭𝐢𝐦𝐞 -> Xem Thời Gian Bot Online\n──────────────", threadID, messageID)

                      }