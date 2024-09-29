const moment = require("moment");

module.exports.config = {
  name: "console",
  version: "1.1.0",
  hasPermission: 3,
  credits: "Niiozic",
  description: "Làm cho console đẹp hơn + mod chống spam lag console",
  commandCategory: "Hệ Thống",
  usages: "console",
  cooldowns: 30
};

var isConsoleDisabled = false,
  logCount = 0,
  maxLogs = 20,
  timeStamp = 0;

function disableConsole(cooldowns) {
  console.log(`Kích hoạt chế độ chống lag console trong ${cooldowns}s`);
  isConsoleDisabled = true;
  setTimeout(function () {
    isConsoleDisabled = false;
    console.log("Tắt chế độ chống lag ✅");
  }, cooldowns * 1000);
}

module.exports.handleEvent = async function ({
  api,
  args,
  Users,
  event
}) {
  let {
    messageID,
    threadID,
    senderID,
    mentions
  } = event;

  try {
    const dateNow = Date.now();

    if (isConsoleDisabled) {
      return;
    }

    const chalk = require("chalk");
    const momentTz = require("moment-timezone");
    var formattedTime = momentTz.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss - DD/MM/YYYY");

    const threadData = global.data.threadData.get(event.threadID) || {};
    if (typeof threadData.console !== "undefined" && threadData.console == true) {
      return;
    }

    if (event.senderID == global.data.botID) {
      return;
    }

    logCount++;
    const threadInfo = await api.getThreadInfo(event.threadID);
    var threadName = threadInfo.threadName || "Nonmae";
    var userName = await Users.getNameUser(event.senderID);
    var content = event.body || "Ảnh, video hoặc kí tự đặc biệt";

    console.log(`${chalk.hex("#FF66FF")("┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓")}
${chalk.hex("#DEADED")(`┣➤ Tên nhóm: ${threadName}`)}
${chalk.hex("#9966FF")(`┣➤ ID nhóm: ${event.threadID}`)}
${chalk.hex("#C0FFEE")(`┣➤ Tên người dùng: ${userName}`)} 
${chalk.hex("#3366FF")(`┣➤ ID người dùng: ${event.senderID}`)}
${chalk.hex("#FFC0CB")(`┣➤ Nội dung: ${content}`)}
${chalk.hex("#FFFF00")(`┣➤ Thời gian: ${formattedTime}`)}
${chalk.hex("#0000FF")("┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛")}`);

    timeStamp = dateNow;

    if (Date.now() - timeStamp > 1000) {
      if (logCount <= maxLogs) logCount = 0;
    }

    if (Date.now() - timeStamp < 1000) {
      if (logCount >= maxLogs) {
        logCount = 0;
        disableConsole(this.config.cooldowns);
      }
    }

  } catch (error) {
    console.log(error);
  }
};

module.exports.run = async function ({
  api,
  args,
  Users,
  event,
  Threads,
  utils,
  client
}) {};