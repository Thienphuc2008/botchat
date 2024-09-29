const axios = require("axios");
const moment = require("moment-timezone");

const linkapi = "https://apitntxtrick.onlitegix.com/downall";

module.exports = {
    config: {
        name: "atdxhslink",
        version: "1.0.0",
        hasPermssion: 0,
        credits: "tnt",
        description: "",
        commandCategory: "AUTO",
        usages: "",
        cooldowns: 5
    },

    run: ({ api, event, args }) => {
        // Command logic if any can be added here
    },
    
    handleEvent: async ({ api, event }) => {
        const { body, senderID } = event;

        if (!body || (!body.includes('http://xhslink. com/') && !body.includes('http://xhslink. com/')) || senderID === api.getCurrentUserID() || senderID === '') return;

          try {
            const response = await axios.get(`${linkapi}?link=${body}`);
            const { author, medias } = response.data;

if (medias && medias.length > 0) {
                const attachments = [];
                for (const media of medias) {
                    try {
                        const mediaUrl = media.url;
                        
                        const mediaResponse = await axios.get(mediaUrl, { responseType: "stream" });
                        attachments.push(mediaResponse.data);
                    } catch (mediaError) {
                    }
                }

                api.sendMessage({
                    body: `👤 Tác giả: ${author}`,
                    attachment: attachments
                }, event.threadID, event.messageID);
            } else {
                api.sendMessage("No media found for the Facebook link.", event.threadID, event.messageID);
            }
        } catch (error) {
            console.error("Error fetching Facebook video information:", error);
            api.sendMessage("An error occurred while processing the Facebook link. Please try again later.", event.threadID, event.messageID);
        }
    }
};
