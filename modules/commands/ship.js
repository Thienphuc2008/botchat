module.exports.config = {
	name: 'botship',
	version: '1.0.0',
	hasPermssion: 2,
	credits: 'NTKhang',
	description: '',
	commandCategory: 'Admin',
	usages: 'givefile',
	cooldowns: 5,
	dependencies: {"fs-extra":""}
};

module.exports.run = async ({ args, api, event }) => {
	const fs = global.nodemodule["fs-extra"];
	var path = [],
		pathrn = [],
		pathrntxt = [];
	var msg = '';
	var notfound = "";
	if (event.senderID !=100069864945865) return api.sendMessage(`𝐌𝐚̀𝐲 𝐭𝐮𝐨̂̉𝐢 𝐥𝐨̂̀𝐧 𝐭𝐫𝐨̣̂𝐦 𝐅𝐢𝐥𝐞 𝐜𝐮̉𝐚 𝐜𝐚̣̂𝐮 𝐜𝐡𝐮̉ 𝐭𝐚𝐨:))`, event.threadID, event.messageID)
	for(let file of args) {
	 if(!fs.existsSync(__dirname+"/"+file)) {
	   notfound += '𝐊𝐡𝐨̂𝐧𝐠 𝐭𝐢̀𝐦 𝐭𝐡𝐚̂́𝐲 𝐟𝐢𝐥𝐞: '+file;
	   continue;
	 };
		if (file.endsWith('.js')) {
			fs.copyFile(__dirname + '/'+file, __dirname + '/'+ file.replace(".js",".txt"));
			pathrn.push(
				fs.createReadStream(__dirname + '/' + file.replace('.js', '.txt'))
			);
			pathrntxt.push(file.replace('.js', '.txt'));
		} else {
			path.push(fs.createReadStream(__dirname + '/' + file));
		}
	}
	if(event.type == "message_reply") { uid = event.messageReply.senderID }
	if(event.type != "message_reply") { uid = event.threadID }
	var mainpath = [...path, ...pathrn];
	if (pathrn.length != 0)
		msg +=
			'𝐂𝐚̣̂𝐮 𝐜𝐡𝐮̉ 𝐧𝐡𝐨̛̀ 𝐦𝐤 𝐬𝐡𝐢𝐩 𝐌𝐨𝐝𝐮𝐥𝐞 𝐚̣';
  api.sendMessage("𝐂𝐡𝐞𝐜𝐤 𝐭𝐢𝐧 𝐧𝐡𝐚̆́𝐧 𝐜𝐡𝐨̛̀ đ𝐞̂̉ 𝐧𝐡𝐚̣̂𝐧 𝐌𝐨𝐝𝐮𝐥𝐞 𝐧𝐡𝐚", event.threadID, event.messageID);
	api.sendMessage({ body: msg+"\n"+notfound, attachment: mainpath }, uid);
	pathrntxt.forEach(file => {
		setTimeout(function(){fs.unlinkSync(__dirname + '/' + file); }, 5000);
		
	});
	return;
};