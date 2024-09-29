module.exports.config = {
    name: "pin",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "D-Jukie",
    description: "Tìm kiếm hình ảnh",
    commandCategory: "Tiện Ích",
    usages: "[Text]",
    cooldowns: 0,
};
module.exports.onLoad = () => {
    const fs = require("fs-extra");
    const request = require("request");
    const dirMaterial = __dirname + `/noprefix/`;
    if (!fs.existsSync(dirMaterial + "noprefix")) fs.mkdirSync(dirMaterial, { recursive: true });
    if (!fs.existsSync(dirMaterial + "tpk.jpeg")) request("https://i.imgur.com/r1DtySa.jpeg").pipe(fs.createWriteStream(dirMaterial + "tpk.jpeg"));
}
module.exports.run = async function({ api, event, args }) {
    const axios = require("axios");
    const fs = require("fs-extra");
    const request = require("request");
    const keySearch = args.join(" ");
    if(keySearch.includes("-") == false) return api.sendMessage({body: '==== 「 𝗣𝗜𝗡𝗧𝗘𝗥𝗘𝗦𝗧 」====\n\n→ 𝗩𝘂𝗶 𝗹𝗼̀𝗻𝗴 𝗻𝗵𝗮̣̂𝗽 𝘁𝗵𝗲𝗼 đ𝗶̣𝗻𝗵 𝗱𝗮̣𝗻𝗴: 𝘁𝘂̛̀ 𝗸𝗵𝗼́𝗮 𝗰𝗮̂̀𝗻 𝘁𝗶̀𝗺 𝗸𝗶𝗲̂́𝗺 - 𝘀𝗼̂́ 𝗮̉𝗻𝗵 𝗰𝗮̂̀𝗻 𝘁𝗶̀𝗺 💓\n→ 𝗩𝗗: 𝗽𝗶𝗻 𝗱𝗼𝗿𝗮𝗲𝗺𝗼𝗻 -  𝟭𝟬 𝗯𝗼𝘁 𝘀𝗲̃ 𝘁𝗶̀𝗺 𝟭𝟬 𝗮̉𝗻𝗵 𝗱𝗼𝗿𝗮𝗲𝗺𝗼𝗻 💝', attachment: fs.createReadStream(__dirname + `/noprefix/tpk.jpeg`)}, event.threadID, event.messageID)
    const keySearchs = keySearch.substr(0, keySearch.indexOf('-'))
    const numberSearch = keySearch.split("-").pop() || 6
    const res = await axios.get(`https://apibot.dungkon.me/pinterest?search=${encodeURIComponent(keySearchs)}`);
    const data = res.data.data;
    var num = 0;
    var imgData = [];
    for (var i = 0; i < parseInt(numberSearch); i++) {
      let path = __dirname + `/cache/${num+=1}.jpg`;
      let getDown = (await axios.get(`${data[i]}`, { responseType: 'arraybuffer' })).data;
      fs.writeFileSync(path, Buffer.from(getDown, 'utf-8'));
      imgData.push(fs.createReadStream(__dirname + `/cache/${num}.jpg`));
    }
    api.sendMessage({
        attachment: imgData,
        body: `=== [ 𝗣𝗜𝗡𝗧𝗘𝗥𝗘𝗦𝗧 ] ====\n━━━━━━━━━━━━━━━━━━\n\n→ 𝗞𝗲̂́𝘁 𝗾𝘂𝗮̉ 𝘁𝗶̀𝗺 𝗸𝗶𝗲̂́𝗺 𝗰𝘂̉𝗮 𝘁𝘂̛̀ 𝗸𝗵𝗼́𝗮: ${keySearchs}\n→ 𝗧𝗼̂̉𝗻𝗴 𝘀𝗼̂́ 𝗮̉𝗻𝗵 𝘁𝗶̀𝗺 𝘁𝗵𝗮̀𝗻𝗵 𝗰𝗼̂𝗻𝗴: ${numberSearch} 𝗮̉𝗻𝗵 💗`
    }, event.threadID, event.messageID)
    for (let ii = 1; ii < parseInt(numberSearch); ii++) {
        fs.unlinkSync(__dirname + `/cache/${ii}.jpg`)
    }
};