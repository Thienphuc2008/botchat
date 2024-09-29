module.exports.config = {
    name: "3cay",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "",
    description: "Game 3 cây dành cho nhóm có đặt cược (có ảnh lá bài)",
    commandCategory: "Trò Chơi",
    usages: "[start/join/info/leave]",
    cooldowns: 1
};


const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
const suits = ["spades", "hearts", "diamonds", "clubs"];
const deck = [];

for (let i = 0 ; i < values.length; i++) {
  for (let x = 0; x < suits.length; x++) {
    let weight = parseInt(values[i]);
    if (["J", "Q", "K"].includes(values[i])) weight = 10;
    else if (values[i] == "A") weight = 11;
    const card = {
      Value: values[i],
      Suit: suits[x],
      Weight: weight,
      Icon: suits[x] == "spades" ? "♠️" : suits[x] == "hearts" ? "♥️" : suits[x] == "diamonds" ? "♦️" : "♣️"
        };
    deck.push(card);
  }
}

function createDeck() {
  // for 1000 turns
  // switch the values of two random cards
  const deckShuffel = [...deck];
  for (let i = 0; i < 1000; i++) {
    const location1 = Math.floor((Math.random() * deckShuffel.length));
    const location2 = Math.floor((Math.random() * deckShuffel.length));
    const tmp = deckShuffel[location1];
    deckShuffel[location1] = deckShuffel[location2];
    deckShuffel[location2] = tmp;
  }
  return deckShuffel;
}

function getLinkCard(Value, Suit) {
  return `https://raw.githubusercontent.com/ntkhang03/poker-cards/main/cards/${Value == "J" ? "jack" : Value == "Q" ? "queen" : Value == "K" ? "king" : Value == "A" ? "ace" : Value}_of_${Suit}.png`;
}

async function drawCard(cards) {
  // 500 x 726
  const Canvas = require("canvas");
    const canvas = Canvas.createCanvas(500*cards.length, 726);
  const ctx = canvas.getContext("2d");
  let x = 0;
  for (const card of cards) {
    const loadImgCard = await Canvas.loadImage(card);
    ctx.drawImage(loadImgCard, x, 0);
    x += 500;
  }
  return canvas.toBuffer();
}

