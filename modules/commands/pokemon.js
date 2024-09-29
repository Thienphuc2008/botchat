module.exports.config = {
    name: "pokemon",
    version: "1.0.4",
    hasPermssion: 0,
    credits: "D-Jukie",
    Rent: 2,
    description: "Nuôi pokemon, chiến đấu tăng lực chiến!",
    commandCategory: "Trò Chơi",
    usages: "[]",
    cooldowns: 0,
    dependencies: {
        "gifencoder": ""
    },
    envConfig: {
        APIKEY: ""
    }
};

module.exports.handleEvent = async function({ api, event, Currencies }) {
    const { threadID, messageID, body, senderID } = event;
    if (!body) return;
    if(!global.pokemon) return
        const gameThread = global.pokemon.get(threadID) || {};
    if (!gameThread) return;
    if(gameThread.start != true) return;
    if (!gameThread.player.find(i => i.userID == senderID)) return;
    var s, q;
    var s = gameThread.player.findIndex(i => i.userID == senderID);
    var q = gameThread.player[s];
    if(body.toLowerCase() == 'my pokemon') {
        const user = require('./Trò_chơi/pokemon/datauser/' + `${senderID}.json`);
        if (q.choose.status == true) return api.sendMessage('⚠ Bạn đã chọn rồi không thể chọn lại!', threadID, messageID);
        var msg = `🔍Số pokemon hiện có ${user.pet.length}\n`
        var ii = 0;
        for (let i of user.pet) {
            msg += `[${++ii}]. ${i.name} - ${i.coins}$\n🐳Type: ${i.type}\n🧡HP: ${i.HP}\n🗡Attack: ${i.Attack}\n🛡Defense: ${i.Defense}\n⚡️Speed: ${i.Speed}\n📌Skill: ${i.skill.join(', ')}\n\n`
        }
        msg += 'Nhớ số thứ tự của pokemon bạn đã chọn!'
        api.sendMessage(msg, senderID)
        return api.sendMessage('Vui lòng reply tin nhắn này với số thứ tự pokemon tương ứng trong tin nhắn với bot!', threadID, (error, info) => {
            global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: event.senderID,
                type: "playerSolo",
                pet: user.pet
            })
        }, messageID);
    }
}
module.exports.run = async ({ api, event, args, Users }) => {
    const { threadID, messageID, senderID } = event;
    const { readFileSync, writeFileSync, existsSync, createReadStream } = require("fs-extra")
    const pathA = require("path");
    const axios = require("axios")
    const path = pathA.join(__dirname, 'Trò_chơi','pokemon', 'datauser', `${senderID}.json`);
    switch (args[0]) {
        case "register":
        case "-r": { 
            if (!existsSync(path)) {
                const obj = {};
                obj.name = (await Users.getData(senderID)).name;
                obj.ID = senderID;
                obj.pet = [];
                obj.foods = [];
                obj.solo = {}
                obj.solo.win = 0
                obj.solo.lose = 0
                obj.solo.draw = 0
                writeFileSync(path, JSON.stringify(obj, null, 4));
                return api.sendMessage("========[POKEMON]========\n⚔️Đăng kí nuôi pokemon thành công⚔️", threadID, messageID);
            }
            else return api.sendMessage("========[POKEMON]========\n⚔️Bạn đã có trong cơ sở dữ liệu⚔️", threadID, messageID);
            break;
        }
        case 'info':
        case '-i': {
            if (!existsSync(path)) { return api.sendMessage('🔍Bạn chưa đăng kí nuôi pokemon!', threadID, messageID); }
            const pathPoke = require("./Trò_chơi/pokemon/datauser/" + senderID + '.json');
            var name = pathPoke.name,
                ID = pathPoke.ID,
                pet = pathPoke.pet.length,
                foods = pathPoke.foods.length,
                win = pathPoke.solo.win,
                lose = pathPoke.solo.lose
            return api.sendMessage(`👤Người nuôi pokemon: ${name}\n🔍ID: ${ID}\n⏳Số pokemon: ${pet}\n🛍Túi thức ăn: ${foods}\n✅Số trận thắng: ${win}\n❎Số trận thua: ${lose}\n\n👉Thả cảm xúc '👍' vào để xem pokemon hiện có.`, threadID, (error, info) => {
                global.client.handleReaction.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    type: "infoPoke",
                })
            }, messageID);
        }
        case 'shop':
        case '-s': {
            if (!existsSync(path)) { return api.sendMessage('🔍Bạn chưa đăng kí nuôi pokemon!', threadID, messageID); }
            const pathPoke = require("./Trò_chơi/pokemon/pokemon.json");
            return api.sendMessage("========[POKEMON]========\n👉 1/ Mua thức ăn cho pokemon.\n👉 2/ Bán pokemon.\n👉 3/ Cường hóa sức mạnh. (bỏ ra 70000$ số tiền để tăng 40% sức mạnh cho 1 pokemon.\n👉 4/ Mua rương hextech ra ngẫu nhiên 1 pokemon.\n🧐Reply tin nhắn này với lựa chọn của bạn.", threadID, (error, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    type: "shop",
                    path: pathPoke
                })
            }, messageID);
        }
        case 'list':
        case '-l': {
            if (!existsSync(path)) { return api.sendMessage('🔍Bạn chưa đăng kí nuôi pokemon!', threadID, messageID); }
            const listPoke = require("./Trò_chơi/pokemon/pokemon.json");
            var list = [], index = 0;
            for (let i of listPoke) {
                index++
                var msg = `🔍ID: ${index}\n🕵️‍♀️NamePoke: ${i.name} - ${i.coins}$\n🧡HP: ${i.power.HP}\n🗡Attack: ${i.power.Attack}\n🛡Defense: ${i.power.Defense}\n⚡️Speed: ${i.power.Speed}\n\n`;
                list.push(msg)
            }
            var page = 1;
            page = parseInt(args[1]) || 1;
            page < -1 ? page = 1 : "";
            var limit = 15;
            var data = "==== DANH SÁCH POKEMON ===\n\n";
            var numPage = Math.ceil(list.length / limit);
              for (var i = limit * (page - 1); i < limit * (page - 1) + limit; i++) {
                if (i >= list.length) break;
                  let poke = list[i];                  
                  data += poke;
              }
            data += `\n» Trang ${page}/${numPage}--\n» Dùng ->${this.config.name} số trang`
            data += `\n» Reply ID để xem thông tin chi tiết về pokemon\n`
            return api.sendMessage(data, threadID, (error, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    type: "pokemon",
                })
            }, messageID);
        }
        case 'bag': 
        case '-b': {
            if (!existsSync(path)) { return api.sendMessage('🔍Bạn chưa đăng kí nuôi pokemon!', threadID, messageID); }
            const user = require('./Trò_chơi/pokemon/datauser/' + `${senderID}.json`);
            var msg = `🔍Số pokemon hiện có ${user.pet.length}\n`
            var ii = 0;
            var iii = 0;
            for (let i of user.pet) {
                msg += `[${++ii}]. ${i.name} - ${i.coins}$\n🐳Type: ${i.type}\n🧡HP: ${i.HP}\n🗡Attack: ${i.Attack}\n🛡Defense: ${i.Defense}\n⚡️Speed: ${i.Speed}\n\n`
            }
            msg += '👉Số thức ăn hiện có: ' + user.foods.length + '\n'
            for (let i of user.foods) {
                msg += `[${++iii}]. ${i.name}\n🧡HP: ${i.HP}\n🗡Attack: ${i.Attack}\n🛡Defense: ${i.Defense}\n⚡️Speed: ${i.Speed}\n🐳Type: ${i.type}\n\n`
            }
            msg += 'Reply tin nhắn này bằng cách nối 2 số thứ tự: pokemon + thức ăn để cho pokemon ăn (cùng hệ được tăng 130% sức mạnh)'
            return api.sendMessage(msg, threadID, (error, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    type: "petFoods",
                    pet: user.pet,
                    food: user.foods
                })
            }, messageID);
        }
        case 'search':
        case 'find':
        case '-f': {
            const stringSimilarity = require('string-similarity');
            var listPoke = require("./Trò_chơi/pokemon/pokemon.json");
            var msg = [], image = [];
            for (let id of listPoke) { 
                msg.push(id.name)
            } 
            var s = args.join(" ").slice(parseInt(args[0].length))         
            var checker = stringSimilarity.findBestMatch(s, msg)
            if (checker.bestMatch.rating >= 1) { var search = checker.bestMatch.target }
            var s = checker.bestMatch.target
            var findPoke = listPoke.find(c => c.name == s)
            let pokemon = (await axios.get(findPoke.images, { responseType: "arraybuffer" } )).data;
            writeFileSync( __dirname + "/pokemon/cache/pokemonfind.png", Buffer.from(pokemon, "utf-8") );
            image.push(createReadStream(__dirname + "/pokemon/cache/pokemonfind.png"));
            var message = {body: `🔍Tìm kiếm:\n🕵️‍♀️Name: ${findPoke.name}\n🔍ID: ${findPoke.ID + 1}\n🐳Type: ${findPoke.type}\n🧡HP: ${findPoke.power.HP}\n🗡Attack: ${findPoke.power.Attack}\n🛡Defense: ${findPoke.power.Defense}\n⚡️Speed: ${findPoke.power.Speed}\n💰Coins: ${findPoke.coins}$\n💬Mô tả: ${findPoke.description}\n👉Thả cảm xúc '👍' vào để mua pokemon này!`, attachment: image};
            return api.sendMessage(message, threadID, (error, info) => {
                global.client.handleReaction.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    type: 'buyPokemon',
                    ID: findPoke.ID
                })
            }, messageID);
        }
        case 'solo': {
            if (!existsSync(path)) { return api.sendMessage('🔍Bạn chưa đăng kí nuôi pokemon!', threadID, messageID); }
            const user = require('./Trò_chơi/pokemon/datauser/' + `${senderID}.json`);
            if(user.pet.length == 0) return api.sendMessage('🔍Bạn có 0 pokemon nên không thể tham gia!', threadID, messageID)
            if (!global.pokemon) global.pokemon = new Map();
            var gameThread = global.pokemon.get(threadID);
            switch (args[1]) {
                case 'create':
                case '-c': {
                    if (global.pokemon.has(threadID)) return api.sendMessage('⚠Nhóm bạn đang có map solo khác nên không thể tạo thêm, vui lòng hủy map trước đó!', threadID, messageID);
                    var name = await Users.getNameUser(senderID);
                    global.pokemon.set(threadID, { box: threadID, start: false, author: senderID, number: 0, player: [{ name, userID: senderID, choose: { status: false, msg: null } }] });
                    return api.sendMessage('🎉Tạo map đấu thành công, bắt đầu khi có 2 thành viên tham gia.\n👤1/2 player\n👉Join: pokemon solo join/-j', threadID, messageID);
                } 
                case 'join':
                case '-j': {
                    if (!global.pokemon.has(threadID)) return api.sendMessage('⚠Nhóm này hiện tại chưa có map đấu nào, vui lòng tạo để tham gia!', threadID, messageID);
                    if (gameThread.start == true) return api.sendMessage('⚠Map đấu ở nhóm này đã bắt đầu!', threadID, messageID);
                    if (gameThread.player.find(i => i.userID == senderID)) return api.sendMessage('⚠Bạn đã tham gia trước đó!', threadID, messageID);
                    var name = await Users.getNameUser(senderID);
                    gameThread.player.push({ name, userID: senderID, choose: { status: false, msg: null } });
                    if(gameThread.player.length > 2) return api.sendMessage('⚠Số người tham gia vào map này đã đủ!', threadID, messageID);
                    gameThread.start = true;
                    global.pokemon.set(threadID, gameThread);
                    api.sendMessage('🎉Tham gia thành công.\n👤2/2 player\b🔥Bắt đầu sau 5s', threadID, messageID);
                    setTimeout(() => { return api.sendMessage('👉Vui lòng nhập "my pokemon" để chọn pokemon chiến đấu!', threadID, messageID)}, 5000);
                    return
                }
                case "end":
                case "end":
                case "-e": {
                    if (!gameThread) return api.sendMessage('⚠Nhóm này hiện tại chưa có map đấu nào để có thể hủy!', threadID, messageID);
                    if (gameThread.author != senderID) return api.sendMessage('⚠Bạn không thể hủy map đấu do người khác tạo ra!', threadID, messageID);
                    global.pokemon.delete(threadID);
                    return api.sendMessage('🎉Đã xóa map đấu!', threadID, messageID); 
                }
                default: {
                    return api.sendMessage('[====ĐẤU TRƯỜNG POKEMON===]\n👉Tạo trận đấu: create/-c\n👉Tham gia: join/-j\n👉Kết thúc trận: end/-e', threadID, messageID);
                }
            }
        }
        case 'support': {
            return api.sendMessage('[====SUPPORT===]\n1. Liên hệ mua APIKEY!\n2. Đóng góp ý tưởng, yêu cầu tính năng!\n3. Nhận GIFCODE\n4. Nhập GIFTCODE', threadID, (error, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    type: "spadmin"
                })
            }, messageID);
        }
        default: {
	const fs = require('fs-extra');
	const img1 = ["https://i.imgur.com/LpjMIUe.jpg"]
	var path1 = __dirname + "/cache/pokemon.jpg"
	var rdimg1 = img1[Math.floor(Math.random() * img1.length)]; 
	const imgP1 = []
	let dowloadIMG1 = (await axios.get(rdimg1, { responseType: "arraybuffer" } )).data; 
	fs.writeFileSync(path1, Buffer.from(dowloadIMG1, "utf-8") );
	imgP1.push(fs.createReadStream(path1))
  var msg1 = '[====[POKEMON]====]\n👉Đăng kí: register/-r\n👉List pokemon: list/-l\n👉Info user: info/-i\n👉Cửa hàng: shop/-s\n👉Ba lô: bag/-b\n👉Tìm kiếm: search/find/-f\n👉Đấu trường: solo -c/-j/-e\n👉Hỗ trợ, giftcode: support'
	var msgg1 = {body: msg1, attachment: imgP1}   
            return api.sendMessage(msgg1, threadID, messageID)
        };
    }
}
module.exports.handleReply = async ({ event, api, Currencies, handleReply, Users }) => {
    if (String(event.senderID) !== String(handleReply.author)) return;
    const { body, threadID, messageID, senderID } = event;
    const axios = require("axios")
    const { readFileSync, writeFileSync, existsSync, createReadStream, unlinkSync, writeFile } = require("fs-extra")
    switch (handleReply.type) {
        case 'spadmin': {
            switch (body) {
                case '1':
                case '2': {
                    api.unsendMessage(handleReply.messageID)
                    return api.sendMessage('👉Vui lòng reply tin nhắn này kèm nội dung để gửi tin nhắn tới admin game!', threadID, (error, info) => {
                        global.client.handleReply.push({
                            name: this.config.name,
                            messageID: info.messageID,
                            author: event.senderID,
                            type: "message"
                        })
                    }, messageID);
                }
                case '3': {
                    var res = await axios.get(`https://apipokemon-1.sdwdewhgdjwwdjs.repl.co/giftcode?type=get`);
                    if(res.data.msg == false) return api.sendMessage('Hôm nay không có GIFTCODE', threadID, messageID);
                    return api.sendMessage('👉GIFTCODE TÂN THỦ!:\n' + res.data.msg, threadID, messageID);
                }
                case '4': {
                    api.unsendMessage(handleReply.messageID)
                    return api.sendMessage('👉Vui lòng reply tin nhắn này với nội dung là GIFTCODE bạn nhận được từ admin!', threadID, (error, info) => {
                        global.client.handleReply.push({
                            name: this.config.name,
                            messageID: info.messageID,
                            author: event.senderID,
                            type: "giftcode"
                        })
                    }, messageID);
                }
            }
        }
        case 'message': {
            var res = await axios.get(`https://apipokemon-1.sdwdewhgdjwwdjs.repl.co/message?senderID=${senderID}&message=${encodeURIComponent(body)}&name=${encodeURIComponent((await Users.getData(senderID)).name)}`);
            api.unsendMessage(handleReply.messageID)
            if(res.data.msg != true) return api.sendMessage('💬Gửi tin nhắn đến admin game thất bại!', threadID, messageID);
            return api.sendMessage('💬Gửi tin nhắn đến admin game thành công!', threadID, messageID);
        }
        case 'giftcode': {
            var res = await axios.get(`https://apipokemon-1.sdwdewhgdjwwdjs.repl.co/giftcode?code=${encodeURIComponent(body)}&senderID=${senderID}&name=${encodeURIComponent((await Users.getData(senderID)).name)}`);
            if(res.data.msg == false) return api.sendMessage('🧡SAI GIFCODE, VUI LÒNG CHỜ CODE MỚI!', threadID, messageID);
            if(res.data.msg == 'fail') return api.sendMessage('🧡Bạn đã nhận rồi nên không thể nhận tiếp!', threadID, messageID);
            api.unsendMessage(handleReply.messageID)
            const pathA = require("path");
            const path = pathA.join(__dirname, 'Trò_chơi','pokemon', 'datauser', `${senderID}.json`);
            const user = require('./Trò_chơi/pokemon/datauser/' + `${senderID}.json`);
            const listPoke = require("./Trò_chơi/pokemon/pokemon.json");
            var rd = listPoke[Math.floor(Math.random() * listPoke.length)]; 
            var image = [];
            if(user.pet.includes(rd)) {
                return api.sendMessage(`❌Bạn mở trúng ${rd.name} nhưng bạn đã sở hữu rồi nên mất code❌`, threadID, messageID);
            }
            user.pet.push({
                name: rd.name,
                type: rd.type,
                HP: rd.power.HP,
                Attack: rd.power.Attack,
                Defense: rd.power.Defense,
                Speed: rd.power.Speed,
                coins: 0,
                images: rd.images
            })
            writeFileSync(path, JSON.stringify(user, null, 2));
            let pokemon = (await axios.get(rd.images, { responseType: "arraybuffer" } )).data;
            writeFileSync( __dirname + "/pokemon/cache/pokemon.png", Buffer.from(pokemon, "utf-8") );
            image.push(createReadStream(__dirname + "/pokemon/cache/pokemon.png"));
            var msg = {body: `🧡GIFTCODE TÂN THỦ!\n☑️Bạn mở trúng ${rd.name}.\nType: ${rd.type}\n🔍Chỉ số: \n🧡HP: ${rd.power.HP}\n🗡Attack: ${rd.power.Attack}\n🛡Defense: ${rd.power.Defense}\n⚡️Speed: ${rd.power.Speed}\n💰Coins: 0$\n☑️Đã thêm pokemon vào kho đồ của bạn!`, attachment: image}
            return api.sendMessage(msg, threadID, messageID);
        }
        case 'pokemon': {
            if (isNaN(body)) return api.sendMessage("========[POKEMON]========\nLựa chọn của bạn không phải là một con số!", threadID, messageID);
            if (parseInt(body) > 809 || parseInt(body) < 1) return api.sendMessage("========[POKEMON]========\nLựa chọn của bạn không tồn tại!", threadID, messageID);
            var image = [], 
                listPoke = require("./Trò_chơi/pokemon/pokemon.json"),
                name = '🕵️‍♀️Tên: ' + listPoke[parseInt(body) -1].name,
                HP = '🧡Máu: ' + listPoke[parseInt(body) -1].power.HP,
                Attack = '🗡Tấn công: ' + listPoke[parseInt(body) -1].power.Attack,
                Defense = '🛡Phòng thủ: ' + listPoke[parseInt(body) -1].power.Defense,
                Speed = '⚡️Tốc độ: ' + listPoke[parseInt(body) -1].power.Speed,
                description = '💬Mô tả: ' + listPoke[parseInt(body) -1].description,
                coins = '💰Coins: ' + listPoke[parseInt(body) -1].coins;
            let pokemon = (await axios.get(listPoke[parseInt(body) -1].images, { responseType: "arraybuffer" } )).data;
            writeFileSync( __dirname + "/pokemon/cache/pokemon.png", Buffer.from(pokemon, "utf-8") );
            image.push(createReadStream(__dirname + "/pokemon/cache/pokemon.png"));
            var msg = {body: `${name}\n${HP}\n${Attack}\n${Defense}\n${Speed}\n${description}\n${coins}$\n\n👉Thả cảm xúc '👍' để mua pokemon này!`, attachment: image}
            api.unsendMessage(handleReply.messageID)
            return api.sendMessage(msg, threadID, (error, info) => {
                global.client.handleReaction.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    type: 'buyPokemon',
                    ID: parseInt(body) -1
                })
            }, messageID);
        }
        case 'shop': {
            if (isNaN(body)) return api.sendMessage("========[POKEMON]========\nLựa chọn của bạn không phải là một con số!", threadID, messageID);
            if (parseInt(body) > 4 || parseInt(body) < 1) return api.sendMessage("========[POKEMON]========\nLựa chọn của bạn không tồn tại!", threadID, messageID);
            api.unsendMessage(handleReply.messageID)
            switch (body) {
                case "1": {
                    return api.sendMessage(`👉Thức ăn dành cho pokemon:\n👉1. Hệ lửa\n👉2. Hệ điện\n👉3. Bình thường\n👉4. Hệ cỏ/sâu\n👉5. Hệ đất/đá\n👉6. Hệ nước\n👉Reply để đưa ra sự lựa chọn của bạn!`, threadID, (error, info) => {
                        global.client.handleReply.push({
                            name: this.config.name,
                            messageID: info.messageID,
                            author: event.senderID,
                            type: "choose_type",
                        })
                    }, messageID);
                }
                case "2": {
                    const user = require('./Trò_chơi/pokemon/datauser/' + `${senderID}.json`);
                    var msg = `🔍Số pokemon hiện có ${user.pet.length}\n`
                    var ii = 0;
                    for (let i of user.pet) {
                        msg += `[${++ii}]. ${i.name} - ${i.coins}$\n🐳Type: ${i.type}\n🧡HP: ${i.HP}\n🗡Attack: ${i.Attack}\n🛡Defense: ${i.Defense}\n⚡️Speed: ${i.Speed}\n\n`
                    }
                    msg += 'Reply tin nhắn này kèm số thứ tự để bán pokemon!'
                    api.unsendMessage(handleReply.messageID)
                    return api.sendMessage(msg, threadID, (error, info) => {
                        global.client.handleReply.push({
                            name: this.config.name,
                            messageID: info.messageID,
                            author: event.senderID,
                            type: "choose_sell",
                        })
                    }, messageID);
                }
                case "3": {
                    const user = require('./Trò_chơi/pokemon/datauser/' + `${senderID}.json`);
                    var msg = `🔍Chọn pokemon muốn cường hóa\n`
                    var ii = 0;
                    for (let i of user.pet) {
                        msg += `[${++ii}]. ${i.name} - ${i.coins}$\n🐳Type: ${i.type}\n🧡HP: ${i.HP}\n🗡Attack: ${i.Attack}\n🛡Defense: ${i.Defense}\n⚡️Speed: ${i.Speed}\n💰Coins: ${i.coins}$\n\n`
                    }
                    api.unsendMessage(handleReply.messageID)
                    return api.sendMessage(msg, threadID, (error, info) => {
                        global.client.handleReply.push({
                            name: this.config.name,
                            messageID: info.messageID,
                            author: event.senderID,
                            type: "choose_buff",
                        })
                    }, messageID);
                }
                case "4": {
                    return api.sendMessage(`👉Các loại rương dành cho bạn:\n[1]. Rương thường (5000$/1 ngày 3 lần)\n[2]. Rương tuyệt phẩm (10000$/3 ngày 1 lần)\n[3]. Rương VIP (20000$/3 ngày 1 lần)\n[4]. Rương FREE (1 tuần/1 lần)\n👉Reply để đưa ra sự lựa chọn của bạn!`, threadID, (error, info) => {
                        global.client.handleReply.push({
                            name: this.config.name,
                            messageID: info.messageID,
                            author: event.senderID,
                            type: "choose_box",
                        })
                    }, messageID);
                }
            }
        }
        case "choose_type": {
            if (isNaN(body)) return api.sendMessage("========[POKEMON]========\nLựa chọn của bạn không phải là một con số!", threadID, messageID);
            if (parseInt(body) > 6 || parseInt(body) < 1) return api.sendMessage("========[POKEMON]========\nLựa chọn của bạn không tồn tại!", threadID, messageID);
            var fire = ['Red Stew a la Cube', 'Blue Soda a la Cube', 'Yellow Curry a la Cube', 'Mouth Watering Dip a la Cube', 'Hot Pot a la Cube']
            var electric = ['Watt a Risotto a la Cube', 'Light-as-Air Casserole a la Cube', 'Mouth Watering Dip a la Cube']
            var nor = ['Veggie Smoothie a la Cube', 'Brain Food a la Cube', 'Plain Crepe a la Cube', 'Veggie Smoothie a la Cube']
            var co = ['Sludge Soup a la Cube', 'Veggie Smoothie a la Cube', 'Mouth Watering Dip a la Cube']
            var dat = ['Mud Pie a la Cube', 'Veggie Smoothie a la Cube', 'Light-as-Air Casserole a la Cube', 'Stone Soup a la Cube']
            var water = ['Blue Soda a la Cube', 'Yellow Curry a la Cube', 'Mouth Watering Dip a la Cube']
            var msg = [];
            var coins = 500
            if(body == 1) {
                msg += '🔥Thức ăn dành cho hệ lửa\n'
                for (let i in fire) { msg += `${parseInt(i) + 1}. ${fire[i]} - ${parseInt(i)*1000}$\n`}
                    api.unsendMessage(handleReply.messageID)
                return api.sendMessage(msg, threadID, (error, info) => {
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: event.senderID,
                        type: "choose_foods",
                        tpy: fire,
                        typePoke: 'Fire'
                    })
                }, messageID);
            }
            if(body == 2) {
                msg += '⚡Thức ăn dành cho hệ điện\n'
                for (let i in electric) { msg += `${parseInt(i) + 1}. ${electric[i]} - ${(parseInt(i) +1) *1000}$\n`}
                    api.unsendMessage(handleReply.messageID)
                return api.sendMessage(msg, threadID, (error, info) => {
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: event.senderID,
                        type: "choose_foods",
                        tpy: electric,
                        typePoke: 'Electric'
                    })
                }, messageID);
            }
            if(body == 3) {
                msg += '😐Thức ăn dành cho hệ bình thường\n'
                for (let i in nor) { msg += `${parseInt(i) + 1}. ${nor[i]} - ${(parseInt(i) +1) *1000}$\n`}
                    api.unsendMessage(handleReply.messageID)
                return api.sendMessage(msg, threadID, (error, info) => {
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: event.senderID,
                        type: "choose_foods",
                        tpy: nor,
                        typePoke: 'Normal'
                    })
                }, messageID);
            }
            if(body == 4) {
                msg += '🍀/🐛Thức ăn dành cho hệ cỏ/sâu\n'
                for (let i in co) { msg += `${parseInt(i) + 1}. ${co[i]} - ${(parseInt(i) +1) *1000}$\n`}
                    api.unsendMessage(handleReply.messageID)
                return api.sendMessage(msg, threadID, (error, info) => {
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: event.senderID,
                        type: "choose_foods",
                        tpy: co,
                        typePoke: 'Grass'
                    })
                }, messageID);
            }
            if(body == 5) {
                msg += '🗻Thức ăn dành cho hệ đất/đá\n'
                for (let i in dat) { msg += `${parseInt(i) + 1}. ${dat[i]} - ${(parseInt(i) +1) *1000}$\n`}
                    api.unsendMessage(handleReply.messageID)
                return api.sendMessage(msg, threadID, (error, info) => {
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: event.senderID,
                        type: "choose_foods",
                        tpy: dat,
                        typePoke: 'Ground'
                    })
                }, messageID);
            }
            if(body == 6) {
                msg += '💧Thức ăn dành cho hệ nước\n'
                for (let i in water) { msg += `${parseInt(i) + 1}. ${water[i]} - ${(parseInt(i) +1) *1000}$\n`}
                    api.unsendMessage(handleReply.messageID)
                return api.sendMessage(msg, threadID, (error, info) => {
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: event.senderID,
                        type: "choose_foods",
                        tpy: water,
                        typePoke: 'Water'
                    })
                }, messageID);
            }           
        }
        case 'choose_foods': {
            if (isNaN(body)) return api.sendMessage("========[POKEMON]========\nLựa chọn của bạn không phải là một con số!", threadID, messageID);
            let balance = (await Currencies.getData(senderID)).money;
            if(balance < parseInt(body) * 1000) return api.sendMessage('Bạn không có đủ tiền để mua thức ăn này\n💰Giá: ' + (parseInt(body) * 1000) + '$', threadID, messageID);
            Currencies.setData(senderID, options = { money: balance - parseInt(body) * 1000 })
            var typ = handleReply.tpy
            var choose = typ[parseInt(body) - 1]
            const pathA = require("path");
            const path = pathA.join(__dirname, 'Trò_chơi','pokemon', 'datauser', `${senderID}.json`);
            const user = require('./Trò_chơi/pokemon/datauser/' + `${senderID}.json`);
            user.foods.push({
                name: choose,
                type: handleReply.typePoke,
                HP: parseInt(body) * 4,
                Attack: parseInt(body) * 4,
                Defense: parseInt(body) * 4,
                Speed: parseInt(body) * 4,
            })
            writeFileSync(path, JSON.stringify(user, null, 2));
            api.unsendMessage(handleReply.messageID)
            return api.sendMessage('☑️Mua thành công: ' + choose + ` - ${(parseInt(body) * 1000)}$\n🧡HP: ${parseInt(body) * 4}\n🗡Attack: ${parseInt(body) * 4}\n🛡Defense: ${parseInt(body) * 4}\n⚡️Speed: ${parseInt(body) * 4}\n🐳Type: ${handleReply.typePoke}`, threadID, messageID)
        }
        case 'petFoods': {
            const pathA = require("path");
            const path = pathA.join(__dirname, 'Trò_chơi','pokemon', 'datauser', `${senderID}.json`);
            const user = require('./Trò_chơi/pokemon/datauser/' + `${senderID}.json`);
            var pet = handleReply.pet,
                foods = handleReply.food,
                choose = body.split(" ")
            if (parseInt(choose[0]) > pet.length || parseInt(choose[1]) > foods.length || parseInt(choose[0]) < 1 || parseInt(choose[1]) < 1) return api.sendMessage("========[POKEMON]========\nLựa chọn của bạn không tồn tại!", threadID, messageID);
            if(pet[parseInt(choose[0])-1].type.indexOf(foods[parseInt(choose[1])-1].type) !== -1) {
                var HP = ((foods[parseInt(choose[1])-1].HP) * 1.3).toFixed(1)
                var Attack = ((foods[parseInt(choose[1])-1].Attack) * 1.3).toFixed(1)
                var Defense = ((foods[parseInt(choose[1])-1].Defense) * 1.3).toFixed(1)
                var Speed = ((foods[parseInt(choose[1])-1].Speed) * 1.3).toFixed(1)
                var coins = 5000
            } else {
                var HP = foods[parseInt(choose[1])-1].HP
                var Attack = foods[parseInt(choose[1])-1].Attack
                var Defense = foods[parseInt(choose[1])-1].Defense
                var Speed = foods[parseInt(choose[1])-1].Speed
                var coins = 2500
            }
                pet[parseInt(choose[0])-1].HP = pet[parseInt(choose[0])-1].HP + HP
                pet[parseInt(choose[0])-1].Attack = pet[parseInt(choose[0])-1].Attack + Attack
                pet[parseInt(choose[0])-1].Defense = pet[parseInt(choose[0])-1].Defense + Defense
                pet[parseInt(choose[0])-1].Speed = pet[parseInt(choose[0])-1].Speed + Speed
                pet[parseInt(choose[0])-1].coins = pet[parseInt(choose[0])-1].coins + coins
                const index = user.foods.findIndex(item => item.name == foods[parseInt(choose[1])-1].name);
                var name = foods[index].name
                user.foods.splice(index, 1);
                writeFileSync(path, JSON.stringify(user, null, 2));
                api.unsendMessage(handleReply.messageID)
            return api.sendMessage(`${pet[parseInt(choose[0])-1].name} đã ăn thành công ${name}\n🔍Chỉ số pet hiện tại:\n🧡HP: ${(pet[parseInt(choose[0])-1].HP).toFixed(1)}\n🗡Attack: ${(pet[parseInt(choose[0])-1].Attack).toFixed(1)}\n🛡Defense: ${(pet[parseInt(choose[0])-1].Defense).toFixed(1)}\n⚡️Speed: ${(pet[parseInt(choose[0])-1].Speed).toFixed(1)}`, threadID, messageID)
        }
        case 'choose_sell': {
            const pathA = require("path");
            const path = pathA.join(__dirname, 'Trò_chơi','pokemon', 'datauser', `${senderID}.json`);
            const user = require('./Trò_chơi/pokemon/datauser/' + `${senderID}.json`);
            const pokeSell = user.pet[parseInt(body)-1].name
            const index = user.pet.findIndex(item => item.name == pokeSell);
            const name = user.pet[index].name
            const coins = user.pet[index].coins
            user.pet.splice(index, 1);
            writeFileSync(path, JSON.stringify(user, null, 2));
            api.unsendMessage(handleReply.messageID)
            let balance = (await Currencies.getData(senderID)).money;
            Currencies.setData(senderID, options = { money: balance + parseInt(coins) })
            return api.sendMessage(`💰Bạn đã bán thành công ${name} với giá ${coins}$`, threadID, messageID);
        }
        case 'choose_buff': {
            let balance = (await Currencies.getData(senderID)).money;
            if(balance < 70000) return api.sendMessage('Bạn không có đủ tiền để mua pokemon này\n💰Giá: ' + 50000 + '$', threadID, messageID);
            Currencies.setData(senderID, options = { money: balance - 70000 })
            const pathA = require("path");
            const path = pathA.join(__dirname, 'Trò_chơi','pokemon', 'datauser', `${senderID}.json`);
            const user = require('./Trò_chơi/pokemon/datauser/' + `${senderID}.json`);
            const pokeSell = user.pet[parseInt(body)-1].name
            const index = user.pet.findIndex(item => item.name == pokeSell);
            var poke = user.pet[index]
                poke.HP = (poke.HP + poke.HP * 40/100).toFixed(1)
                poke.Attack = (poke.Attack + poke.Attack * 40/100).toFixed(1)
                poke.Defense = (poke.Defense + poke.Defense * 40/100).toFixed(1)
                poke.Speed = (poke.Speed + poke.Speed * 40/100).toFixed(1)
                poke.coins = (poke.coins + poke.coins * 20/100).toFixed(1)
            writeFileSync(path, JSON.stringify(user, null, 2));
            api.unsendMessage(handleReply.messageID)
            return api.sendMessage(`💹Cường hóa thành công ${poke.name}\n🔍Chỉ số hiện tại:\n🧡HP: ${poke.HP}\n🗡Attack: ${poke.Attack}\n🛡Defense: ${poke.Defense}\n⚡️Speed: ${poke.Speed}\n💰Coins: ${poke.coins}$`, threadID, messageID);
        }
        case 'choose_box': {
            let balance = (await Currencies.getData(senderID)).money;
            if(body == 1) {
                const cooldown = 86400000 * 3
                let data = (await Currencies.getData(senderID)).data || {};
                if (typeof data !== "undefined" && cooldown - (Date.now() - data.PRO) > 0) {
                    var time = cooldown - (Date.now() - data.PRO),
                        minutes = Math.floor(time / 60000),
                        seconds = ((time % 60000) / 1000).toFixed(0); 
                    if(minutes / 60 > 1) return api.sendMessage(`⏰Vui lòng chờ ${(minutes / 60).toFixed(0)} giờ`, threadID, messageID);
                    return api.sendMessage(`⏰Vui lòng chờ ${minutes} phút ${seconds} giây`, threadID, messageID);
                }
                if(balance < 5000) return api.sendMessage('Bạn không có đủ tiền để mua rương này\n💰Giá: 5000$', threadID, messageID);
                Currencies.setData(senderID, options = { money: balance - 5000 })
                var msg = '☑️Mua thành công rương thường (5000$)\n👉Thả cảm xúc "👍" vào để mở nó'
                    api.unsendMessage(handleReply.messageID)
                
                return api.sendMessage(msg, threadID, (error, info) => {
                    global.client.handleReaction.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: event.senderID,
                        type: "openBox",
                        tpy: 0.5,
                        money: 5000
                    })
                }, messageID);
            }
            if(body == 2) {
                const cooldown = 86400000 * 3
                let data = (await Currencies.getData(senderID)).data || {};
                if (typeof data !== "undefined" && cooldown - (Date.now() - data.ULTRA) > 0) {
                    var time = cooldown - (Date.now() - data.ULTRA),
                        minutes = Math.floor(time / 60000),
                        seconds = ((time % 60000) / 1000).toFixed(0); 
                    if(minutes / 60 > 1) return api.sendMessage(`⏰Vui lòng chờ ${(minutes / 60).toFixed(0)} giờ`, threadID, messageID);
                    return api.sendMessage(`⏰Vui lòng chờ ${minutes} phút ${seconds} giây`, threadID, messageID);
                }
                if(balance < 10000) return api.sendMessage('Bạn không có đủ tiền để mua rương này\n💰Giá: 10000$', threadID, messageID);
                Currencies.setData(senderID, options = { money: balance - 10000 })
                var msg = '☑️Mua thành công rương tuyệt phẩm (10000$)\n👉Thả cảm xúc "👍" vào để mở nó'
                    api.unsendMessage(handleReply.messageID)
                
                return api.sendMessage(msg, threadID, (error, info) => {
                    global.client.handleReaction.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: event.senderID,
                        type: "openBox",
                        tpy: 1,
                        money: 10000
                    })
                }, messageID);
            }
            if(body == 3) {
                const cooldown = 86400000 * 3
                let data = (await Currencies.getData(senderID)).data || {};
                if (typeof data !== "undefined" && cooldown - (Date.now() - data.MEGA) > 0) {
                    var time = cooldown - (Date.now() - data.MEGA),
                        minutes = Math.floor(time / 60000),
                        seconds = ((time % 60000) / 1000).toFixed(0); 
                    if(minutes / 60 > 1) return api.sendMessage(`⏰Vui lòng chờ ${(minutes / 60).toFixed(0)} giờ`, threadID, messageID);
                    return api.sendMessage(`⏰Vui lòng chờ ${minutes} phút ${seconds} giây`, threadID, messageID);
                }
                if(balance < 20000) return api.sendMessage('Bạn không có đủ tiền để mua rương này\n💰Giá: 20000$', threadID, messageID);
                Currencies.setData(senderID, options = { money: balance - 20000 })
                var msg = '☑️Mua thành công rương VIP (20000$)\n👉Thả cảm xúc "👍" vào để mở nó'
                    api.unsendMessage(handleReply.messageID)
                
                return api.sendMessage(msg, threadID, (error, info) => {
                    global.client.handleReaction.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: event.senderID,
                        type: "openBox",
                        tpy: 1.5,
                        money: 20000
                    })
                }, messageID);
            }
            if(body == 4) {
                const cooldown = 86400000 * 7
                let data = (await Currencies.getData(senderID)).data || {};
                if (typeof data !== "undefined" && cooldown - (Date.now() - data.FREE) > 0) {
                    var time = cooldown - (Date.now() - data.FREE),
                        minutes = Math.floor(time / 60000),
                        seconds = ((time % 60000) / 1000).toFixed(0); 
                    if(minutes / 60 > 1) return api.sendMessage(`⏰Vui lòng chờ ${(minutes / 60).toFixed(0)} giờ`, threadID, messageID);
                    return api.sendMessage(`⏰Vui lòng chờ ${minutes} phút ${seconds} giây`, threadID, messageID);
                }
                var msg = '☑️Mua thành công rương FREE 3 ngày/1 lần (0$)\n👉Thả cảm xúc "👍" vào để mở nó'
                    api.unsendMessage(handleReply.messageID)
                
                return api.sendMessage(msg, threadID, async (error, info) => {
                    global.client.handleReaction.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: event.senderID,
                        type: "openBox",
                        tpy: 0.4,
                        money: 0
                    })
                }, messageID);
            }
        }
        case 'playerSolo': {
            var author = handleReply.author
            var name = (await Users.getData(author)).name
            if (isNaN(body)) return api.sendMessage("========[POKEMON]========\nLựa chọn của bạn không phải là một con số!", threadID, messageID);
            if(parseInt(body) > handleReply.pet.length || parseInt(body) < 1) return api.sendMessage("========[POKEMON]========\nLựa chọn của bạn không tồn tại!", threadID, messageID);
            var pet = handleReply.pet[parseInt(body) -1]
            api.unsendMessage(handleReply.messageID)
            var image = [];
            var gameThread = global.pokemon.get(threadID) || {};
            var s = gameThread.player.findIndex(i => i.userID == senderID);
            var q = gameThread.player[s];
            gameThread.player.splice(s, 1);
            gameThread.player.push({ name: q.name, userID: senderID, choose: { status: true, msg: { name: pet.name ,type: pet.type, HP: pet.HP, Attack: pet.Attack, Defense: pet.Defense, Speed: pet.Speed, skill: pet.skill, images: pet.images } } });
                gameThread.number = gameThread.number + 1;
                global.pokemon.set(threadID, gameThread);
                let pokemon = (await axios.get(pet.images, { responseType: "arraybuffer" } )).data;
                writeFileSync( __dirname + `/pokemon/cache/${gameThread.number}.png`, Buffer.from(pokemon, "utf-8") );
                image.push(createReadStream(__dirname + `/pokemon/cache/${gameThread.number}.png`));
                var msg = { body: `🎉${name} đã chọn ${pet.name}\n⚔️Type: ${pet.type}\nChỉ số:\n🧡HP: ${pet.HP}\n🗡Attack: ${pet.Attack}\n🛡Defense: ${pet.Defense}\n⚡️Speed: ${pet.Speed}\n📌Skill: ${pet.skill.join(', ')}`, attachment: image }
                api.sendMessage(msg, senderID)
            api.sendMessage(name + ' đã hoàn tất việc chọn pokemon', threadID, messageID)
            if(gameThread.number != 2) return;
            if(gameThread.number == 2) {
                setTimeout(() => {
                    var msg = [], i = 1;
                    for (let user of gameThread.player) {
                        var data = user.choose.msg
                        msg += `[ Người chơi ${i++}: ${user.name} ]\n🎉Pokemon ra trận: ${data.name}\n⚔️Type: ${data.type}\n👉Các chỉ số cơ bản:\n🧡HP: ${data.HP}\n🗡Attack: ${data.Attack}\n🛡Defense: ${data.Defense}\n⚡️Speed: ${data.Speed}\n📌Skill: ${data.skill.join(', ')}\n\n`
                    }
                    api.sendMessage(msg, threadID, messageID);
                }, 5000);
                var map = [
                        'Bản đồ trên không', 
                        'Bản đồ trên mặt nước', 
                        'Bản đồ núi lửa', 
                        'Bản đồ mưa (có sấm)', 
                        'Bản đồ trong rừng', 
                        'Bản đồ núi đá', 
                        'Bản đồ băng tuyết', 
                        'Bản đồ sương mù', 
                        'Bản đồ Mê cung',
                        'Bản đồ ma quái',
                        'Bản đồ vũ trụ',
                        'Bản đồ cao nguyên xanh'
                        ];
                var rdMap = map[Math.floor(Math.random() * map.length)];   
                setTimeout(() => {
                    if(map[0] == rdMap) var buffType = 'Flying, Fire, Normal';
                    if(map[1] == rdMap) var buffType = 'Water, Electric, Ghost';
                    if(map[2] == rdMap) var buffType = 'Fire, Water, Dragon';
                    if(map[3] == rdMap) var buffType = 'Electric, Water, Grass';
                    if(map[4] == rdMap) var buffType = 'Bug, Grass, Fire';
                    if(map[5] == rdMap) var buffType = 'Ground, Rock, Electric';
                    if(map[6] == rdMap) var buffType = 'Ice, Steel, Psychic';
                    if(map[7] == rdMap) var buffType = 'Steel, Ghost, Rock';
                    if(map[8] == rdMap) var buffType = 'Dark, Ghost, Grass';
                    if(map[9] == rdMap) var buffType = 'Ground, Steel, Rock';
                    if(map[10] == rdMap) var buffType = 'Flying, Dragon, Dark';
                    if(map[10] == rdMap) var buffType = 'Bug, Ice, Flying';
                    if(map[11] == rdMap) var buffType = 'Poison, Normal, Dark';
                    api.sendMessage(`[RANDOM MAP] - ${rdMap}\n💪Tăng sức mạnh cho hệ '${buffType}'`, threadID);
                    setTimeout(() => {
                        var user_1 = gameThread.player[0]
                        var user_2 = gameThread.player[1]
                        var image = [];
                        if(buffType.indexOf(user_1.choose.msg.type) !== -1) {
                            var search = gameThread.player.findIndex(i => i.userID == user_1.userID);
                            var index = gameThread.player[search].choose.msg;
                                index.HP = (index.HP + index.HP * 40/100).toFixed(1);
                                index.Attack = (index.Attack + index.Attack * 40/100).toFixed(1);
                                index.Defense = (index.Defense + index.Defense * 40/100).toFixed(1);
                                index.Speed = (index.Speed + index.Speed * 40/100).toFixed(1);
                                global.pokemon.set(threadID, gameThread);
                            var poke_1 = gameThread.player[search] || {};
                            api.sendMessage(`👤${poke_1.name}\n🗺️MAP đấu BUFF sức mạnh của ${poke_1.choose.msg.name}\n🧡HP: ${poke_1.choose.msg.HP}\n🗡Attack: ${poke_1.choose.msg.Attack}\n🛡Defense: ${poke_1.choose.msg.Defense}\n⚡️Speed: ${poke_1.choose.msg.Speed}`, threadID);
                        }
                        if(buffType.indexOf(user_2.choose.msg.type) !== -1) {
                            var search = gameThread.player.findIndex(i => i.userID == user_2.userID);
                            var index = gameThread.player[search].choose.msg;
                                index.HP = (index.HP + index.HP * 40/100).toFixed(1);
                                index.Attack = (index.Attack + index.Attack * 40/100).toFixed(1);
                                index.Defense = (index.Defense + index.Defense * 40/100).toFixed(1);
                                index.Speed = (index.Speed + index.Speed * 40/100).toFixed(1);
                                global.pokemon.set(threadID, gameThread);
                            var poke_2 = gameThread.player[search] || {};
                            api.sendMessage(`👤${poke_2.name}\n🗺️MAP đấu BUFF sức mạnh cho ${poke_2.choose.msg.name}\n🧡HP: ${poke_2.choose.msg.HP}\n🗡Attack: ${poke_2.choose.msg.Attack}\n🛡Defense: ${poke_2.choose.msg.Defense}\n⚡️Speed: ${poke_2.choose.msg.Speed}`, threadID);
                        }
                        //---------->canvas<-----------//
                        var skill = pet.skill
                        setTimeout( async function () {
                            var { loadImage, createCanvas, Canvas } = require("canvas");
                            var Canvas = require("canvas");
                            var fs = require("fs-extra");
                            if(!existsSync(__dirname+'/pokemon/cache/Bangers-Regular.ttf')) { 
                                let getfont = (await axios.get(`https://drive.google.com/u/0/uc?id=1tD8kgjXszN_amDVUPwbGdlT6PJxDRhYq&export=download`, { responseType: "arraybuffer" })).data;
                                writeFileSync(__dirname+"/pokemon/cache/Bangers-Regular.ttf", Buffer.from(getfont, "utf-8"));
                            };
                            var backgoundP = (await axios.get('https://i.imgur.com/fIiQ3nQ.jpg', { responseType: "arraybuffer" })).data;
                            writeFileSync(__dirname + "/cache/backgound.png", Buffer.from(backgoundP, "utf-8") );
                            var pokemonF = (await axios.get(user_1.choose.msg.images, { responseType: "arraybuffer" } )).data; 
                            writeFileSync(__dirname + "/cache/pokemonF.png", Buffer.from(pokemonF, "utf-8") );
                            var pokemonS = (await axios.get(user_2.choose.msg.images, { responseType: "arraybuffer" } )).data; 
                            writeFileSync(__dirname + "/cache/pokemonS.png", Buffer.from(pokemonS, "utf-8") );
                            var loadBackgound = await loadImage(__dirname + "/cache/backgound.png");
                            var loadPokeF = await loadImage(__dirname + "/cache/pokemonF.png");
                            var loadPokeS = await loadImage(__dirname + "/cache/pokemonS.png");
                            var canvas = createCanvas(loadBackgound.width, loadBackgound.height);
                            Canvas.registerFont(__dirname + `/pokemon/cache/Bangers-Regular.ttf`, { family: "Bangers-Regula" });
                            var ctx = canvas.getContext("2d");
                                ctx.drawImage(loadBackgound, 0, 0, canvas.width, canvas.height);
                                ctx.drawImage(loadPokeF, 251, 196, 400, 400);
                                ctx.drawImage(loadPokeS, 1279, 196, 400, 400);
                                ctx.font = "55px Bangers-Regula";
                                ctx.fillStyle = "#0000BB";
                                ctx.textAlign = "center";
                                ctx.fillText(user_1.choose.msg.name, 392, 790);
                                ctx.fillText(user_2.choose.msg.name, 1516, 790);
                            var imageBuffer = canvas.toBuffer();
                            writeFileSync(__dirname + "/cache/backgound.png", imageBuffer);
                            api.sendMessage({body: `🧡[${user_1.choose.msg.name}] ⚔️ [${user_2.choose.msg.name}]🧡`, attachment: createReadStream(__dirname + "/cache/backgound.png")},threadID)
                            setTimeout( async function () {
                                var content = [user_1.choose.msg.images, 'https://i.imgur.com/JCpX8Eq.png', user_2.choose.msg.images, 'https://i.imgur.com/SfTPzSU.png', 'https://i.imgur.com/nHmSEGK.png']
                                var GIFEncoder = require('gifencoder');
                                var encoder = new GIFEncoder(500, 500);
                                encoder.start();
                                var canvas = createCanvas(500, 500);
                                var ctx = canvas.getContext('2d');
                                var i = 0;
                                for(let id of content) {
                                  encoder.setRepeat(-1);  
                                  encoder.setDelay(1000); 
                                  encoder.setQuality(10);
                                  try { 
                                    var pathPokeGif = (__dirname+`/cache/poke${i++}.png`)
                                    var imagee = (await axios.get(id, { responseType: 'arraybuffer' })).data; 
                                    writeFileSync(pathPokeGif, Buffer.from(imagee, 'utf-8'));
                                    let baseImage = await loadImage(pathPokeGif);
                                    ctx.shadowColor = '#FFFF00';
                                    ctx.shadowBlur = 60;
                                    ctx.shadowOffsetX = 0;
                                    ctx.shadowOffsetY = 0;
                                    ctx.fillRect(0, 0, canvas.width, canvas.height)
                                    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
                                    encoder.addFrame(ctx);
                                    unlinkSync(pathPokeGif)
                                  } 
                                  catch(e) { continue }
                                }
                                encoder.finish();
                                const path = __dirname + '/pokemon/cache/abc.gif'
                                const buf = encoder.out.getData();
                                writeFile(path, buf)
                                setTimeout( function () {
                                    api.sendMessage({body: '⚔️Kết quả trận đấu có sau trong giây lát!', attachment: createReadStream(path)}, threadID)
                                    var index_1 = poke_1 || user_1
                                    var index_2 = poke_2 || user_2
                                    var name_1 = index_1.name
                                    var name_2 = index_2.name
                                    var TB_1 = index_1.choose.msg.HP + index_1.choose.msg.Attack + index_1.choose.msg.Defense + index_1.choose.msg.Speed
                                    var TB_2 = index_2.choose.msg.HP + index_2.choose.msg.Attack + index_2.choose.msg.Defense + index_2.choose.msg.Speed
                                    setTimeout( async function () {
                                        var imageee = [];
                                        const pathA = require("path");
                                        global.pokemon.delete(threadID);
                                        if(TB_1 > TB_2) {
                                            let pokemon = (await axios.get(index_1.choose.msg.images, { responseType: "arraybuffer" } )).data;
                                            writeFileSync( __dirname + `/Trò_chơi/pokemon/cache/nguoichoi1.png`, Buffer.from(pokemon, "utf-8") );
                                            imageee.push(createReadStream(__dirname + `/Trò_chơi/pokemon/cache/nguoichoi1.png`));
                                            var user_1 = require('./Trò_chơi/pokemon/datauser/' + `${index_1.userID}.json`);
                                            var user_2 = require('./Trò_chơi/pokemon/datauser/' + `${index_2.userID}.json`);
                                            var path_1 = pathA.join(__dirname, 'Trò_chơi','pokemon', 'datauser', `${index_1.userID}.json`);
                                            var path_2 = pathA.join(__dirname, 'Trò_chơi','pokemon', 'datauser', `${index_2.userID}.json`);
                                            var find = user_1.pet.find(i => i.name == index_1.choose.msg.name)
                                                find.HP = (find.HP + find.HP * 5/100);
                                                find.Attack = (find.Attack + find.Attack * 5/100);
                                                find.Defense = (find.Defense + find.Defense * 5/100);
                                                find.Speed = (find.Speed + find.Speed * 5/100);
                                                find.coins = (find.coins + find.coins * 5/100);
                                            var win = user_1.solo
                                                win.win = win.win + 1
                                            var find = user_2.pet.find(i => i.name == index_2.choose.msg.name)
                                                find.HP = (find.HP - find.HP * 5/100).toFixed(1);
                                                find.Attack = (find.Attack - find.Attack * 5/100)
                                                find.Defense = (find.Defense - find.Defense * 5/100);
                                                find.Speed = (find.Speed - find.Speed * 5/100);
                                                find.coins = (find.coins - find.coins * 5/100);
                                            var lose = user_2.solo
                                                lose.lose = lose.lose + 1
                                                writeFileSync(path_1, JSON.stringify(user_1, null, 2));
                                                writeFileSync(path_2, JSON.stringify(user_2, null, 2));
                                            var msg = {body: `🎉${index_1.choose.msg.name} của người chơi ${name_1} đã chiến thắnggg!\n☑️Tất cả chỉ số cơ bản của pokemon thắng này được tăng 5%, ngược lại thì sẽ bị trừ 5%!`, attachment: imageee}
                                            return api.sendMessage(msg, threadID);
                                        } 
                                        else if(TB_1 < TB_2) { 
                                            let pokemon = (await axios.get(index_2.choose.msg.images, { responseType: "arraybuffer" } )).data;
                                            writeFileSync( __dirname + `/pokemon/cache/nguoichoi2.png`, Buffer.from(pokemon, "utf-8") );
                                            imageee.push(createReadStream(__dirname + `/pokemon/cache/nguoichoi2.png`));
                                            var user_1 = require('./Trò_chơi/pokemon/datauser/' + `${index_1.userID}.json`);
                                            var user_2 = require('./Trò_chơi/pokemon/datauser/' + `${index_2.userID}.json`);
                                            var path_1 = pathA.join(__dirname, 'Trò_chơi','pokemon', 'datauser', `${index_1.userID}.json`);
                                            var path_2 = pathA.join(__dirname, 'Trò_chơi','pokemon', 'datauser', `${index_2.userID}.json`);
                                            var find = user_2.pet.find(i => i.name == index_2.choose.msg.name)
                                                find.HP = (find.HP + find.HP * 5/100);
                                                find.Attack = (find.Attack + find.Attack * 5/100);
                                                find.Defense = (find.Defense + find.Defense * 5/100);
                                                find.Speed = (find.Speed + find.Speed * 5/100);
                                                find.coins = (find.coins + find.coins * 5/100);
                                            var win = user_2.solo
                                                win.win = win.win + 1
                                            var find = user_1.pet.find(i => i.name == index_1.choose.msg.name)
                                                find.HP = (find.HP - find.HP * 5/100);
                                                find.Attack = (find.Attack - find.Attack * 5/100);
                                                find.Defense = (find.Defense - find.Defense * 5/100);
                                                find.Speed = (find.Speed - find.Speed * 5/100);
                                                find.coins = (find.coins - find.coins * 5/100);
                                            var lose = user_1.solo
                                                lose.lose = lose.lose + 1
                                                writeFileSync(path_1, JSON.stringify(user_1, null, 2));
                                                writeFileSync(path_2, JSON.stringify(user_2, null, 2));
                                            var msg = {body: `🎉${index_2.choose.msg.name} của người chơi ${name_2} đã chiến thắnggg!\n☑️Tất cả chỉ số cơ bản của pokemon này được tăng 5%, ngược lại thì sẽ bị trừ 5%!`, attachment: imageee}
                                            return api.sendMessage(msg, threadID);
                                        } 
                                        else {
                                            var user_1 = require('./Trò_chơi/pokemon/datauser/' + `${index_1.userID}.json`);
                                            var user_2 = require('./Trò_chơi/pokemon/datauser/' + `${index_2.userID}.json`);
                                            var path_1 = pathA.join(__dirname, 'Trò_chơi','pokemon', 'datauser', `${index_1.userID}.json`);
                                            var path_2 = pathA.join(__dirname, 'Trò_chơi','pokemon', 'datauser', `${index_2.userID}.json`);
                                            var win = user_1.solo
                                                win.draw = win.draw + 1
                                            var win = user_2.solo
                                                win.draw = win.draw + 1
                                                writeFileSync(path_1, JSON.stringify(user_1, null, 2));
                                                writeFileSync(path_2, JSON.stringify(user_2, null, 2));
                                            return api.sendMessage('🎉Các chỉ số của 2 pokemon đang chiến đấu gần như bằng nhau nên trận này hòa!', threadID); 
                                        }
                                    }, 7000);
                                }, 2000);
                            }, 500);
                        }, 3000);
                    }, 2000);
                }, 8000);
            }
        }
    }
}
module.exports.handleReaction = async ({ api, event, handleReaction, Currencies }) => {
    if (parseInt(event.userID) !== parseInt(handleReaction.author)) return;
    const { threadID, messageID, senderID } = event;
    const { readFileSync, writeFileSync, existsSync, createReadStream } = require("fs-extra")
    const axios = require("axios")
    if (event.reaction != "👍") return;
    switch (handleReaction.type) {
        case 'buyPokemon': {
            const pathA = require("path");
            const path = pathA.join(__dirname, 'Trò_chơi','pokemon', 'datauser', `${handleReaction.author}.json`);
            const user = require('./Trò_chơi/pokemon/datauser/' + `${handleReaction.author}.json`);
            const listPoke = require("./Trò_chơi/Trò_chơi/pokemon/pokemon.json");
            const index = listPoke[handleReaction.ID];
            let balance = (await Currencies.getData(handleReaction.author)).money;
            if(user.pet.some(i => i.name == index.name) == true) return api.sendMessage('❌Bạn đã mua pokemon này trước đó', threadID, messageID);
            if(balance < parseInt(index.coins)) return api.sendMessage('Bạn không có đủ tiền để mua pokemon này\n💰Giá: ' + index.coins + '$', threadID, messageID);
            Currencies.setData(handleReaction.author, options = { money: balance - parseInt(index.coins) })
            var skill = [], skillS = []
            for (let i of index.skill) {
                skill.push(i[0])
                skillS += i[0] + ', '
            }
            user.pet.push({
                name: index.name,
                type: index.type,
                HP: index.power.HP,
                Attack: index.power.Attack,
                Defense: index.power.Defense,
                Speed: index.power.Speed,
                coins: index.coins,
                skill: skill,
                images: index.images
            })
            var image = [];
            writeFileSync(path, JSON.stringify(user, null, 2));
            let pokemon = (await axios.get(index.images, { responseType: "arraybuffer" } )).data;
            writeFileSync( __dirname + "/pokemon/cache/pokemon.png", Buffer.from(pokemon, "utf-8") );
            image.push(createReadStream(__dirname + "/pokemon/cache/pokemon.png"));
            api.unsendMessage(handleReaction.messageID)
            var msg = {body: `☑️Mua thành công: ${index.name} - ${index.coins}$\n🔍Chỉ số:\n🧡HP: ${index.power.HP}\n🗡Attack: ${index.power.Attack}\n🛡Defense: ${index.power.Defense}\n⚡️Speed: ${index.power.Speed}\n📌Skill: ${skillS.replace(/,\s*$/, "")}`, attachment: image}
            return api.sendMessage(msg, threadID, messageID);
        }
        case 'infoPoke': {
            var skill = [];
            const user = require('./Trò_chơi/pokemon/datauser/' + `${handleReaction.author}.json`);
            var msg = `🔍Số pokemon hiện có ${user.pet.length}\n`
            var ii = 0;
            for (let i of user.pet) {
                msg += `[${++ii}]. ${i.name} - ${i.coins}$\n🐳Type: ${i.type}\n🧡HP: ${i.HP}\n🗡Attack: ${i.Attack}\n🛡Defense: ${i.Defense}\n⚡️Speed: ${i.Speed}\n📌Skill: ${i.skill.join(', ')}\n\n`
            }
            api.unsendMessage(handleReaction.messageID)
            return api.sendMessage(msg, threadID, messageID);
        }
        case 'openBox': {
            api.unsendMessage(handleReaction.messageID)
            const pathA = require("path");
            const path = pathA.join(__dirname, 'Trò_chơi','pokemon', 'datauser', `${handleReaction.author}.json`);
            const user = require('./Trò_chơi/pokemon/datauser/' + `${handleReaction.author}.json`);
            const listPoke = require("./Trò_chơi/pokemon/pokemon.json");
            var rd = listPoke[Math.floor(Math.random() * listPoke.length)]; 
            var image = [];
            if(user.pet.includes(rd)) {
                let balance = (await Currencies.getData(handleReaction.author)).money;
                Currencies.setData(handleReaction.author, options = { money: balance + parseInt(rd.coins) })
                return api.sendMessage(`❌Bạn mở trúng ${rd.name} nhưng bạn đã sở hữu rồi nên được hoàn tiền lại❌`, threadID, messageID);
            }
            if(handleReaction.tpy == 0.5) {
                data.PRO = Date.now();
                await Currencies.setData(handleReaction.author, { data });
            }
            if(handleReaction.tpy == 1) {
                data.ULTRA = Date.now();
                await Currencies.setData(handleReaction.author, { data });
            }
            if(handleReaction.tpy == 1.5) {
                data.MEGA = Date.now();
                await Currencies.setData(handleReaction.author, { data });
            }
            if(handleReaction.tpy == 0.4) {
                data.FREE = Date.now();
                await Currencies.setData(handleReaction.author, { data });
            }
            var skill = [], skillS = []
            for (let i of rd.skill) {
                skill.push(i[0])
                skillS += i[0] + ', '
            }
            user.pet.push({
                name: rd.name,
                type: rd.type,
                HP: (rd.power.HP * handleReaction.tpy).toFixed(1),
                Attack: (rd.power.Attack * handleReaction.tpy).toFixed(1),
                Defense: (rd.power.Defense * handleReaction.tpy).toFixed(1),
                Speed: (rd.power.Speed * handleReaction.tpy).toFixed(1),
                skill: skill,
                coins: handleReaction.money,
                images: rd.images
            })
            writeFileSync(path, JSON.stringify(user, null, 2));
            let pokemon = (await axios.get(rd.images, { responseType: "arraybuffer" } )).data;
            writeFileSync( __dirname + "/Trò_chơi/pokemon/cache/pokemon.png", Buffer.from(pokemon, "utf-8") );
            image.push(createReadStream(__dirname + "/Trò_chơi/pokemon/cache/pokemon.png"));
            var msg = {body: `🎉Xin chúc mừng!\n☑️Bạn mở trúng ${rd.name}.\nType: ${rd.type}\n🔍Chỉ số: \n🧡HP: ${(rd.power.HP* handleReaction.tpy).toFixed(1)}\n🗡Attack: ${(rd.power.Attack* handleReaction.tpy).toFixed(1)}\n🛡Defense: ${(rd.power.Defense* handleReaction.tpy).toFixed(1)}\n⚡️Speed: ${(rd.power.Speed* handleReaction.tpy).toFixed(1)}\n📌Skill: ${skillS.replace(/,\s*$/, "")}\n💰Coins: ${handleReaction.money}$\n☑️Đã thêm pokemon vào kho đồ của bạn!`, attachment: image}
            return api.sendMessage(msg, threadID, messageID);
        }
    }
}