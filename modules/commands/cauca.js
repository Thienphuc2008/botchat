const path = require("path");
const axios = require("axios");
module.exports.config = {
    name: "cauca",
    version: "3.0.0",
    hasPermssion: 0,
    Rent: 2,
    credits: "Heo Rừng Remake + Mod",
    description: "Câu cá International",
    commandCategory: "Trò Chơi",
    usages: "[]",
    cooldowns: 0,
    envConfig: {
        APIKEY: ""
    }
};

module.exports.checkPath = function (type, senderID) {
    const pathItem = path.join(__dirname, 'FishingGlobal', `item.json`);
    const pathUser = path.join(__dirname, 'FishingGlobal', 'datauser', `${senderID}.json`);
    const pathUser_1 = require("./Trò_chơi/FishingGlobal/datauser/" + senderID + '.json');
    const pathItem_1 = require("./Trò_chơi/FishingGlobal/item.json");
    if (type == 1) return pathItem
    if (type == 2) return pathItem_1
    if (type == 3) return pathUser
    if (type == 4) return pathUser_1
}

module.exports.onLoad = async () => {
    const fs = require("fs-extra");
    const axios = require("axios");

    const dir = __dirname + `/Trò_chơi/FishingGlobal/`;
    const dirCache = __dirname + `/Trò_chơi/FishingGlobal/cache/`;
    const dirData = __dirname + `/Trò_chơi/FishingGlobal/datauser/`;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, {
        recursive: true
    });
    if (!fs.existsSync(dirData)) fs.mkdirSync(dirData, {
        recursive: true
    });
    if (!fs.existsSync(dirCache)) fs.mkdirSync(dirCache, {
        recursive: true
    });
    if (!fs.existsSync(dir + "data.json")) (await axios({
        url: "https://raw.githubusercontent.com/theguardian132/fishingGlobal/main/data.json",
        method: 'GET',
        responseType: 'stream'
    })).data.pipe(fs.createWriteStream(dir + "data.json"));

    if (!fs.existsSync(dir + "item.json")) (await axios({
        url: "https://raw.githubusercontent.com/theguardian132/fishingGlobal/main/item.json",
        method: 'GET',
        responseType: 'stream'
    })).data.pipe(fs.createWriteStream(dir + "item.json"));
    return;
}

