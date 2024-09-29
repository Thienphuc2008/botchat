const Groq = require('groq-sdk');
const fs = require('fs');
const path = require('path');

const chatHistoryDir = 'groqllama70b';
const apiKey = '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';

const groq = new Groq({ apiKey });

const systemPrompt = "Chủ yếu trả lời ngắn gọn như 1 hoặc 2 câu trừ khi yêu cầu câu trả lời dài như tiểu luận, bài thơ hoặc câu chuyện, v.v. Phân tích lời nhắc và câu trả lời theo hướng dẫn và chỉ phần cần thiết. Không có chất độn bổ sung.";

module.exports = {
    config: {
        name: 'l',
        version: '1.1.3',
        credits: 'Shikaki - Conver LocDev and retrieved ',
        description: "trò chuyện cùng llama3 70b - groq",
        commandCategory: "Tìm Kiếm",
        usages: "l + [câu hỏi], và muốn xóa dữ liệu thì l clear",
        cooldowns: 1,
    },
    run: async ({ api, event, args }) => {
        var prompt = args.join(" ");

        if (prompt.toLowerCase() === "clear") {
            clearChatHistory(event.senderID);
            return api.sendMessage("Đã xóa lịch sử trò chuyện!", event.threadID, event.messageID);
        }

        var chatHistory = loadChatHistory(event.senderID);

        if (args.length == 0 && prompt == "") {
            return api.sendMessage("Vui lòng cung cấp lời nhắc.", event.threadID, event.messageID);

        }

        api.setMessageReaction("⌛", event.messageID, () => { }, true);

        const startTime = Date.now();

        try {
            const chatMessages = [
                { "role": "system", "content": systemPrompt },
                ...chatHistory,
                { "role": "user", "content": prompt }
            ];

            const chatCompletion = await groq.chat.completions.create({
                "messages": chatMessages,
                "model": "llama3-70b-8192",
                "temperature": 0.6,
                "max_tokens": 8192,
                "top_p": 0.8,
                "stream": false,
                "stop": null
            });

            const assistantResponse = chatCompletion.choices[0].message.content;

            const endTime = new Date().getTime();
            const completionTime = ((endTime - startTime) / 1000).toFixed(2);
            const totalWords = assistantResponse.split(/\s+/).filter(word => word !== '').length;

            let finalMessage = `${assistantResponse}\n\nThời gian hoàn thành: ${completionTime} s\nTổng số từ: ${totalWords}`;

            api.sendMessage(finalMessage, event.threadID, (err, info) => {
                if (!err) {
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: event.senderID,
                    });
                }
            });

            chatHistory.push({ role: "user", content: prompt });
            chatHistory.push({ role: "assistant", content: assistantResponse });
            appendToChatHistory(event.senderID, chatHistory);

            api.setMessageReaction("✅", event.messageID, () => { }, true);
        } catch (error) {
            api.setMessageReaction("❌", event.messageID, () => { }, true);
            return api.sendMessage(`An error occurred: ${error}`, event.threadID, event.messageID);
        }
    },
    handleReply: async ({ api, message, event, handleReply, args }) => {
        var prompt = args.join(" ");
        let { author } = handleReply;
    
        if (!event.messageReply == author) return;
    
        api.setMessageReaction("⌛", event.messageID, () => { }, true);
    
        const startTime = Date.now();
    
        try {
            const chatHistory = loadChatHistory(event.senderID);
    
            const chatMessages = [
                { "role": "system", "content": systemPrompt },
                ...chatHistory,
                { "role": "user", "content": prompt }
            ];
    
            const chatCompletion = await groq.chat.completions.create({
                "messages": chatMessages,
                "model": "llama3-70b-8192",
                "temperature": 0.6,
                "max_tokens": 8192,
                "top_p": 0.8,
                "stream": false,
                "stop": null
            });
    
            const assistantResponse = chatCompletion.choices[0].message.content;
    
            const endTime = new Date().getTime();
            const completionTime = ((endTime - startTime) / 1000).toFixed(2);
            const totalWords = assistantResponse.split(/\s+/).filter(word => word !== '').length;
    
            let finalMessage = `${assistantResponse}\n\nThời gian hoàn thành: ${completionTime} s\nTổng số từ: ${totalWords}`;
    
            api.sendMessage(finalMessage, (err, info) => {
                if (!err) {
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: event.senderID,
                    });
                }
            });
    
            chatHistory.push({ role: "user", content: prompt });
            chatHistory.push({ role: "assistant", content: assistantResponse });
            appendToChatHistory(event.senderID, chatHistory);
    
            api.setMessageReaction("✅", event.messageID, () => { }, true);
        } catch (error) {
            api.sendMessage(error.message);
            api.setMessageReaction("❌", event.messageID, () => { }, true);
        }
    }
};

function loadChatHistory(uid) {
    const chatHistoryFile = path.join(chatHistoryDir, `memory_${uid}.json`);

    try {
        if (fs.existsSync(chatHistoryFile)) {
            const fileData = fs.readFileSync(chatHistoryFile, 'utf8');
            const chatHistory = JSON.parse(fileData);
            return chatHistory.map((message) => {
                if (message.role === "user" && message.parts) {
                    return { role: "user", content: message.parts[0].text };
                } else {
                    return message;
                }
            });
        } else {
            return [];
        }
    } catch (error) {
        console.error(`Lỗi tải lịch sử trò chuyện cho UID ${uid}:`, error);
        return [];
    }
}

function appendToChatHistory(uid, chatHistory) {
    const chatHistoryFile = path.join(chatHistoryDir, `memory_${uid}.json`);

    try {
        if (!fs.existsSync(chatHistoryDir)) {
            fs.mkdirSync(chatHistoryDir);
        }

        fs.writeFileSync(chatHistoryFile, JSON.stringify(chatHistory, null, 2));
    } catch (error) {
        console.error(`Lỗi lưu lịch sử trò chuyện cho UID ${uid}:`, error);
    }
}

function clearChatHistory(uid) {
    const chatHistoryFile = path.join(chatHistoryDir, `memory_${uid}.json`);

    try {
        fs.unlinkSync(chatHistoryFile);
    } catch (err) {
        console.error(err);
    }
}