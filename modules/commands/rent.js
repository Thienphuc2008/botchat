const moment = require('moment-timezone');
const crypto = require('crypto');
const fs = require('fs');

module.exports.config = {
    name: 'rent',
    version: '1.3.8',
    hasPermssion: 3,
    credits: 'DC-Nam & DongDev source lại & Vdang mod key',
    description: 'thuê bot',
    commandCategory: 'Admin',
    usages: '[]',
    cooldowns: 5,
    usePrefix: false,
};

const dataPath = __dirname + '/cache/data/thuebot.json';
const keysPath = __dirname + '/cache/data/keys.json';
let data = [];
let keys = {};

if (!fs.existsSync(__dirname + '/cache/data')) fs.mkdirSync(__dirname + '/cache/data');
if (fs.existsSync(dataPath)) data = JSON.parse(fs.readFileSync(dataPath));
if (fs.existsSync(keysPath)) keys = JSON.parse(fs.readFileSync(keysPath));

const saveData = () => fs.writeFileSync(dataPath, JSON.stringify(data));
const saveKeys = () => fs.writeFileSync(keysPath, JSON.stringify(keys));

const form_mm_dd_yyyy = (input = '', split = input.split('/')) => `${split[1]}/${split[0]}/${split[2]}`;
const invalid_date = date => /^Invalid Date$/.test(new Date(date));

exports.run = function (o) {
    const send = (msg, callback) => o.api.sendMessage(msg, o.event.threadID, callback, o.event.messageID);
    if (!["100069864945865"].includes(o.event.senderID)) return send(`⚠️ Chỉ Admin chính mới có thể sử dụng!`);

    switch (o.args[0]) {
        case 'add': {
            if (!o.args[1]) return send(`⚠️ Thêm người thuê bot vào dữ liệu:\n - rent add + ngày hết hạn\n - rent add + id người thuê + ngày hết hạn\n - rent add id nhóm + id người thuê + ngày hết hạn\n⚠️ Lưu ý: định dạng ngày là DD/MM/YYY`);
            let userId = o.event.senderID;
            if (o.event.type === "message_reply") {
                userId = o.event.messageReply.senderID;
            } else if (Object.keys(o.event.mentions).length > 0) {
                userId = Object.keys(o.event.mentions)[0];
            }
            let t_id = o.event.threadID;
            let id = userId;
            let time_start = moment.tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY');
            let time_end = o.args[1];
            if (o.args.length === 4 && !isNaN(o.args[1]) && !isNaN(o.args[2]) && o.args[3].match(/\d{1,2}\/\d{1,2}\/\d{4}/)) {
                t_id = o.args[1];
                id = o.args[2];
                time_start = moment.tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY');
                time_end = o.args[3];
            } else if (o.args.length === 3 && !isNaN(o.args[1]) && o.args[2].match(/\d{1,2}\/\d{1,2}\/d{4}/)) {
                t_id = o.event.threadID;
                id = o.args[1];
                time_start = moment.tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY');
                time_end = o.args[2];
            }
            if (isNaN(id) || isNaN(t_id)) return send(`⚠️ ID Không Hợp Lệ!`);
            if (invalid_date(form_mm_dd_yyyy(time_start)) || invalid_date(form_mm_dd_yyyy(time_end))) return send(`⚠️ Thời Gian Không Hợp Lệ!`);
            data.push({
                t_id,
                id,
                time_start,
                time_end,
            });
            send(`☑️ Đã thêm người thuê bot vào danh sách!`);
            break;
        }
        case 'list': {
            const userList = data.map(($, i) => `┏━━━━━━━━━━━━━━━━━━━┓\n┣➤ ${i + 1}. 👤 Người thuê: ${global.data.userName.get($.id)}\n┣➤ 📝 Tình trạng: ${new Date(form_mm_dd_yyyy($.time_end)).getTime() >= Date.now() + 25200000 ? 'Chưa Hết Hạn ✅' : 'Đã Hết Hạn ❎'}\n┣➤ 🔰 Nhóm: ${(global.data.threadInfo.get($.t_id) || {}).threadName}`).join('\n┗━━━━━━━━━━━━━━━━━━━┛\n');
            const keyList = Object.entries(keys).map(([key, value], i) => `${i + 1}. Key: ${key}, Hạn dùng: ${value}`).join('\n');
            send(`🔑 Danh sách thuê bot:\n${userList}\n\n🔑 Danh sách key:\n${keyList}`);
            break;
        }
        case 'newkey': {
            if (!o.args[1]) return send(`⚠️ Vui lòng cung cấp ngày hết hạn. Định dạng: DD/MM/YYYY`);
            let time_end = o.args[1];
            if (invalid_date(form_mm_dd_yyyy(time_end))) return send(`⚠️ Thời Gian Không Hợp Lệ!`);
            let key = 'VLjnh_' + crypto.randomBytes(3).toString('hex');
            keys[key] = time_end;
            saveKeys();
            send(`☑️ Đã tạo key: ${key} \n Ngày hết hạn: ${time_end}`);
            break;
        }
        case 'use': {
            if (!o.args[1]) return send(`⚠️ Vui lòng cung cấp key.`);
            let key = o.args[1];
            let keyInfo = keys[key];
            if (!keyInfo) return send(`⚠️ Key không hợp lệ hoặc đã hết hạn.`);
            if (keyInfo.threadID) return send(`⚠️ Key đã được sử dụng trong nhóm ${keyInfo.threadID}`);

            let currentDate = moment.tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY');
            if (moment(currentDate, 'DD/MM/YYYY').isAfter(moment(keyInfo, 'DD/MM/YYYY'))) return send(`⚠️ Key đã hết hạn.`);

            let t_id = o.event.threadID;
            let id = o.event.senderID;

            data.push({
                t_id,
                id,
                time_start: currentDate,
                time_end: keyInfo,
            });

            delete keys[key];
            saveData();
            saveKeys();

            send(`☑️ Key hợp lệ! Bạn đã được thêm vào danh sách thuê bot, ngày hết hạn: ${keyInfo}`);
            break;
        }
        case 'deletekey': {
            if (!o.args[1]) return send(`⚠️ Vui lòng cung cấp key cần xóa.`);
            let key = o.args[1];
            if (!keys[key]) return send(`⚠️ Key không tồn tại.`);
            delete keys[key];
            saveKeys();
            send(`☑️ Key ${key} đã được xóa.`);
            break;
        }
        default:
            send(`Dùng: ${global.config.PREFIX}rent add → Để thêm nhóm vào danh sách thuê bot\nDùng: ${global.config.PREFIX}rent list → Để xem danh sách thuê bot và key\nDùng: ${global.config.PREFIX}rent newkey <ngày hết hạn> → Để tạo key thuê bot\nDùng: ${global.config.PREFIX}rent use <key> → Để sử dụng key\nDùng: ${global.config.PREFIX}rent deletekey <key> → Để xóa key\n𝗛𝗗𝗦𝗗 → ${global.config.PREFIX}rent lệnh cần dùng.`);
    }
    saveData();
};

