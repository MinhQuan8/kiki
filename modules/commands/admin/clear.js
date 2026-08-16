/* ------------------------------
    < COMMAND > --- < CKEAR >
------------------------------- */

// ----- < [ KHAI BÁO ] - REQUIRE MODULE CẦN THIẾT > ----- //
const fs = require("fs");

// ----- < [ CONFIG ] - THÔNG TIN VỀ LỆNH > ----- //
const config = {
    name: "clear",
    description: "Lệnh xóa tất cả tin nhắn của bot.",
    type: "admin",
    usage: "/kiki clear",
    condition: ["clear", "clearup", "thanh tay", "rua toi", "phi tang"],
    exception: [],
    permission: 1,
    priority: 3
}

// ----- < [ HÀM ] - XỬ LÍ LỆNH > ----- //
async function onCall({ message }) {
    await message.react("⏱");

    const { random } = global.function;
    const errorSentences = [
        "Đéo đc đại ka ơi :) lỗi cmnr",
        "Anh ơi em lam déo dc, bị con kac j r",
        "Loi cmnr 🙂 Ad ngu",
        "Loi roi thg ngu 🙂",
        "Anh Quan oi loi cmnr 🙂"
    ];

    try {
        const botMessageCaches = JSON.parse(fs.readFileSync(global.botMessageCachesPath, "utf8"));
        const botMessageCachesArray = Object.keys(botMessageCaches).reverse();
        const status = [];
        await new Promise(async (stop) => {
            for (let index = 0; index < botMessageCachesArray.length; index++) {
                await new Promise(async (resolve) => {
                    api.unsendMessage(botMessageCachesArray[index], (err) => {
                        if (err) status[index] = false;
                        else status[index] = true;

                        if (index == botMessageCachesArray.length - 1) stop();
                        return resolve();
                    });
                });
            }
        });

        fs.writeFileSync(global.botMessageCachesPath, JSON.stringify({}, null, 4), "utf8");

        if (status.includes(false)) {
                let count = 0;
                status.forEach(state => { if (!state) count++; });

                const errorCountSentences = [
                    `Có ${count} tinn nhắn em đ gỡ đc`,
                    `${count} tin nhắn em đéo gỡ đc anh Quanann ơi`,
                    `Giowf sao đai ka, còn ${count} tin nhan em đ gỡ đc`,
                    `Đụ mé đ gỡ đc ${count} tin nhắn nè?`,
                    `Clmn t còn ${count} tin nhắn này đ gỡ đc`
                ];

                message.react("⭕️");
                message.reply(`${errorSentences[random(0, errorSentences.length)]}\n${errorCountSentences[random(0, errorCountSentences.length)]}`);
        }
        else message.react("🔹");
    }
    catch(error) {
        message.react("⭕️");
        message.reply(errorSentences[random(0, errorSentences.length)]);
    }
}

// ----- < [ EXPORT ] - XUẤT MODULE > ----- //
module.exports = {
    config,
    onCall
}