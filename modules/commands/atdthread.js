const axios = require("axios");
const moment = require("moment-timezone");

const linkapi = "https://apitntxtrick.onlitegix.com/downall";

module.exports = {
    config: {
        name: "atdthread",
        version: "1.0.0",
        hasPermssion: 0,
        credits: "tnt",
        description: "",
        commandCategory: "AUTO",
        usages: "",
        cooldowns: 5
    },

    run: ({ api, event, args }) => {
    },
    
    handleEvent: async ({ api, event }) => {
        const { body, senderID } = event;

        if (!body || (!body.includes('https://www.threads.net/')) || senderID === api.getCurrentUserID() || senderID === '') return;

          try {
            const response = await axios.get(`${linkapi}?link=${body}`);
            const { medias } = response.data;

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
                    body: ``,
                    attachment: attachments
                }, event.threadID, event.messageID);
            } else {
                api.sendMessage("No media found for the Threads link.", event.threadID, event.messageID);
            }
        } catch (error) {
            api.sendMessage("An error occurred while processing the Threads link. Please try again later.", event.threadID, event.messageID);
        }
        }
};
