const moment = require('moment-timezone');

const axios = require('axios');

module.exports.config = {

 name: 'autott',

 version: '10.02',

 hasPermssion: 3,

 credits: 'DongDev',

 description: 'Tự động gửi tin nhắn theo giờ đã cài!',

 commandCategory: 'Hệ Thống',

 usages: '[]',

 cooldowns: 3,

 images: [],

};

const weather = require('weather-js');

const findWeather = (city, degreeType = 'C') => {

 return new Promise((resolve, reject) => {

 weather.find({ search: city, degreeType }, (err, result) => {

 if (err) {

 reject(err);

 } else {

 resolve(result);

 }

 });

 });

};

const nam = [

 {

 timer: '10:00:00',

 message: ['\n{thoitiet}']

 },

 {

 timer: '06:00:00',

 message: ['\n{thoitiet}']

 },
 {

 timer: '13:00:00',

 message: ['\n{thoitiet}']

 },
  {

 timer: '17:00:00',

 message: ['\n{thoitiet}']

 }
];

module.exports.onLoad = o => setInterval(async () => {

 const r = a => a[Math.floor(Math.random() * a.length)];

 const currentTime = moment().tz('Asia/Ho_Chi_Minh').format('HH:mm:ss');

 if (á = nam.find(i => i.timer === currentTime)) {

 const gio = moment().tz('Asia/Ho_Chi_Minh').format('HH:mm:ss || DD/MM/YYYY');

var msg = r(á.message);

var tinh = [

"Quảng Bình"

];

const city = tinh[Math.floor(Math.random() * tinh.length)];

 const result = await findWeather(city);

 var currentDay = result[0].current.day.replace(/Friday/g, "Thứ 6").replace(/Saturday/g, "Thứ 7").replace(/Sunday/g, "Chủ nhật").replace(/Monday/g, "Thứ 2").replace(/Tuesday/g, "Thứ 3").replace(/Wednesday/g, "Thứ 4").replace(/Thursday/g, "Thứ 5");

 var date = result[0].current.date;

 var dateFormat = `Ngày ${date.split("-")[2]}-${date.split("-")[1]}-${date.split("-")[0]}`;

 var skytext = result[0].current.skytext.toString()

 "Cloudy" == skytext ? skytext = "Mây" : "Sunny" == skytext ? skytext = "Nắng" : "Mostly Sunny" == skytext ? skytext = "Nắng Gắt" : "Partly Cloudy" == skytext ? skytext = "Mây Ít" : "Mostly Cloudy" == skytext ? skytext = "Nhiều Mây" : "Rain" == skytext ? skytext = "Mưa" : "Thunderstorm" == skytext ? skytext = "Bão" : "Snow" == skytext ? skytext = "Tuyết" : "Fog" == skytext || "Haze" == skytext ? skytext = "Sương Mù" : "Clear" == skytext ? skytext = "Trời Trong" : "Light Rain" == skytext ? skytext = "Mưa Nhẹ" : "Mostly Clear" == skytext && (skytext = "Trời Rất Trong");

 var winddisplay = result[0].current.winddisplay.toString().split(" ")[2];

 "Northeast" == winddisplay && (winddisplay = "Hướng Đông Bắc"), "Northwest" == winddisplay && (winddisplay = "Hướng Tây Bắc"), "Southeast" == winddisplay && (winddisplay = "Hướng Đông Nam"), "Southwest" == winddisplay && (winddisplay = "Hướng Tây Nam"), "East" == winddisplay && (winddisplay = "Hướng Đông"), "West" == winddisplay && (winddisplay = "Hướng Tây"), "North" == winddisplay && (winddisplay = "Hướng Bắc"), "South" == winddisplay && (winddisplay = "Hướng Nam");

 var thoitiet = `(~~[ ${gio} ]~~)\n──────────────────\n[🗺️] →⁠ Cập nhật thời tiết tại: ${result[0].location.name}\n[🌡] →⁠ Nhiệt độ: ${result[0].current.temperature}°${result[0].location.degreetype}\n[✏️] →⁠ Mô tả: ${skytext}\n[♒] →⁠ Độ ẩm: ${result[0].current.humidity}%\n[💨] →⁠ Hướng gió: ${result[0].current.windspeed} ${winddisplay}\n[⏰] →⁠ Ghi nhận vào: ${result[0].current.observationtime}\n[🗺️] →⁠ Từ trạm ${result[0].current.observationpoint}\n────────────────────\n🔄 Đây Là Tin Nhắn Tự Động`;

 

 msg = msg.replace(/{thoitiet}/, thoitiet);

 msg = {

 body: msg,

 };

 global.data.allThreadID.forEach(i => o.api.sendMessage(msg, i));

 }

}, 1000);

module.exports.run = () => {};