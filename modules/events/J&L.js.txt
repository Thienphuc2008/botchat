this.config = {
	name: "jl",
	eventType: ["log:subscribe", "log:unsubscribe"],
	version: "1.0.1",
	credits: "Quất",
	description: "Thông báo các kiểu"
}
this.run = ({ api: { getCurrentUserID: idbot, shareContact: share, sendMessage: send }, event: { logMessageType: type, logMessageBody: body, logMessageData: { addedParticipants: id, leftParticipantFbId: ido }, author, threadID } }) => {
	let [ jl, fb, mm ] = [ this.config.eventType, o => `Fb.com/${o}`, require("moment-timezone").tz("Asia/Ho_Chi_Minh") ], h = mm.format("HH"), 
	time = `➩ ${body}\n➩ Lúc ${(h <= 10 ? "sáng" : h > 10 && h <= 12 ? "trưa" : h > 12 && h <= 18 ? "chiều" : "tối")} ngày ${mm.format("DD/MM/YYYY || HH:mm:ss")}`
	if (type == jl[0]) {
		let [ l, idj ] = [ id.length, id[0].userFbId ], msg = `${time}\n${author == idj ? `➩ Người tham gia: ${fb(idj)}` : `➩ Người thêm: ${fb(author)}\n${id.map(r => `➩ Người được thêm: ${fb(r.userFbId)}`).join('\n')}`}`
		if (l == 1) share(msg, idj == idbot() ? author : idj, threadID)
		if (l > 1) {
			send(msg, threadID)
			setTimeout(() => Promise.all(id.map(r => share('', r.userFbId, threadID))), 1000)
		}
	}
	if (type == jl[1] && ido != idbot()) share(`${time}\n${ido == author ? `➩ Người out: ${fb(author)}` : `➩ Người kick: ${fb(author)}\n➩ Người bị kick: Fb.com/${fb(ido)}`}`, ido, threadID)
}