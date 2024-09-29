let urls = require('./../../SystemData/datajson/vdgai.json');

const axios = require("axios");
const fs = require("fs");
class Command {
 constructor(config) {
 this.config = config;
 this.queues = [];
 };
 async onLoad(o) {
 let status = false;
 if (!global.client.xx) global.client.xx = setInterval(_=> {
if (status == true || this.queues.length > 300) return;
 status = true;
Promise.all([...Array(5)].map(e=>upload(urls[Math.floor(Math.random()*urls.length)]))).then(res=>(this.queues.push(...res), status = false));
},1000*5);
async function streamURL(url, type) {
 return axios.get(url, {
 responseType: 'arraybuffer'
 }).then(res => {
 const path = __dirname + `/cache/${Date.now()}.${type}`;
 fs.writeFileSync(path, res.data);
 setTimeout(p => fs.unlinkSync(p), 1000 * 60, path);
 return fs.createReadStream(path);
 });
 }
//const botStatus = getStatusByPing(ping);
async function upload(url) {
 return o.api.postFormData('https://upload.facebook.com/ajax/mercury/upload.php',{upload_1024: await streamURL(url, 'mp4')}).then(res => Object.entries(JSON.parse(res.body.replace('for (;;);', '')).payload?.metadata?.[0] || {})[0]);
 };
 };
async run(o) {
let send = msg=>new Promise(r=>o.api.sendMessage(msg, o.event.threadID, (err, res)=>r(res || err), o.event.messageID)), t = process.uptime(),h = Math.floor(t / (60 * 60)), p = Math.floor((t % (60 * 60)) / 60), s = Math.floor(t % 60);
send({body: `┏━━━━━━━━━━━━━━━━━━━━┓\n┣➤ Chưa Nhập Tên Lệnh\n┣➤Uptime:${h}:${p}:${s}\n┣➤Tổng: ${urls.length-2}\n┣➤Số video khả dụng: ${this.queues.length}\n┗━━━━━━━━━━━━━━━━━━━━┛\n\n`,attachment: this.queues.splice(0, 1)})
 }
}
module.exports = new Command({
 name: " ",
 version: "0.0.1",
 hasPermssion: 0,
 credits: "DC-Nam",
 description: "",
 commandCategory: "Tiện Ích",
 usages: "[]",
 cooldowns: 0,
});