exports.handleReply = async function (o) {
    let _ = o.handleReply;
    const send = (msg, callback) => o.api.sendMessage(msg, o.event.threadID, callback, o.event.messageID);
    if (o.event.senderID != _.event.senderID) return;
    if (isFinite(o.event.args[0])) {
        let info = data[o.event.args[0] - 1];
        if (!info) return send(`❎ STT không tồn tại!`);
        return send(`[ THÔNG TIN NGƯỜI THUÊ BOT ]\n────────────────────\n👤 Người thuê: ${global.data.userName.get(info.id)}\n🌐 Link Facebook: https://www.facebook.com/profile.php?id=${info.id}\n👥 Nhóm: ${(global.data.threadInfo.get(info.t_id) || {}).threadName}\n🔰 TID: ${info.t_id}\n────────────────────\n📆 Ngày Thuê: ${info.time_start}\n──────\n⏳ Ngày hết Hạn: ${info.time_end}\n────────────────────\n⏰ ${(() => {
            let time_diff = new Date(form_mm_dd_yyyy(info.time_end)).getTime() - (Date.now() + 25200000);
            let days = (time_diff / (1000 * 60 * 60 * 24)) << 0;
            let hour = ((time_diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) << 0;
            if (time_diff <= 0) {
                return "Đã hết thời hạn thuê 🔐";
            } else {
                return `Còn ${days} ngày ${hour} giờ là hết hạn thuê`;
            }
        })()}`);
    } else if (o.event.args[0].toLowerCase() == 'del') {
        o.event.args.slice(1).sort((a, b) => b - a).forEach($ => data.splice($ - 1, 1));
        send(`☑️ Đã xóa thành công!`);
    } else if (o.event.args[0].toLowerCase() == 'giahan') {
        let STT = o.event.args[1];
        let time_start = moment.tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY');
        let time_end = o.event.args[2];
        if (invalid_date(form_mm_dd_yyyy(time_start)) || invalid_date(form_mm_dd_yyyy(time_end))) return send(`❎ Thời Gian Không Hợp Lệ!`);
        if (!data[STT - 1]) return send(`❎ STT không tồn tại`);
        let $ = data[STT - 1];
        $.time_start = time_start;
        $.time_end = time_end;
        send(`☑️ Đã gia hạn nhóm thành công!`);
    } else if (o.event.args[0].toLowerCase() == 'out') {
        for (let i of o.event.args.slice(1)) await o.api.removeUserFromGroup(o.api.getCurrentUserID(), data[i - 1].t_id);
        send(`⚠️ Đã out nhóm theo yêu cầu`);
    };
    saveData();
};

exports.handleEvent = async function (o) {
    const send = (msg, callback) => o.api.sendMessage(msg, o.threadID, callback, o.messageID);
    if (o.body && o.body.startsWith('VLjnh_')) {
        let key = o.body.trim();
        if (!keys[key]) return send(`❎ Key không hợp lệ hoặc đã hết hạn.`);
        let time_end = keys[key];
        let time_start = moment.tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY');
        let t_id = o.threadID;
        let id = o.senderID;

        data.push({
            t_id,
            id,
            time_start,
            time_end,
        });

        delete keys[key];
        saveData();
        saveKeys();

        send(`☑️ Key hợp lệ! Bạn đã được thêm vào danh sách thuê bot, ngày hết hạn: ${time_end}`);
    }
};