module.exports.handleEvent = async ({ Currencies, event, api, Users }) => {
  const Canvas = require("canvas");
  const fs = require ("fs-extra");
  
    const { senderID, threadID, body, messageID } = event;
  
    if (typeof body == "undefined") return;
    if (!global.moduleData.baicao) global.moduleData.baicao = new Map();
    if (!global.moduleData.baicao.has(threadID)) return;
    var values = global.moduleData.baicao.get(threadID);
    if (values.start != 1) return;
  
    const deckShuffel = values.deckShuffel; // Bộ bài

    if (body.indexOf("Chia bài") == 0 || body.indexOf("chia bài")   == 0) {
        if (values.chiabai == 1) return;
        for (const key in values.player) {
            const card1 = deckShuffel.shift();
            const card2 = deckShuffel.shift();
            const card3 = deckShuffel.shift();
            var tong = (card1.Weight + card2.Weight + card3.Weight);
            if (tong >= 20) tong -= 20;
            if (tong >= 10) tong -= 10;
            values.player[key].card1 = card1;
            values.player[key].card2 = card2;
            values.player[key].card3 = card3;
            values.player[key].tong = tong;
            
            const linkCards = [];
            
            for (let i = 1; i < 4; i++) {
              const Card = values.player[key]["card" + i];
              linkCards.push(getLinkCard(Card.Value, Card.Suit));
            }
            
            const pathSave = __dirname + `/cache/card${values.player[key].id}.png`;
            fs.writeFileSync(pathSave, await drawCard(linkCards));
            
            api.sendMessage({
              body: `Bài Của Bạn: ${card1.Value}${card1.Icon} | ${card2.Value}${card2.Icon} | ${card3.Value}${card3.Icon} \n\nTổng Bài Của Bạn: ${tong}`,
              attachment: fs.createReadStream(pathSave)
            }, values.player[key].id, (error, info) => {
                if (error) return api.sendMessage(`Không Thể Chia Bài Cho Người Chơi: ${values.player[key].id}`, threadID);
                fs.unlinkSync(pathSave);
            });
                
        }
        values.chiabai = 1;
        global.moduleData.baicao.set(threadID, values);
        return api.sendMessage("Bài Đã Được Chia Đều Cho Mỗi Người! Tất Cả Có 2 Lượt Đổi Bài Nếu Chưa Thấy Bài Hãy Check Lại Tin Nhắn Chờ Or Spam", threadID);
    }

    if (body.indexOf("Đổi bài") == 0 || body.indexOf("đổi bài")   == 0) {
        if (values.chiabai != 1) return;
        var player = values.player.find(item => item.id == senderID);
        if (player.doibai == 0) return api.sendMessage("Bạn Đã Sử Dụng Hết Lượt Đổi Bài", threadID, messageID);
        if (player.ready == true) return api.sendMessage("Bạn Đã Sẵn Sàng, Bạn Không Thể Đổi Lại Bài!", threadID, messageID);
        const card = ["card1","card2","card3"];
        player[card[(Math.floor(Math.random() * card.length))]] = deckShuffel.shift();
        player.tong = (player.card1.Weight + player.card2.Weight + player.card3.Weight);
        if (player.tong >= 20) player.tong -= 20;
        if (player.tong >= 10) player.tong -= 10;
        player.doibai -= 1;
        global.moduleData.baicao.set(values);
        
        const linkCards = [];
            
        for (let i = 1; i < 4; i++) {
          const Card = player["card" + i];
          linkCards.push(getLinkCard(Card.Value, Card.Suit));
        }
        
      const pathSave = __dirname + `/cache/card${player.id}.png`;
        fs.writeFileSync(pathSave, await drawCard(linkCards));
      
        return api.sendMessage({
          body: `Bài Của Người Chơi Sau Khi Đổi: ${player.card1.Value}${player.card1.Icon} | ${player.card2.Value}${player.card2.Icon} | ${player.card3.Value}${player.card3.Icon}\n\nTổng bài của bạn: ${player.tong}`,
          attachment: fs.createReadStream(pathSave)
    }, player.id, (error, info) => {
            if (error) return api.sendMessage(`Không Thể Đổi Bài Cho Người Chơi: ${player.id}`, threadID);
            fs.unlinkSync(pathSave);
        });
    }

    if (body.indexOf("ready") == 0 || body.indexOf("Ready")   == 0) {
        if (values.chiabai != 1) return;
        var player = values.player.find(item => item.id == senderID);
        if (player.ready == true) return;
        const name = await Users.getNameUser(player.id);
        values.ready += 1;
        player.ready = true;
        if (values.player.length == values.ready) {
            const player = values.player;
            player.sort(function (a, b) { return b.tong - a.tong });

            var ranking = [], num = 1;

            for (const info of player) {
                const name = await Users.getNameUser(info.id);
                ranking.push(`${num++} • ${name} Với ${info.card1.Value}${info.card1.Icon} | ${info.card2.Value}${info.card2.Icon} | ${info.card3.Value}${info.card3.Icon} => ${info.tong} nút\n`);
            }
            
            try {
                await Currencies.increaseMoney(player[0].id, values.rateBet * player.length);
            } catch (e) {};
            global.moduleData.baicao.delete(threadID);
            
            return api.sendMessage(`Kết quả:\n\n ${ranking.join("\n")}\n\nRiêng Người Chơi Đứng Thứ Nhất Nhận Được Số Tiền Tương Ứng ${values.rateBet * player.length}$`, threadID);
        }
        else return api.sendMessage(`Người Chơi: ${name} Đã Sẵn Sàng Lật Bài, Còn Lại Người Chơi: ${values.player.length - values.ready} Chưa Lật Bài`, event.threadID);
    }
    
    if (body.indexOf("nonready") == 0 || body.indexOf("Nonready")   == 0) {
        const data = values.player.filter(item => item.ready == false);
        var msg = [];

        for (const info of data) {
            const name = global.data.userName.get(info.id) || await Users.getNameUser(info.id);
            msg.push(name);
        }
        if (msg.length != 0) return api.sendMessage("Những Người Chơi Chưa Sẵn Sàng Bao Gồm: " + msg.join(", "), threadID);
        else return;
    }
}

