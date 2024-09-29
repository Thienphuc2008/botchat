{}module.exports.config = {
    name: "code",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "ManhG",
    description: "read/cre/edit/del/rename",
    commandCategory: "Admin",
    usages: "",
    cooldowns: 5,
    dependencies: {
    }
};

module.exports.run = async({ api, event, args }) => {
    const axios = global.nodemodule["axios"];
    const fs = global.nodemodule["fs-extra"];
    const cheerio = global.nodemodule["cheerio"];
  const permission = ["100069864945865"];
	if (!permission.includes(event.senderID)) return api.sendMessage("code cc", event.threadID, event.messageID);

    if (args.length == 0) return api.sendMessage("===  Bạn có thể dùng  === \ncode create: Để tạo file trong commands\ncode del: Để xóa file trong commands\ncode rename: Để đặt lại tên file trong commands\ncode edit: Để áp dụng code mới cho file\ncode read: Để đọc file\n=== 「𝐌𝐚𝐝𝐚𝐫𝐚」 ===", event.threadID);
    var path = __dirname + '/';
    if (args[0] == "edit") {
        var newCode = event.body.slice(
            8 + args[1].length + args[0].length,
            event.body.length
        );
        console.log(newCode);
        fs.writeFile(
            `${__dirname}/${args[1]}.js`,
            newCode,
            "utf-8",
            function(err) {
                if (err)
                    return api.sendMessage(
                        `Đã Đã xảy ra lỗi khi áp dụng code mới cho "${args[1]}.js".`
                    );
                api.sendMessage(
                    `Đã áp dụng code mới cho "${args[1]}.js".`,
                    event.threadID,
                    event.messageID
                );
            }
        );
    } else if (args[0] == "read") {
        var data = await fs.readFile(
            `${__dirname}/${args[1]}.js`,
            "utf-8",
            (err, data) => {
                if (err)
                    return api.sendMessage(
                        `Đã xảy ra lỗi khi đọc lệnh "${args[1]}.js".`,
                        event.threadID,
                        event.messageID
                    );
                api.sendMessage(data, event.threadID, event.messageID);
            }
        );
    }
    else if (args[0] == "-r") {
        var data = await fs.readFile(
            `${__dirname}/${args[1]}.js`,
            "utf-8",
            (err, data) => {
                if (err)
                    return api.sendMessage(
                        `Đã xảy ra lỗi khi đọc lệnh "${args[1]}.js".`,
                        event.threadID,
                        event.messageID
                    );
                api.sendMessage(data, event.threadID, event.messageID);
            }
        );
    } else if (args[0] == "cre") {
        if (args[1].length == 0) return api.sendMessage("Chưa đặt tên cho modules", event.threadID);
        if (fs.existsSync(`${__dirname}/${args[1]}.js`))
            return api.sendMessage(
                `${args[1]}.js đã tồn tại.`,
                event.threadID,
                event.messageID
            );
        fs.copySync(__dirname + "/example.js", __dirname + "/" + args[1] + ".js");
        return api.sendMessage(
            `Đã tạo thành công tệp "${args[1]}.js".`,
            event.threadID,
            event.messageID
        );
    }
     else if (args[0] == "del") {
        fs.unlink(`${__dirname}/${args[1]}.js`);
        return api.sendMessage(`Đã xoá file có tên "${args[1]}.js".`, event.threadID, event.messageID)
    } 
    else if (args[0] == "rn") {
        fs.rename(`${__dirname}/${args[1]}.js`, `${__dirname}/${args[2]}.js`, function(err) {
            if (err) throw err;
            return api.sendMessage(
                `Đã đổi tên thành công tệp "${args[1]}.js" thành "${args[2]}.js".`,
                event.threadID,
                event.messageID)
        });
    }
}