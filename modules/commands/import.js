module.exports.config = {
  name: "import",
  version: "1.1.1",
  hasPermssion: 0,
  credits: "DC-Nam",
  description: " :))",
  commandCategory: "Hệ Thống",
  usages: "tên file + number + keys + link api",
  cooldowns: 0
};

/* start (0) khai báo mô-đun */
const axios = require("axios");
const folder = __dirname + "/cache/import/";
const fse = require("fs-extra");
/* end (0) */

module.exports.run = async ({ api, event, args }) => {
const { threadID: t, messageID: m, senderID: s } = event;
    var array = [], namefile = args[0], leng = args[1], keys = args[2], countS = 0, countE = 0, linkapi = args.splice(3).join("");
  /* start (0) check permssion */
  if (!["100069864945865"].includes(s)) return api.sendMessage("?", t, m);
  /* end (0) */
  /* start (1) check, read, tạo folder, file */
  if (!fse.existsSync(folder)) {
    fse.mkdirSync(folder, { recursive: true });
  };
  if (!fse.existsSync(`${folder}${namefile}.json`)) {
    fse.writeFileSync(`${folder}${namefile}.json`, "[]");
  };
  let data = JSON.parse(fse.readFileSync(`${folder}${namefile}.json`), "utf-8");
  /* end (1) */
  return api.sendMessage(`» Đang xử lý file ${namefile} vui lòng đợi...`, t, () => {
    var promise = new Promise(async (rs, rj) => {
      /* start (2) xử lý api */
      for (var i = 0; i < leng; i++) {
        let es = (await axios.get(linkapi)).data;
        if (!data.includes(es[keys])) {
          ++countS
          data.push(es[keys])
          fse.writeFileSync(`${folder}${namefile}.json`, JSON.stringify(data, null, 4), "utf-8");
        } else ++countE
      };
      rs(`====『 𝗜𝗠𝗣𝗢𝗥𝗧 』====\n━━━━━━━━━━━━━━━━\n\n→ 𝗕𝗼𝘁 𝘃𝘂̛̀𝗮 𝗶𝗺𝗽𝗼𝗿𝘁 𝘅𝗼𝗻𝗴 \n❤️ 𝗩𝘂̛̀𝗮 𝗮𝗱𝗱 đ𝘂̛𝗼̛̣𝗰: ${countS}\n💜 𝗟𝗮̣̆𝗽: ${countE}\n💙 𝗧𝗼̂̉𝗻𝗴: ${data.length}\n\n→ 𝗥𝗲𝗮𝗰𝘁𝗶𝗼𝗻 đ𝗲̂̉ 𝘀𝗲𝗻𝗱 𝗳𝗶𝗹𝗲 𝘃𝘂̛̀𝗮 𝘁𝗮̣𝗼`);
      rj();
      /* end (2) */
      /* start (3) gửi kết quả, add obj handle reaction */
      promise.then(async (rs) => api.sendMessage(rs, t, (e, i) => {
        return global.client.handleReaction.push({
          name: this.config.name,
          messageID: i.messageID,
          author: s,
          path: `${folder}${namefile}.json`,
          namefile
        });
      }, m)).catch(async (err) => api.sendMessage(err, t, m));
    });
    /* end (3) */
  });
};
module.exports.handleReaction = async ({ api, event, handleReaction: h }) => {
  const { threadID: tid, messageID: mid, senderID: sid, userID, reaction } = event;
  /* start (0) check permssion */
  if (userID != h.author) return;
  /* end (0) */
  /* start (1) gửi file vừa nhập khi nhận được lệnh reaction */
  switch (reaction) {
    case "😆": {
  api.sendMessage(`[ 𝗜𝗠𝗣𝗢𝗥𝗧 ] → 𝗖𝗵𝗲𝗰𝗸 𝘁𝗶𝗻 𝗻𝗵𝗮̆́𝗻 đ𝗶 `, tid, () => api.sendMessage({
    body: `『 𝗜𝗠𝗣𝗢𝗥𝗧 』\n→  𝗙𝗶𝗹𝗲 𝗰𝘂̉𝗮 𝗮𝗻𝗵 𝗰𝗵𝘂̉ 𝗮̂𝘆: ${h.namefile} `,
    attachment: fse.createReadStream(h.path)
  }, h.author));
  /* end (1) */
      break;
     };
    case "😆": {
      api.sendMessage(`===『 𝗜𝗠𝗣𝗢𝗥𝗧 𝗨𝗣𝗟𝗢𝗔𝗗 』===
\n→ 𝗧𝗶𝗲̂́𝗻 𝗵𝗮̀𝗻𝗵 𝘂𝗽𝗹𝗼𝗮𝗱 𝗹𝗲̂𝗻 𝗔𝗣𝗜`, tid, (e, i) => {
       const fromapi = "https://api.phungtuanhai.online/uploads";
      let readdata = JSON.parse(fse.readFileSync(h.path));
      var promise = new Promise(async(rs, rj) => {
      let res = (await axios.get(encodeURI(`${fromapi}import/add?data=${readdata.join(",")}&file=${h.namefile}`))).data;
        rs(`===『 𝗜𝗠𝗣𝗢𝗥𝗧  𝗦𝗨𝗖𝗖𝗘𝗦𝗦𝗙𝗨𝗟 』===
\n\n→ 𝗛𝗼𝗮̀𝗻𝗴 𝘁𝗮̂́𝘁 𝘂𝗽𝗹𝗼𝗮𝗱:\n💜 𝗔𝗱𝗱: ${res.result.successful}\n💙 𝗟𝗮̣̆𝗽: ${res.result.failure}\n❤️ 𝗧𝗼̂̉𝗻𝗴: ${res.result.total}`);
        rj();
      });       
        promise.then(async(r) => api.sendMessage(r, tid, mid)).catch(async(err) => api.sendMessage(err, tid, mid));
          });
  break;
      };
   };
};