module.exports.run = async function ({
    api,
    event,
    args,
    Users,
    Currencies
}) {
    const {
        threadID,
        messageID,
        senderID
    } = event;
    const {
        readFileSync,
        writeFileSync,
        existsSync,
        createReadStream,
        readdirSync
    } = require("fs-extra")
    const axios = require("axios")
    const pathData = path.join(__dirname, 'Trò_chơi', 'FishingGlobal', 'datauser', `${senderID}.json`);
    switch (args[0]) {
    case 'register':
    case '-r': {
        const nDate = new Date().toLocaleString('vi-VN', {
            timeZone: 'Asia/Ho_Chi_Minh'
        });
        if (!existsSync(pathData)) {
            var obj = {};
            obj.name = (await Users.getData(senderID)).name;
            obj.ID = senderID;
            obj.mainROD = null,
                obj.GPS = {};
            obj.GPS.locate = null,
                obj.GPS.area = null,
                obj.fishBag = [];
            obj.point = [];
            obj.item = [];
            obj.timeRegister = nDate
            obj.fishBag.push({
                ID: 0,
                name: 'Đừng bán con cá này ko là lỗi tao đéo chịu trách nhiệm đâu',
                category: 'Unnamed',
                size: 999999,
                sell: 0
            });
            obj.point.push({
                ID: 0,
                name: 'Đừng bán con cá này ko là lỗi tao đéo chịu trách nhiệm đâu',
                category: 'Unnamed',
                size: 999999,
                sell: 0
            });
            writeFileSync(pathData, JSON.stringify(obj, null, 4));
            var msg = {body: "===[FISHING]===\n⚔️Đ𝔞̆𝔫𝔤 𝔨𝔦́ 𝔠𝔞̂𝔲 𝔠𝔞́ 𝔱𝔥𝔞̀𝔫𝔥 𝔠𝔬̂𝔫𝔤⚔️\nIt's time to duel!!!", attachment: await this.subnautica()}
            return api.sendMessage(msg, threadID, messageID);
        } else return api.sendMessage({body: "===[FISHING]===\n⚔️Bạn đã có trong cơ sở dữ liệu⚔️", attachment: await this.subnautica()}, threadID, messageID);
    }
    case 'shop':
    case '-s': {
        if (!existsSync(pathData)) {
            return api.sendMessage({body: "===[FISHING]===\n⚔️Bạn chưa đăng kí tài khoản câu cá!", attachment: await this.subnautica()}, threadID, messageID);
        }
        return api.sendMessage({body: "=====[SHOP]=====\n-----------------------\n1. Mua cần câu\n2. Bán vật phẩm câu được\n3. Nâng cấp/Sửa chửa cần câu\n-----------------------\n<Reply tin nhắn này với lựa chọn của bạn>", attachment: await this.subnautica()}, threadID, (error, info) => {
            global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: event.senderID,
                type: "shop"
            })
        }, messageID);
    }
    case 'bag':
    case '-b': {
        if (!existsSync(pathData)) {
            return api.sendMessage({body: "===[FISHING]===\n⚔️Bạn chưa đăng kí tài khoản câu cá!\nNhập /subnautica register hoặc -r", attachment: await this.subnautica()}, threadID, messageID);
        }
        var data = this.checkPath(4, senderID)

        return api.sendMessage({body: `===[FISHING]===\n-----------------------\n1. Cá (SL: ${data.fishBag.length})\n2. Cần câu (SL: ${data.item.length})\nVui lòng reply vật phẩm cần xem!`, attachment: await this.subnautica()}, threadID, (error, info) => {
            global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: event.senderID,
                type: "choosebag"
            })
        }, messageID);
    }
    case 'custom':
    case '-c': {
        if (!existsSync(pathData)) {
            return api.sendMessage({body: "===[FISHING]===\n⚔️Bạn chưa đăng kí tài khoản câu cá!\nNhập /subnautica register hoặc -r", attachment: await this.subnautica()}, threadID, messageID);
        }
        if (args[1] == 'rod') {
            var data = this.checkPath(4, senderID)
            var listItem = '===[FISHING]===\n',
                number = 1;
            for (let i of data.item) {
                listItem += `➤${number++}: ${i.name} - Thời gian chờ: ${i.countdown}s - Độ bền: ${i.durability}\n`
            }
            listItem += 'Vui lòng reply để chọn cần vũ khí chính của bạn!'
            return api.sendMessage(listItem, threadID, (error, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    type: "rodMain",
                    data: data,
                    item: data.item
                })
            }, messageID);
        }
        if (args[1] == 'locate') {
            return api.sendMessage({body: "===[MAP]===\n1. Asia🌏\n2. Europe❄️\n-------------------\n>Reply kèm STT để chọn khu vực", attachment: await this.subnautica()}, threadID, (error, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    type: "location"
                })
            }, messageID); 
        }
    }
    case 'help': {
            return api.sendMessage({body: "==[FISHING]==\n-----------------\n- R: Đăng kí\n- CUSTOM: Lựa chọn khu vực câu cá\n- BAG: Xem túi đồ\n- SHOP: Cửa hàng\n\n=====D-Jukie=====", attachment: await this.subnautica()}, threadID, messageID);
        }
    case 'info': {
        var data = this.checkPath(4, senderID)
            return api.sendMessage({body: `==[Info User]==\n------------------\n- Name: ${data.name}\n- ID: ${data.ID}\n- Weapon: ${data.mainROD != null ? data.mainROD: "Đéo có"}\n- Storage: ${data.fishBag.length != null ? data.fishBag.length: "0"}/100\n- Location: ${data.GPS.locate != null ? data.GPS.locate: "Không"} - ${data.GPS.area != null ? data.GPS.area: "Không"}\n- Item: ${data.item.length}\n- Số cá đã câu được: ${data.point.length}\n- Time created: ${data.timeRegister} \n\n===D-Jukie - Heo Rừng===`, attachment: await this.subnautica()}, threadID, messageID);
        }
    case 'history': {
        var data = this.checkPath(4, senderID).point;
            if (data.length == 0) return api.sendMessage('No Information', threadID, messageID);
            var Common = data.filter(i => i.category == 'Common')
            var Uncommon = data.filter(i => i.category == 'Uncommon')
            var Rare = data.filter(i => i.category == 'Rare')
            var Epic = data.filter(i => i.category == 'Epic')
            var Legendary = data.filter(i => i.category == 'Legendary')
            return api.sendMessage({body:`Thành tích hiện tại:\n1. Common - ${Common.length}\n2. Uncommon - ${Uncommon.length}\n3. Rare - ${Rare.length}\n4. Epic - ${Epic.length}\n5. Legendary - ${Legendary.length}\nTổng số cá: ${data.length - 1}\nĐiểm Thành tựu: ${Common.length + 2 * Uncommon.length + 4 * Rare.length + 8 * Epic.length + 16 * Legendary.length}`, attachment: await this.subnautica()}, threadID, messageID);
    }
    case 'top': {
        if (!existsSync(pathData)) {
            return api.sendMessage({body: "Bạn chưa đăng kí tài khoản!\n Nhập /fishing register để đăng kí", attachment: await this.image('https://i.pinimg.com/originals/b6/f1/1f/b6f11fb474e1e6058489fb3c6357039a.gif')}, threadID, messageID);
        }
        const data = readdirSync(__dirname + `/FishingGlobal/datauser`);
        if(data.length < 3) return api.sendMessage(`Cần ít nhất có 3 người chơi trên server để xem top`, threadID, messageID);
        var p = []
        for (let i of data) { 
            var o = require(`./Trò_chơi/FishingGlobal/datauser/${i}`);
            p.push(o)
            msgf += `${number++}. ${o.name} - ${o.point} con\n`
        }
        p.sort((a, b) => b.point - a.point);
        var msg = '===TOP 3 NGƯỜI CHƠI CÂU NHIỀU CÁ NHẤT===\n'
        for(var i = 0; i < 3; i++) {
            msg += `${i+1}. ${p[i].name} với ${p[i].point} con\n`
        }
        return api.sendMessage(msg, threadID, messageID);
    }
    default: {
        async function checkTime(cooldown, dataTime) {
            if (cooldown - (Date.now() - dataTime) > 0) {

                var time = cooldown - (Date.now() - dataTime),
                    minutes = Math.floor(time / 60000),
                    seconds = ((time % 60000) / 1000).toFixed(0);
                return api.sendMessage(`⏰ Vui lòng mua cần câu xịn hơn để câu liên tiếp trong thời gian ngắn!\n⌚Chờ gian chờ còn lại: ${minutes}:${seconds}!`, threadID, messageID);
            }
        }
        if (!existsSync(pathData)) {
            return api.sendMessage({body: "----<(FISHING)>----\n⚔️Bạn chưa đăng kí tài khoản câu cá!\nNhập /fishing register hoặc -r", attachment: await this.subnautica()}, threadID, messageID);
        }
        var data = this.checkPath(4, senderID)
        if (data.item.length == 0) return api.sendMessage(`Bạn chưa có cần câu, vui lòng vào shop để mua!`, threadID, messageID);
        if (data.fishBag.length >= 40) return api.sendMessage(`Hiện đã đầy túi, mau bán bớt cá không nó nổ kho chết con mẹ mày giờ thằng ngu`, threadID, messageID);
        if (data.mainROD == null) return api.sendMessage('Bạn chưa chọn cần câu để câu cá!\nVui lòng nhập `custom rod` để chọn cần!', threadID, messageID);
        if (data.GPS.locate == null || data.GPS.area == null) return api.sendMessage('Bạn chưa chọn địa điểm để câu cá!\nVui lòng nhập `custom locate` để chọn địa điểm câu!', threadID, messageID);
        var rod = data.mainROD
        var location = data.GPS.locate
        var area = data.GPS.area
        var type = this.getFish()
        var findRod = data.item.find(i => i.name == rod)
        if (findRod.durability <= 0) return api.sendMessage('Cần câu đã hỏng, bạn cần sửa chữa hoặc chọn một thanh mới!', threadID, messageID);
        await checkTime(findRod.countdown * 1000, findRod.countdownData)
        findRod.countdownData = Date.now();
        findRod.durability = findRod.durability - 10;
        writeFileSync(this.checkPath(3, senderID), JSON.stringify(this.checkPath(4, senderID), null, 2));
        if (type == false) return api.sendMessage("Không trúng con nào", threadID, messageID);
        var fil = (await this.dataFish(location, area)).filter(i => i.category == type)
        if (fil.length == 0) return api.sendMessage('Không trúng con nào', threadID, messageID);
        var getData = fil[Math.floor(Math.random() * fil.length)];
        var IDF = ((this.checkPath(4, senderID)).fishBag)[parseInt(((this.checkPath(4, senderID)).fishBag).length - 1)].ID + 1;
        (this.checkPath(4, senderID)).fishBag.push({
            ID: IDF,
            name: getData.name,
            category: getData.category,
            size: getData.size,
            weight: getData.weight,
            sell: getData.sell,
            image: getData.image
        });
        (this.checkPath(4, senderID)).point.push({
            ID: IDF,
            name: getData.name,
            category: getData.category,
            size: getData.size,
            weight: getData.weight,
            sell: getData.sell,
            image: getData.image
        });
        writeFileSync(this.checkPath(3, senderID), JSON.stringify(this.checkPath(4, senderID), null, 2));
        var msg = {body: `|---<(RESULT)>---|\nChúc mừng bạn đã câu được\n-----------------------\n➤Tên: ${getData.name}\n➤Giá: ${getData.sell}$\n➤Độ hiếm: ${getData.category}\n➤Size: ${getData.size}cm\n➤Cân nặng: ${getData.weight / 1000}kg`, attachment: await this.image(getData.image)}
        return api.sendMessage(msg, threadID, messageID);
     }
    }
}

