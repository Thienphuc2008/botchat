module.exports.config = {
    name: "fakesodu",
    version: "1.0.2",
    hasPermssion: 0,
    credits: "Dũngkon",
    description: "Tạo ảnh fake số dư tài khoản",
    commandCategory: "Ngân Hàng",
    usages: "",
    cooldowns: 5
};

module.exports.run = async function({ api, event, args, Currencies, Users }) {
    if(this.config.credits !== 'Dũngkon') return api.sendMessage('Đã bảo đừng thay credits rồi mà không nghe, thay lại credits ngay không là đéo dùng được đâu nha', event.threadID, event.messageID);
    const moment = require("moment-timezone");
    const axios = require('axios').default;
    var list_id = [];
    const push = [];
    push.push(Date.now());
    var gio = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss || D/MM/YYYY");

    const [
        name,
        stk,
        amount,
        point
    ] = args.join(" ").trim().split(" | ");

    if (!name) return api.sendMessage(`Thếu tên chủ tài khoản`, event.threadID, event.messageID);
  if (!stk) return api.sendMessage(`Thiếu số tài khoản`, event.threadID, event.messageID);
  if (!amount) return api.sendMessage(`Thiếu số dư mướn fake`, event.threadID, event.messageID);
  if (!point) return api.sendMessage(`Thiếu điểm thưởng`, event.threadID, event.messageID);

    api.sendMessage(`Đang Tạo Ảnh Cho Người Dùng ${(await Users.getData(event.senderID)).name}`, event.threadID , (err, info)  => setTimeout(() => { api.unsendMessage(info.messageID) }, 5000));

    const { data } = await axios.get(`https://sumiproject.io.vn/fakesodu?name=${name}&stk=${stk}&amount=${amount}&point=${point}`, { responseType: 'stream' });

    api.sendMessage({
        body: `Ảnh của bạn đây ${(await Users.getData(event.senderID)).name}\nThời gian xử lý: ${Math.floor((Date.now() - push[0]) / 1000)} giây`,
        mentions: [
            {
                tag: (await Users.getData(event.senderID)).name,
                id: event.senderID,
            },
        ],
        attachment: data
    }, event.threadID, event.messageID);
}