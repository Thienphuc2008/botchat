module.exports = function ({ api, models }) {
  setInterval(function () {
    if(global.config.NOTIFICATION) {
      require("./handle/handleNotification.js")({ api });
    }
  }, 1000*60);
    const fs = require("fs");
    const Users = require("./controllers/users")({ models, api }),
          Threads = require("./controllers/threads")({ models, api }),
          Currencies = require("./controllers/currencies")({ models });
    const logger = require("../utils/log.js");
    const moment = require('moment-timezone');
    const axios = require("axios");
    const autoReset = require("./datasqlite/autoReset.js"); autoReset();
    var day = moment.tz("Asia/Ho_Chi_Minh").day();
(async function () {
    try {
      logger(global.getText('listen', 'startLoadEnvironment'), 'DATA');
      let threads = await Threads.getAll(),
        users = await Users.getAll(['userID', 'name', 'data']),
        currencies = await Currencies.getAll(['userID']);
      for (const data of threads) {
        const idThread = String(data.threadID);
        global.data.allThreadID.push(idThread),
          global.data.threadData.set(idThread, data['data'] || {}),
          global.data.threadInfo.set(idThread, data.threadInfo || {});
        if (data['data'] && data['data']['banned'] == !![])
          global.data.threadBanned.set(idThread,
            {
              'reason': data['data']['reason'] || '',
              'dateAdded': data['data']['dateAdded'] || ''
            });
        if (data['data'] && data['data']['commandBanned'] && data['data']['commandBanned']['length'] != 0)
          global['data']['commandBanned']['set'](idThread, data['data']['commandBanned']);
        if (data['data'] && data['data']['NSFW']) global['data']['threadAllowNSFW']['push'](idThread);
      }
      logger.loader(global.getText('listen', 'loadedEnvironmentThread'));
      for (const dataU of users) {
        const idUsers = String(dataU['userID']);
        global.data['allUserID']['push'](idUsers);
        if (dataU.name && dataU.name['length'] != 0) global.data.userName['set'](idUsers, dataU.name);
        if (dataU.data && dataU.data.banned == 1) global.data['userBanned']['set'](idUsers, {
          'reason': dataU['data']['reason'] || '',
          'dateAdded': dataU['data']['dateAdded'] || ''
        });
        if (dataU['data'] && dataU.data['commandBanned'] && dataU['data']['commandBanned']['length'] != 0)
          global['data']['commandBanned']['set'](idUsers, dataU['data']['commandBanned']);
      }
        for (const dataC of currencies) global.data.allCurrenciesID.push(String(dataC['userID']));
    } catch (error) {
        return logger.loader(global.getText('listen', 'failLoadEnvironment', error), 'error');
    }
}());

  const admin = config.ADMINBOT;
  logger.loader("┏━━━━━━━━━━━━━━━━━━━━━━━━━━┓")
  for(let i = 0; i <= admin.length -1; i++){
    dem = i + 1
    logger.loader(` ID ADMIN ${dem}: ${(!admin[i]) ? "Trống" : admin[i]}`);
  }
  logger.loader(` ID BOT: ${api.getCurrentUserID()}`)
  logger.loader(` PREFIX: ${global.config.PREFIX}`)
  logger.loader(` NAME BOT: ${(!global.config.BOTNAME) ? "This bot was made by VLjnh" : global.config.BOTNAME}`)
  logger.loader("┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛")

  
  //////////////////////////////////////////////////////////////////
  const { exec } = require('child_process');
  exec('rm -fr modules/commands/cache/*.m4a');
  exec('rm -fr modules/commands/cache/*.mp4 ');
  exec('rm -fr modules/commands/cache/*.png');
  exec('rm -fr modules/commands/cache/*.jpg');
  exec('rm -fr modules/commands/cache/*.gif');
  exec('rm -fr modules/commands/cache/*.mp3');
  logger.loader("『✅』»Đã Dọ Cache")
  ///////////////////////////////////////////////
  //========= Require all handle need =========//
  //////////////////////////////////////////////

  const handleCommand = require("./handle/handleCommand")({ api, models, Users, Threads, Currencies });
  const handleCommandEvent = require("./handle/handleCommandEvent")({ api, models, Users, Threads, Currencies });
  const handleReply = require("./handle/handleReply")({ api, models, Users, Threads, Currencies });
  const handleReaction = require("./handle/handleReaction")({ api, models, Users, Threads, Currencies });
  const handleEvent = require("./handle/handleEvent")({ api, models, Users, Threads, Currencies });
  const handleRefresh = require("./handle/handleRefresh")({ api, models, Users, Threads, Currencies });
  const handleCreateDatabase = require("./handle/handleCreateDatabase")({  api, Threads, Users, Currencies, models });
//logger hiện console
logger.loader(`Ping load toàn bộ commands và events • ${Date.now() - global.client.timeStart}ms •`);

  return async (event) => {
      const {
      threadID,
      author,
      image,
      type,
      logMessageType,
      logMessageBody,
      logMessageData,
    } = event;
    var data_anti = JSON.parse(fs.readFileSync(global.anti, "utf8"));
    if (type == "change_thread_image") {
      const { ADMINBOT } = global.config;
      const botID = api.getCurrentUserID();
      var threadInf = await api.getThreadInfo(threadID);
      const findAd = threadInf.adminIDs.find((el) => el.id === author);
      const findAnti = data_anti.boximage.find(
        (item) => item.threadID === threadID
      );
      if (findAnti) {
        if (findAd || botID.includes(author)) {
          api.sendMessage(
            `» [ CẬP NHẬT NHÓM ] ${event.snippet}`,
            event.threadID
          );
          var options = {
            method: "POST",
            url: "https://api.imgur.com/3/image",
            headers: {
              Authorization: "Client-ID fc9369e9aea767c",
            },
            data: {
              image: image.url,
            },
          };
          const res = await axios(options);

          var data = res.data.data;
          var img = data.link;
          findAnti.url = img;
          const jsonData = JSON.stringify(data_anti, null, 4);
          return fs.writeFileSync(global.anti, jsonData);
        } else {
          const res = await axios.get(findAnti.url, { responseType: "stream" });
          api.sendMessage(`Bạn không có quyền đổi ảnh nhóm`, threadID);
          return api.changeGroupImage(res.data, threadID);
        }
      }
    }
    if (logMessageType === "log:thread-name") {
      const botID = api.getCurrentUserID();
      var threadInf = await api.getThreadInfo(threadID);
      const findAd = threadInf.adminIDs.find((el) => el.id === author);
      const findAnti = data_anti.boxname.find(
        (item) => item.threadID === threadID
      );
      if (findAnti) {
        if (findAd || botID.includes(author)) {
          api.sendMessage(
            `» [ CẬP NHẬT NHÓM ] ${logMessageBody}`,
            event.threadID
          );

          findAnti.name = logMessageData.name;
          const jsonData = JSON.stringify(data_anti, null, 4);
          return fs.writeFileSync(global.anti, jsonData);
        } else {
          api.sendMessage(`Bạn không có quyền đổi tên nhóm`, threadID);
          return api.setTitle(findAnti.name, threadID);
        }
      }
    }
    if (logMessageType === "log:user-nickname") {
      const botID = api.getCurrentUserID();
      var threadInf = await api.getThreadInfo(threadID);
      const findAd = threadInf.adminIDs.find((el) => el.id === author);
      const findAnti = data_anti.antiNickname.find(
        (item) => item.threadID === threadID
      );
      if (findAnti) {
        if (findAd || botID.includes(author)) {
          api.sendMessage(
            `» [ CẬP NHẬT NHÓM ] ${logMessageBody}`,
            event.threadID
          );

          findAnti.data[logMessageData.participant_id] =
            logMessageData.nickname;
          const jsonData = JSON.stringify(data_anti, null, 4);
          return fs.writeFileSync(global.anti, jsonData);
        } else {
          api.sendMessage(`Bạn không có quyền đổi tên người dùng`, threadID);
          return api.changeNickname(
            findAnti.data[logMessageData.participant_id] || "",
            threadID,
            logMessageData.participant_id
          );
        }
      }
    }
    if (logMessageType === "log:unsubscribe") {
      const botID = api.getCurrentUserID();
      var threadInf = await api.getThreadInfo(threadID);
      const findAd = threadInf.adminIDs.find((el) => el.id === author);
      const findAnti = data_anti.antiout[threadID] ? true : false;
      if (findAnti) {
        const typeOut =
          author == logMessageData.leftParticipantFbId ? "out" : "kick";
        if (typeOut == "out") {
          api.addUserToGroup(
            logMessageData.leftParticipantFbId,
            threadID,
            (error, info) => {
              if (error) {
                api.sendMessage(
                  `❎ Thêm người dùng trở lại thất bại!\nhttps://www.facebook.com/profile.php?id=${logMessageData.leftParticipantFbId}\n[ MODE ] → Đang kích hoạt chế độ cấm thoát nhóm!`,
                  threadID
                );
              } else
                api.sendMessage(
                  `✅ Đã thêm người dùng trở lại thành công!\nhttps://www.facebook.com/profile.php?id=${logMessageData.leftParticipantFbId}\n[ MODE ] → Đang kích hoạt chế độ cấm thoát nhóm!`,
                  threadID
                );
            }
          );
        }
      }
    }


    
    let form_mm_dd_yyyy = (input = '', split = input.split('/'))=>`${split[1]}/${split[0]}/${split[2]}`;
    let prefix = (global.data.threadData.get(event.threadID) || {}).PREFIX||global.config.PREFIX;
    let send = (msg, callback)=>api.sendMessage(msg, event.threadID, callback, event.messageID);
    if ((event.body||'').startsWith(prefix) && event.senderID != api.getCurrentUserID() && !global.config.ADMINBOT.includes(event.senderID)) {
    let thuebot;
    try { thuebot = JSON.parse(require('fs').readFileSync(process.cwd()+'/modules/commands/cache/data/thuebot.json')); } catch { thuebot = []; };
    let find_thuebot = thuebot.find($=>$.t_id == event.threadID);
    if (!find_thuebot)return  api.shareContact(`\n📞 Liên hệ với Admin để duyệt bot`, global.config.CONTACT[0], event.threadID); 
    if (new Date(form_mm_dd_yyyy(find_thuebot.time_end)).getTime() <= Date.now()+25200000)return api.shareContact(`📞 Liên hệ với Admin để gia hạn`, global.config.NDH[0], event.threadID);
    };
const checkttDataPath = __dirname + '/../modules/commands/cache/checktt/';
  setInterval(async() => {
    const day_now = moment.tz("Asia/Ho_Chi_Minh").day();
    if (day != day_now) {
      day = day_now;
      const checkttData = fs.readdirSync(checkttDataPath);
      console.log('--> CHECKTT: Ngày Mới');
      checkttData.forEach(async(checkttFile) => {
        const checktt = JSON.parse(fs.readFileSync(checkttDataPath + checkttFile));
        let storage = [], count = 1;
        for (const item of checktt.day) {
            const userName = await Users.getNameUser(item.id) || 'Facebook User';
            const itemToPush = item;
            itemToPush.name = userName;
            storage.push(itemToPush);
        };
        storage.sort((a, b) => {
            if (a.count > b.count) {
                return -1;
            }
            else if (a.count < b.count) {
                return 1;
            } else {
                return a.name.localeCompare(b.name);
            }
        });
        let checkttBody = '==『 TOP TƯơNG TÁC NGÀY 』==\n\n';
        checkttBody += storage.slice(0, 10).map(item => {
           return `${count++}. ${item.name} (${item.count})`;
                    }).join('\n');
        api.sendMessage(checkttBody, checkttFile.replace('.json', ''), (err) => err ? console.log(err) : '');
 
        checktt.day.forEach(e => {
            e.count = 0;
        });
        checktt.time = day_now;
 
        fs.writeFileSync(checkttDataPath + checkttFile, JSON.stringify(checktt, null, 4));
      });
      if (day_now == 1) {
        console.log('--> CHECKTT: Tuần Mới');
        checkttData.forEach(async(checkttFile) => {
          const checktt = JSON.parse(fs.readFileSync(checkttDataPath + checkttFile));
          let storage = [], count = 1;
          for (const item of checktt.week) {
              const userName = await Users.getNameUser(item.id) || 'Facebook User';
              const itemToPush = item;
              itemToPush.name = userName;
              storage.push(itemToPush);
          };
          storage.sort((a, b) => {
              if (a.count > b.count) {
                  return -1;
              }
              else if (a.count < b.count) {
                  return 1;
              } else {
                  return a.name.localeCompare(b.name);
              }
          });
          let checkttBody = '==『 TOP TƯơNG TÁC TUẦN 』==\n\n';
          checkttBody += storage.slice(0, 15).map(item => {
            return `${count++}. ${item.name} (${item.count})`;
        }).join('\n');
          api.sendMessage(checkttBody, checkttFile.replace('.json', ''), (err) => err ? console.log(err) : '');
          checktt.week.forEach(e => {
              e.count = 0;
          });
 
          fs.writeFileSync(checkttDataPath + checkttFile, JSON.stringify(checktt, null, 4));
        })
      }
      global.client.sending_top = false;
    }
  }, 1000 * 10);


    if (event.type === "change_thread_image") api.sendMessage(`${event.snippet}`, event.threadID);
     switch (event.type) {
       case "message":
       case "message_reply":
       case "message_unsend":
         handleCreateDatabase({ event });
         handleCommand({ event });
         handleReply({ event });
         handleCommandEvent({ event });
         break;
         case "event":
           handleEvent({ event });
           handleRefresh({ event });
           if(global.config.notiGroup) {
             var msg = '[ CẬP NHẬT NHÓM ]\n'
             msg += event.logMessageBody
             if(event.author == api.getCurrentUserID()) {
               msg = msg.replace('Bạn', global.config.BOTNAME)
             }
             return api.sendMessage({
         body: `${msg}`}, event.threadID);
           }
           break;
      case "message_reaction":
        var { iconUnsend } = global.config
        if(iconUnsend.status && event.senderID == api.getCurrentUserID() && event.reaction == iconUnsend.icon) {
          api.unsendMessage(event.messageID)
        }
        handleReaction({ event });
        break;
      default:
        break;
    }
  };
};