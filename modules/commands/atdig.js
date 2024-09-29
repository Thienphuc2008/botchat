const axios = require('axios');
const qs = require('qs');
const cheerio = require('cheerio');
async function main(url) {
  try {
    const response = await axios.post('https://igdownloader.app/api/ajaxSearch', qs.stringify({
      recaptchaToken: '',
      q: url,
      t: 'media',
      lang: 'vi'
    }), {
      headers: {
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Accept-Language': 'vi,en;q=0.9',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Origin': 'https://igdownloader.app',
        'Referer': 'https://igdownloader.app/',
        'Sec-Ch-Ua': '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
      }
    });
    const $ = cheerio.load(response.data.data);
    const attachments = [];
    $('ul.download-box li').each((index, element) => {
        const isImage = $(element).find('.icon-dlimage').length > 0;
        const isVideo = $(element).find('.icon-dlvideo').length > 0;
        if (isImage) {
            const imageSrc = $(element).find('.download-items__btn a').attr('href');
            attachments.push({
                type: "Photo",
                url: imageSrc
            });
        } else if (isVideo) {
            const videoSrc = $(element).find('.download-items__btn a').attr('href');
            attachments.push({
                type: "Video",
                url: videoSrc
            });
        }
    });
    return attachments;
  } catch (error) {
    console.error(error);
  }
}
this.config = {
    name: 'atdig',
    version: '1.1.1',
    hasPermssion: 3,
    credits: 'DongDev', // Thay credits làm chó 🐶
    description: 'Tự động tải xuống khi phát hiện liên kết instagram',
    commandCategory: 'AUTO',
    usages: '[]',
    cooldowns: 2
};
function urlify(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/gi;
  const matches = text.match(urlRegex);
  return matches || []; 
}
this.handleEvent = async function({ api, event }) {    
    if (event.senderID == (global.botID || api.getCurrentUserID())) return;
    let streamURL = (url, ext = 'jpg') => require('axios').get(url,{responseType: 'stream'}).then(res => (res.data.path = `tmp.${ext}`, res.data)).catch(e => null);
    const send = (msg, callback) => api.sendMessage(msg, event.threadID, callback, event.messageID);
    const head = app => `[ AUTODOWN - ${app} ]\n────────────────`;
    const urls = urlify(event.body);
    for (const str of urls) {
        if (/instagram|ig\.com\//.test(str)) {
          const res = await main(str);
          let attachment = [];        
    if (res && res.length > 0) {
            for (const at of res) {
                if (at.type === 'Video') {
                    attachment.push(await streamURL(at.url, 'mp4'));
                } else if (at.type === 'Photo') {
                    attachment.push(await streamURL(at.url, 'jpg'));
                 }
             }
          }
        send({body: `${head('INSTAGRAM')}`, attachment});
      }
   }
};
this.run=async()=>{};