module.exports.dataFish =async function (a, b) {
    const data = require("./Trò_chơi/FishingGlobal/data.json");
    var loc = data.find(i => i.location == a)
    var are = loc.area.find(i => i.name == b)
    return are.creature
}

module.exports.image = async function(link) {
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];
    var images = [];
    let download = (await axios.get(link, { responseType: "arraybuffer" } )).data; 
        fs.writeFileSync( __dirname + `/Trò_chơi/FishingGlobal/cache/fish.png`, Buffer.from(download, "utf-8"));
        images.push(fs.createReadStream(__dirname + `/Trò_chơi/FishingGlobal/cache/fish.png`));
    return images
}
module.exports.subnautica = async function() {
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];
    var images = [];
    let download = (await axios.get('https://i.imgur.com/kVPNSzw.jpg', { responseType: "arraybuffer" } )).data; 
        fs.writeFileSync( __dirname + `/Trò_chơi/FishingGlobal/cache/fishpage.png`, Buffer.from(download, "utf-8"));
        images.push(fs.createReadStream(__dirname + `/Trò_chơi/FishingGlobal/cache/fishpage.png`));
    return images
}

module.exports.getFish = function () {
    var rate = Math.floor(Math.random() * 100) + 1
    if (rate <= 10) return false
    if (rate > 10 && rate <= 40) return 'Common';
    if (rate > 40 && rate <= 65) return 'Uncommon';
    if (rate > 65 && rate <= 85) return 'Rare';
    if (rate > 85 && rate <= 95) return 'Epic';
    if (rate > 95 && rate <= 100) return 'Legendary';

}
module.exports.handleReply = async function ({
    event,
    api,
    Currencies,
    handleReply,
    Users
}) {

    const {
        body,
        threadID,
        messageID,
        senderID
    } = event;
    const axios = require("axios")
    const {
        readFileSync,
        writeFileSync,
        existsSync,
        createReadStream,
        unlinkSync,
        writeFile
    } = require("fs-extra")
    const pathItem = this.checkPath(2, senderID);
    async function checkDur(a, b, c) {
        var data = require("./Trò_chơi/FishingGlobal/item.json");
        var find = data.find(i => i.name == a)
        if (c == 'rate') return (b / find.durability) * 100
        if (c == 'reset') return find.durability
        return `${b}/${find.durability} (${((b/find.durability)*100).toFixed(0)}%)`
    }
    switch (handleReply.type) {
    case 'shop': {
        if (body == 1) {
            api.unsendMessage(handleReply.messageID)
            var listItem = '===[𝖘𝖍𝖔𝖕]===\n',
                number = 1;
            for (let i of pathItem) {
                listItem += `Lv${number++}: ${i.name} (${i.price}$) - Thời gian chờ ${i.countdown} (Độ bền: ${i.durability})\n\n`
            }
            return api.sendMessage(listItem + 'Reply tin nhắn này để chọn cần vũ khí cho bạn. Mỗi lần câu trừ 10 độ bền!', threadID, (error, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,////// all
                    author: event.senderID,
                    type: "buyfishingrod"
                })
            }, messageID);
        }
        if (body == 2) {
            api.unsendMessage(handleReply.messageID)
            var data = this.checkPath(4, senderID).fishBag;
            if (data.length == 0) return api.sendMessage('Túi của bạn không có gì cả!', threadID, messageID);
            var Common = data.filter(i => i.category == 'Common')
            var Uncommon = data.filter(i => i.category == 'Uncommon')
            var Rare = data.filter(i => i.category == 'Rare')
            var Epic = data.filter(i => i.category == 'Epic')
            var Legendary = data.filter(i => i.category == 'Legendary')
            var listCategory = [Common, Uncommon, Rare, Epic, Legendary, Mythical, Spectral, Etherial, Unknown];
            return api.sendMessage(`Chọn loại cá muốn bán:\n1. Common - ${Common.length}\n2. Uncommon - ${Uncommon.length}\n3. Rare - ${Rare.length}\n4. Epic - ${Epic.length}\n5. Legendary - ${Legendary.length}`, threadID, (error, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    type: "chooseFish",
                    listCategory
                })
            }, messageID);
        }
        if (body == 3) {
            api.unsendMessage(handleReply.messageID)
            var data = this.checkPath(4, senderID).item;
            var msg = `===𝓕𝓘𝓧 𝓘𝓣𝓔𝓜===\n`,
                number = 1;
            for (let i of data) {
                msg += `${number++}. ${i.name} - Độ bền: ${await checkDur(i.name, i.durability, 0)}\n`
            }
            return api.sendMessage(msg + 'Vui lòng reply vật phẩm muốn sửa!, giá sửa bằng 75% giá vật phẩm', threadID, (error, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    type: "fixfishingrod",
                    list: data
                })
            }, messageID);
        } else return api.sendMessage('Lựa chọn không hợp lệ!', threadID, messageID);
    }
    case 'choosebag': {
        api.unsendMessage(handleReply.messageID)
        var data = this.checkPath(4, senderID)
        if (body == 1) {
            if (data.fishBag.length == 0) return api.sendMessage('Trong túi của bạn không có cái nịt', threadID, messageID);
            var listFish = `===𝓲𝓷𝓿𝓮𝓷𝓽𝓸𝓻𝔂===\n`,
                number = 1;
            for (let i of data.fishBag) {
                listFish += `${number++}. ${i.name} (${i.size}cm) - ${i.category} (${i.sell}$)\n`
            }
            return api.sendMessage(listFish, threadID, messageID);
        }
        if (body == 2) {
            api.unsendMessage(handleReply.messageID)
            if (data.item.length == 0) return api.sendMessage('Trong túi của bạn không có vật phẩm nào!', threadID, messageID);
            var listItemm = `===𝓲𝓷𝓿𝓮𝓷𝓽𝓸𝓻𝔂===\n`,
                number = 1;
            for (let i of data.item) {
                listItemm += `${number++}. ${i.name} (${i.price}$) - Độ bền: ${i.durability} (${i.countdown}s)\n`
            }
            return api.sendMessage(listItemm, threadID, messageID);
        } else return api.sendMessage('Lựa chọn không hợp lệ!', threadID, messageID);
    }
    case 'rodMain': {
        var data = handleReply.data;
        var item = handleReply.item;
        if (parseInt(body) > item.length || parseInt(body) <= 0) return api.sendMessage('Lựa chọn không hợp lệ!', threadID, messageID);
        api.unsendMessage(handleReply.messageID)
        data.mainROD = item[parseInt(body) - 1].name
        writeFileSync(this.checkPath(3, senderID), JSON.stringify(data, null, 2));
        return api.sendMessage(`===FISHING ROD===\nTrang bị ${item[parseInt(body) - 1].name} thành công!`, threadID, messageID);
    }
    case 'location': {
        const data = require("./Trò_chơi/FishingGlobal/data.json");
        if (body < 1 && body > 3) return api.sendMessage("Lựa chọn không hợp lệ!", threadID, messageID);
        api.unsendMessage(handleReply.messageID)
        var listLoca = '==[ŁØĆΔŦƗØŇ]==\n',
            number = 1;
        for (let i of data[parseInt(body) - 1].area) {
            listLoca += `${number++}. ${i.name}\n`
        };
        (this.checkPath(4, senderID)).GPS.locate = data[parseInt(body) - 1].location
        writeFileSync(this.checkPath(3, senderID), JSON.stringify(this.checkPath(4, senderID), null, 2));
        if(body == 1) var images = 'https://i.imgur.com/iXzjkhs.png'
        if(body == 2) var images = 'https://i.imgur.com/jv8OZmW.png'
        return api.sendMessage({body: listLoca + 'Vui lòng chọn vùng bạn muốn câu!', attachment: await this.image(images)}, threadID, (error, info) => {
            global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: event.senderID,
                type: "chooseArea",
                area: data[parseInt(body) - 1]
            })
        }, messageID);
    }
    case 'chooseArea': {
        var area = handleReply.area;
        var pathh = this.checkPath(4, senderID)
        var pathhh = this.checkPath(3, senderID)
        if (parseInt(body) > area.area.length || parseInt(body) <= 0) return api.sendMessage('Lựa chọn không hợp lệ!', threadID, messageID);
        api.unsendMessage(handleReply.messageID)
        pathh.GPS.area = area.area[parseInt(body) - 1].name
        writeFileSync(pathhh, JSON.stringify(pathh, null, 2));
        return api.sendMessage(`==[WORLD MAP]==\nChuyển tới vùng '${area.location} - ${area.area[parseInt(body) - 1].name}' thành công`, threadID, messageID);
    }
    case 'fixfishingrod': {
        if (parseInt(body) > handleReply.list.length || parseInt(body) <= 0) return api.sendMessage('Lựa chọn không hợp lệ!', threadID, messageID);
        var rod = handleReply.list[parseInt(body) - 1]
        if (await checkDur(rod.name, rod.durability, 'rate') > 75) return api.sendMessage('Chỉ sửa được phóng lợn à nhầm phóng lao có độ bền dưới 75%', threadID, messageID);
        api.unsendMessage(handleReply.messageID)
        await checkMoney(senderID, parseInt((rod.price * (3 / 4)).toFixed(0)))
        await Currencies.decreaseMoney(senderID, parseInt((rod.price * (3 / 4)).toFixed(0)));
        rod.durability = await checkDur(rod.name, rod.durability, 'reset')
        writeFileSync(this.checkPath(3, senderID), JSON.stringify(this.checkPath(4, senderID), null, 2));
        return api.sendMessage(`===FIXING===\n- Sửa thành công ${rod.name} (${parseInt((rod.price*(3/4)).toFixed(0))}$)`, threadID, messageID);
    }
    case 'buyfishingrod': {
        if (parseInt(body) > pathItem.length || parseInt(body) <= 0) return api.sendMessage('Lựa chọn không hợp lệ!', threadID, messageID);
        var data = pathItem[parseInt(body) - 1]
        var checkM = await checkMoney(senderID, data.price);
        if ((this.checkPath(4, senderID)).item.some(i => i.name == data.name)) return api.sendMessage('Bạn đã sở hữu vật phẩm này rồi!', threadID, messageID);
        (this.checkPath(4, senderID)).item.push({
            name: data.name,
            price: data.price,
            durability: data.durability,
            countdown: data.countdown,
            countdownData: null,
            image: data.image
        })
        writeFileSync(this.checkPath(3, senderID), JSON.stringify(this.checkPath(4, senderID), null, 2));
        api.unsendMessage(handleReply.messageID)
        var msg = { body: `Mua thành công ${data.name}\nGiá mua: ${data.price}$\nĐộ bền: ${data.durability}\nCooldown: ${data.countdown}s`, attachment: await this.image(data.image)}
        return api.sendMessage(msg, threadID, messageID);
    }
    case 'chooseFish': {
        if (parseInt(body) > handleReply.listCategory.length || parseInt(body) <= 0) return api.sendMessage('Lựa chọn không hợp lệ!', threadID, messageID);
        api.unsendMessage(handleReply.messageID);
        if (handleReply.listCategory[parseInt(body) - 1].length == 0) return api.sendMessage('Không có con cá nào hết á, hmmm!', threadID, messageID);
        var fish = "=====ғιsн=====\n",
            number = 1;
        for (let i of handleReply.listCategory[parseInt(body) - 1]) {
            fish += `${number++}. ${i.name} (${i.size}cm) - Loại: ${i.category} - ${i.sell}$\n`
        }
        return api.sendMessage(fish + "Reply số thứ tự để bán (có thể rep nhiều số) all cái đầu buồi t fix r bug tiền cc", threadID, (error, info) => {
            global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: event.senderID,
                type: "sell",
                list: handleReply.listCategory[parseInt(body) - 1]
            })
        }, messageID);
    }
    case 'sell': {
        if ((parseInt(body) > handleReply.list.length || parseInt(body) <= 0) && body.toLowerCase() != 'bugcaiditconmemay') return api.sendMessage('Lựa chọn hong hợp lệ!', threadID, messageID);
        api.unsendMessage(handleReply.messageID)
        var bag = (this.checkPath(4, senderID)).fishBag
        var coins = 0;
        if (body.toLowerCase() == 'bugcaiditconmemay') {
            for (let i of handleReply.list) {
                await Currencies.increaseMoney(senderID, parseInt(i.sell));
                coins += parseInt(i.sell)
                console.log(i.ID)
                var index = (this.checkPath(4, senderID)).fishBag.findIndex(item => item.ID == i.ID);
                bag.splice(index, 1);
                writeFileSync(this.checkPath(3, senderID), JSON.stringify((this.checkPath(4, senderID)), null, 2));
            }
            return api.sendMessage(`Bán thành công ${handleReply.list.length} con cá và thu về được ${coins}$`, threadID, messageID);
        }
        else {
            var msg = 'Code_By_D-Jukie ' + body
            var chooses = msg.split(" ").map(n => parseInt(n));
            chooses.shift();
            var text = `=====SELL=====\n`,
                number = 1;
            for (let i of chooses) {
                const index = (this.checkPath(4, senderID)).fishBag.findIndex(item => item.ID == handleReply.list[i - 1].ID);
                text += `${number++}. ${bag[index].name} +${bag[index].sell}$\n`
                coins += parseInt(bag[index].sell)
                await Currencies.increaseMoney(senderID, parseInt(bag[index].sell));
                bag.splice(index, 1);
                writeFileSync(this.checkPath(3, senderID), JSON.stringify((this.checkPath(4, senderID)), null, 2));
            }
            return api.sendMessage(text + `\nThu về được ${coins}$`, threadID, messageID);
        }
    }
    default: {
        api.unsendMessage(handleReply.messageID)
        return api.sendMessage('Lựa chọn không hợp lệ!', threadID, messageID);
    }
    }
    async function checkMoney(senderID, maxMoney) {
        var i, w;
        i = (await Currencies.getData(senderID)) || {};
        w = i.money || 0
        if (w < parseInt(maxMoney)) return api.sendMessage('Bạn không đủ tiền để thực hiện giao dịch này!', threadID, messageID);
    }
}