module.exports.run = async ({ api, event, args, Currencies }) => {
    var { senderID, threadID, messageID } = event;
 const { readdirSync, readFileSync, writeFileSync, existsSync, copySync, createWriteStream, createReadStream, fs } = require("fs-extra");
  const request = require("request")
    threadID = String(threadID);
    senderID = String(senderID);
    if (!existsSync(__dirname + '/cache/3cay.jpg')) {
        request('https://i.imgur.com/NHz7pke.jpg').pipe(createWriteStream(__dirname + '/cache/3cay.jpg'));
      }
    if (!global.moduleData.baicao) global.moduleData.baicao = new Map();
    var values = global.moduleData.baicao.get(threadID) || {};
  var data = await Currencies.getData(event.senderID);
  var money = data.money     
    if(!args[0]) {
var msg =  {body: `===== Bàn 3 Cây =====\nChào Mừng Bạn Đến Với Thiên Đường Cờ Bạc Tại Đây Bạn Có Thể Nhân Đôi Tài Sản Của Bạn!\nĐể Tham Gia Bạn Cần Nhập Các Lệnh Dưới Đây:\n»3cay create [ Số Tiền Cược ]\n»3cay start [ Bắt Đầu Bàn 3 Cây ]\n»3cay info [ Xem Thông Tin Bàn 3 Cây ]\n»3cay leave [ Để Rời Bàn 3 Cây ]\n»Chia Bài [ Để Chia Bài Cho Người Chơi Chỉ Có Chủ Bàn Mới Nhập Có Hiệu Lệnh ]\n»Đổi Bài [ Để Đổi Bài Mỗi Người Chơi Chỉ Có 2 Lượt Đổi Bài Tương Ứng ]\n»Ready [ Sẵn Sàng Mở Bài ]\n»Nonready [ Xem Những Người Chưa Sẵn Sàng ]`, attachment : [
      createReadStream(__dirname + "/cache/3cay.jpg")
    ]}
     return api.sendMessage(msg, threadID, messageID)    }
     switch (args[0]) {
        case "create":
        case "-c": {
            if (global.moduleData.baicao.has(threadID)) return api.sendMessage("Hiện Tại Nhóm Này Đang Có Bàn 3 Cây ", threadID, messageID);
            if (!args[1] || isNaN(args[1]) || parseInt(args[1]) <= 1) return api.sendMessage("Mức Đặt Cược Của Bạn Không Phải Là 1 Con Số Hoặc Bé Hơn 1$", threadID, messageID);
      if (money < args[1]) return api.sendMessage(`Bạn Không Đủ Tiền Để Tạo Bàn Này: ${args[1]}$`,event.threadID,event.messageID);
      await Currencies.decreaseMoney(event.senderID, Number(args[1]));
            global.moduleData.baicao.set(event.threadID, { "author": senderID, "start": 0, "chiabai": 0, "ready": 0, player: [ { "id": senderID, "card1": 0, "card2": 0, "card3": 0, "doibai": 2, "ready": false } ], rateBet: Number(args[1])});
            return api.sendMessage(`Bàn 3 Cây Với Số Tiền Cược ${args[1]}$ Đã Được Tạo Thành Công , Những Người Chơi Khác Có Thể Tham Gia Để Chơi Ván Bài Này\nNgười Tạo Không Cần Tham Gia Lại`, event.threadID, event.messageID);
        }
        
        case "join":
        case "-j": {
            if (!values) return api.sendMessage("Hiện Tại Chưa Có Bàn 3 Cây Nào Được Tạo", threadID, messageID);
            if (values.start == 1) return api.sendMessage("Hiện Tại Ván Bài Đã Được Bắt Đầu", threadID, messageID);
            if (money < values.rateBet) return api.sendMessage(`Bạn Không Đủ Tiền Để Tham Gia Ván Bài Này: ${values.rateBet}$`,event.threadID,event.messageID)
            if (values.player.find(item => item.id == senderID)) return api.sendMessage("Bạn Đã Tham Gia Vào Ván Bài Này !", threadID, messageID);
            values.player.push({ "id": senderID, "card1": 0, "card2": 0, "card3": 0, "tong": 0, "doibai": 2, "ready": false });
            await Currencies.decreaseMoney(event.senderID, values.rateBet);
            global.moduleData.baicao.set(threadID, values);
            return api.sendMessage("Bạn Đã Tham Gia Thành Công!", threadID, messageID);
        }

        case "leave":
        case "-l": {
            if (typeof values.player == "undefined") return api.sendMessage("Hiện Tại Chưa Có Bàn 3 Cây Nào Được Tạo", threadID, messageID);
            if (!values.player.some(item => item.id == senderID)) return api.sendMessage("Bạn Chưa Tham Gia Bàn 3 Cây Ở Nhóm Này!", threadID, messageID);
            if (values.start == 1) return api.sendMessage("Hiện Tại Bàn 3 Cây Đã Được Bắt Đầu", threadID, messageID);
            if (values.author == senderID) {
                global.moduleData.baicao.delete(threadID);
                api.sendMessage("Author Đã Rời Bàn Đồng Nghĩa Với Việc Bàn Bị Đóng!", threadID, messageID);
            }
            else {
                values.player.splice(values.player.findIndex(item => item.id === senderID), 1);
                api.sendMessage("Bạn Đã Rời Bàn Này!", threadID, messageID);
                global.moduleData.baicao.set(threadID, values);
            }
            return;
        }

        case "start":
        case "-s": {
            if (!values) return api.sendMessage("Hiện Tại Chưa Có Bàn 3 Cây Nào Được Tạo", threadID, messageID);
            if (values.author !== senderID) return api.sendMessage("Bạn Không Phải Author Nên Không Thể Bắt Đầu", threadID, messageID);
            if (values.player.length <= 1) return api.sendMessage("Hiện Tại Chưa Có Người Nào Tham Gia Bàn Này", threadID, messageID);
            if (values.start == 1) return api.sendMessage("Hiện Tại Bàn Đã Bắt Đầu Bởi Author", threadID, messageID);
            values.deckShuffel = createDeck(); // Bộ bài
            values.start = 1;
            return api.sendMessage("Bàn 3 Cây Đã Được Bắt Đầu", threadID, messageID);
        }

        case "info":
        case "-i": {
            if (typeof values.player == "undefined") return api.sendMessage("Hiện Tại Chưa Có Bàn 3 Cây Nào Được Tạo", threadID, messageID);
            return api.sendMessage(
                "====  Bàn 3 Cây ====" +
                "\n- Author Bàn: " + values.author +
                "\n- Tổng Số Người Chơi: " + values.player.length + " Người"
            , threadID, messageID);
        }

        default: {
            return global.utils.throwError(this.config.name, threadID, messageID);
        }
    }
}