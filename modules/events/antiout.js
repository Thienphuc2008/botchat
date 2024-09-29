module.exports.config = {
	name: "antiout",
	eventType: ["log:unsubscribe"],
	version: "0.0.1",
	credits: "DungUwU",
	description: "Listen events"
};

module.exports.run = async({ event, api, Threads, Users }) => {
  const moment = require("moment-timezone");
  var timeNow = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss")
	let data = (await Threads.getData(event.threadID)).data || {};
	if (!data.antiout) return;
	if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;
	const name = global.data.userName.get(event.logMessageData.leftParticipantFbId) || await Users.getNameUser(event.logMessageData.leftParticipantFbId);
	const type = (event.author == event.logMessageData.leftParticipantFbId) ? "tự rời" : "bị quản trị viên đá";
	if (type == "tự rời") {
		api.addUserToGroup(event.logMessageData.leftParticipantFbId, event.threadID, (error, info) => {
			if (error) {
				api.sendMessage(`[ 𝗔𝗡𝗧𝗜𝗢𝗨𝗧 ] → Không thể thêm lại thành viên vào nhóm\n❎ Trạng thái: Thất bại\n👤 Tên: ${name}\n⏰ Thời gian: ${timeNow}`, event.threadID)
			} else api.sendMessage(`[ 𝗔𝗡𝗧𝗜𝗢𝗨𝗧 ] → Kích hoạt chế độ không thể thoát nhóm\n✅ Trạng thái: Thành công\n👤 Tên: ${name}\n⏰ Thời gian: ${timeNow}\n────────────────────\n⚠ Lưu ý: Kích hoạt chế độ cấm thoát nhóm là tính năng tự động thêm tự động người dùng khi thoát khỏi nhóm. Nếu như trong quá trình thêm không thành công do người dùng đã chặn bot, nên không có nút thêm thì bot không thể thêm vào nhóm!!!`, event.threadID);
		})
	}
}