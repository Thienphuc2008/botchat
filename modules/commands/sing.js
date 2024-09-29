const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const qs = require('qs');
this.config = {
 name: "sing",
 version: "1.2.9",
 hasPermssion: 0,
 credits: "?",// Thay credits làm chó
 description: "Nghe nhạc từ nền tảng YouTube",
 commandCategory: "Tiện ích",
 usages: "sing + keyword",
 cooldowns: 5,
 images: [],
};
async function search(keyWord) {
  try {
     const res = await axios.get(`https://www.youtube.com/results?search_query=${encodeURIComponent(keyWord)}`);
     const getJson = JSON.parse(res.data.split("ytInitialData = ")[1].split(";</script>")[0]);
     const videos = getJson.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents[0].itemSectionRenderer.contents;
     const results = [];
     for (const video of videos)
	 if (video.videoRenderer?.lengthText?.simpleText)
	     results.push({
		  id: video.videoRenderer.videoId,
	          title: video.videoRenderer.title.runs[0].text,
		  thumbnail: video.videoRenderer.thumbnail.thumbnails.pop().url,
		  time: video.videoRenderer.lengthText.simpleText,
		  channel: {
		       id: video.videoRenderer.ownerText.runs[0].navigationEndpoint.browseEndpoint.browseId,
		       name: video.videoRenderer.ownerText.runs[0].text,
		       thumbnail: video.videoRenderer.channelThumbnailSupportedRenderers.channelThumbnailWithLinkRenderer.thumbnail.thumbnails.pop().url.replace(/s[0-9]+\-c/g, '-c')
		    }
	      });
	return results;
     } catch (e) {
	const error = new Error("Cannot search video");
	error.code = "SEARCH_VIDEO_ERROR";
	throw error;
    }
}
async function getData(id) {
  function getRandomUserAgent() {
     const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera'];
     const osList = ['Windows NT 10.0; Win64; x64', 'Macintosh; Intel Mac OS X 10_15_7', 'X11; Linux x86_64'];
     const webKitVersion = `537.${Math.floor(Math.random() * 100)}`;
     const browserVersion = `${Math.floor(Math.random() * 100)}.0.${Math.floor(Math.random() * 10000)}.${Math.floor(Math.random() * 100)}`;
     const browser = browsers[Math.floor(Math.random() * browsers.length)];
     const os = osList[Math.floor(Math.random() * osList.length)];
     return `Mozilla/5.0 (${os}) AppleWebKit/${webKitVersion} (KHTML, like Gecko) ${browser}/${browserVersion} Safari/${webKitVersion}`;
  }
  function getRandomValue() {
     return Math.floor(Math.random() * 10000000000);
  }
  function getRandomCookie() {
     const ga = `_ga=GA1.1.${getRandomValue()}.${getRandomValue()}`;
     const gaPSRPB96YVC = `_ga_PSRPB96YVC=GS1.1.${getRandomValue()}.2.1.${getRandomValue()}.0.0.0`;
     return `${ga}; ${gaPSRPB96YVC}`;
  }
  const userAgent = getRandomUserAgent();
  const cookies = getRandomCookie();
  async function getDa(url) {
    try {
      const { data } = await axios.post("https://www.y2mate.com/mates/vi862/analyzeV2/ajax",
        qs.stringify({
          k_query: `https://www.youtube.com/watch?v=${id}`,
          k_page: "mp3",
          hl: "vi",
          q_auto: "0",
        }),
        {
          headers: {
            Accept: "*/*",
            "Accept-Encoding": "gzip, deflate, br, zstd",
            "Accept-Language": "vi,en;q=0.9",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            Cookie: cookies,
            Origin: "https://www.y2mate.com",
            Priority: "u=1, i",
            Referer: "https://www.y2mate.com/vi/",
            "Sec-Ch-Ua": '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
            "Sec-Ch-Ua-Mobile": "?0",
            "Sec-Ch-Ua-Platform": '"Windows"',
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "User-Agent": cookies,
            "X-Requested-With": "XMLHttpRequest",
          },
        },
      );
      return {
        id: data.vid,
        title: data.title,
        duration: data.t,
        author: data.a,
        k: data.links["mp3"]["mp3128"]["k"],
      };
    } catch (error) {
      console.error("Error:", error);
    }
  }
  let dataPost = await getDa(id);
  try {
    const response = await axios.post("https://www.y2mate.com/mates/convertV2/index",
      qs.stringify({
        vid: dataPost.id,
        k: dataPost.k,
      }),
      {
        headers: {
          Accept: "*/*",
          "Accept-Encoding": "gzip, deflate, br, zstd",
          "Accept-Language": "vi,en;q=0.9",
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          Cookie: cookies,
          Origin: "https://www.y2mate.com",
          Priority: "u=1, i",
          Referer: "https://www.y2mate.com/vi/",
          "Sec-Ch-Ua": '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
          "Sec-Ch-Ua-Mobile": "?0",
          "Sec-Ch-Ua-Platform": '"Windows"',
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-origin",
          "User-Agent": userAgent,
          "X-Requested-With": "XMLHttpRequest",
        },
      },
    );
    return {
      id: dataPost.id,
      title: dataPost.title,
      duration: dataPost.duration,
      author: dataPost.author,
      url: response.data.dlink,
    };
  } catch (error) {
    console.error("Error:", error);
  }
}
async function getStreamAndSize(url, path = "") {
	const response = await axios({
		method: "GET",
		url,
		responseType: "stream",
		headers: {
			'Range': 'bytes=0-'
		}
	});
	if (path)
		response.data.path = path;
	const totalLength = response.headers["content-length"];
	return {
		stream: response.data,
		size: totalLength
	};
}
const MAX_SIZE = 27262976;
this.run = async function ({ args, event, api }) {
    const send = (msg, callback) => api.sendMessage(msg, event.threadID, callback, event.messageID);
    if (args.length === 0 || !args) {
        return send("❎ Phần tìm kiếm không được để trống!");
    }
    const keywordSearch = args.join(" ");
    const path = `${__dirname}/cache/${event.senderID}.mp3`;
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }
    try {
        let keyWord = keywordSearch.includes("?feature=share") ? keywordSearch.replace("?feature=share", "") : keywordSearch;
        const maxResults = 6;
        let result = await search(keyWord);
        result = result.slice(0, maxResults);
        if (result.length === 0) {
            return send(`❎ Không có kết quả tìm kiếm nào phù hợp với từ khóa ${keyWord}`);
        }
        let msgg = "";
        let i = 1;
        const arrayID = [];
        for (const info of result) {
            arrayID.push(info.id);
            msgg += `${i++}. ${info.title}\nTime: ${info.time}\nChannel: ${info.channel.name}\n\n`;
        }
       send({ body: `${msgg}⩺ Reply tin nhắn với số để chọn hoặc nội dung bất kì để gỡ` }, (err, info) => {
          if (err) {
             return send(`❎ Đã xảy ra lỗi: ${err.message}`);
          }
          global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: event.senderID,
                arrayID,
                result,
                path
             });
         });
      } catch (err) {
        send(`❎ Đã xảy ra lỗi: ${err.message}`);
    }
};
this.handleReply = async function ({ api, event, handleReply: _ }) {
    const send = (msg, callback) => api.sendMessage(msg, event.threadID, callback, event.messageID);
    try {
        const startTime = Date.now();
        let data = _.result[event.body - 1];
        send(`⬇️ Đang tải xuống âm thanh \"${data.title}\"`, async (erro, infom) => {
        let { title, id, url, timestart } = await getData(data.id);
        const savePath = _.path || `${__dirname}/cache/${event.senderID}.mp3`;               
        const getStream = await getStreamAndSize(url, `${id}.mp3`);
        if (getStream.size > MAX_SIZE) {
            api.unsendMessage(infom.messageID);
            return send(`❎ Không tìm thấy audio nào có dung lượng nhỏ hơn 26MB`);
        }     
        const writeStream = fs.createWriteStream(savePath);
        getStream.stream.pipe(writeStream);
        const contentLength = getStream.size;
        let downloaded = 0;
        let count = 0;
        api.unsendMessage(_.messageID);
        getStream.stream.on("data", (chunk) => {
            downloaded += chunk.length;
            count++;
            if (count == 5) {
                const endTime = Date.now();
                const speed = downloaded / (endTime - startTime) * 1000;
                const timeLeft = (contentLength / downloaded * (endTime - startTime)) / 1000;
                const percent = downloaded / contentLength * 100;
             }
        });
        writeStream.on("finish", () => {
            send({
                body: `🎬 Tiêu đề: ${title}\n👤 Tên kênh: ${data.channel.name}\n⏱️ Thời lượng: ${data.time}\n⏳ Tốc độ xử lý: ${Math.floor((Date.now() - startTime) / 1000)} giây`,
                attachment: fs.createReadStream(savePath)
            }, async (err) => {
                if (err)
                    return send(`❎ Đã xảy ra lỗi: ${err.message}`);
                fs.unlinkSync(savePath);
               });
           });
            api.unsendMessage(infom.messageID);
       });
    } catch (error) {
        send(`❎ Đã xảy ra lỗi: ${error.message}`);
    }
};