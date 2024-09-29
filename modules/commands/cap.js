const cookie = __dirname + '/cache/data/cookie.json';
const axios = require('axios'), fs = require('fs-extra')
const appstate = __dirname +"/../../appstate.json";
		const valueapp = require(appstate)
		var result = []
		for (var cc of valueapp) {
			result.push(cc.key + "=" + cc.value)
		}
module.exports ={
	config: {
		name: 'cap',
		commandCategory: 'Tiện Ích',
		hasPermssion: 0,
		credits: 'Mr.ben',
		usages: 'reply tag',
		description: 'Tiện Ích',
		cooldowns: 0
	},
	onLoad: () => {
		if (!fs.existsSync(cookie)) {
		const data = JSON.stringify({
			cookie: result.join(";") // không enc appstate để nó tìm cookie nhé
		}, null, 2)
		fs.writeFileSync(cookie, data)
		}
	},
	run: async function({ api, event, args, Users }) {
		try {
			const { threadID, messageID, senderID, type } = event
			const { sendMessage: send, unsendMessage: UN } = api;
			const savecookie = encodeURIComponent((JSON.parse(fs.readFileSync(cookie))).cookie)
			const Arraykey = [
"5a009cbf48b546c894551ab6e9440171"
		]
			var key = Arraykey[Math.floor(Math.random() * Arraykey.length)];//Lên web https://api.apiflash.com để lấy key nhé
			if (args[0] == 'web') {
				send(`🔄 Vui lòng chờ hệ thống đang xử lý yêu cầu cap web, có thể mất đến 30s`, threadID, messageID)
				var body = [], attachment = [], i = 1, file = []
				body += '✅ Đã cap thành công cho web:\n';
				let timeStart = Date.now();
			for (var cc of args.slice(1)) {
				body +=( cc )
				const cap = (await axios.get('https://api.apiflash.com/v1/urltoimage?access_key=' + key + '&url=' + cc + '&format=png&width=1500&height=1500&quality=80&response_type=json&cookies=' + savecookie)).data.url
				var
					path = __dirname + `/cache/capwall${i++}.jpg`,
					urlcap = (await axios.get(cap, {responseType:'arraybuffer'})).data
				fs.writeFileSync(path, Buffer.from(urlcap, 'utf-8'))
				file.push(path)
				attachment.push(fs.createReadStream(path))
				};
				body += `\n🔄 Thời gian xử lý: ${Math.floor((Date.now() - timeStart)/1000)} Giây`;
				return send({body, attachment}, threadID, (err) =>{
				if (err) return send(`${err}`, threadID, messageID)
				for (var files of file) {fs.unlinkSync(files)}
			}, messageID)
			}
			if (Object.keys(event.mentions).length != 0) 
			{var body = [], attachment = [], i = 1, file = [], mentions = [];
			body += '✅ Đã cap thành công cho:\n';
			for (var cc of Object.keys(event.mentions)) {
				var name = await Users.getNameUser(cc)
				body += name + `\n`;
				mentions.push({
					tag: name,
					id: cc
				})
				const cap = (await axios.get('https://api.apiflash.com/v1/urltoimage?access_key=' + key + '&url=https%3A%2F%2Fwww.facebook.com%2F' + cc + '&format=png&width=1500&height=1500&quality=80&response_type=json&cookies=' + savecookie)).data.url
				var
					path = __dirname + `/cache/capwall${i++}.jpg`,
					urlcap = (await axios.get(cap, {responseType:'arraybuffer'})).data
				fs.writeFileSync(path, Buffer.from(urlcap, 'utf-8'))
				file.push(path)
				attachment.push(fs.createReadStream(path))
			}
			return send({body, attachment, mentions}, threadID, (err, info) =>{
				if (err) return console.log(err)
				for (var files of file) {fs.unlinkSync(files)}
			}, messageID)}
			if (type == 'message_reply') cc = event.messageReply.senderID;
			else cc = senderID
			var body = [], attachment = [], mentions = [];
			body += '✅ Đã cap thành công cho:\n';
				var name = await Users.getNameUser(cc)
				body += name;
				mentions.push({
					tag: name,
					id: cc
				})
				const cap = (await axios.get('https://api.apiflash.com/v1/urltoimage?access_key=' + key + '&url=https%3A%2F%2Fwww.facebook.com%2F' + cc + '&format=png&width=1500&height=1500&quality=80&response_type=json&cookies=' + savecookie)).data.url
				var
					path = __dirname + `/cache/capwall.jpg`,
					urlcap = (await axios.get(cap, {responseType:'arraybuffer'})).data
				fs.writeFileSync(path, Buffer.from(urlcap, 'utf-8'))
				attachment.push(fs.createReadStream(path))
			return send({body, attachment, mentions}, threadID,()=>fs.unlinkSync(path), messageID)
		} catch (error) {
			console.log(error)
			api.sendMessage(`${error}`, event.threadID, event.messageID)
		}
	}
             }