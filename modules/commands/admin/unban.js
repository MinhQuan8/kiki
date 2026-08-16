/* ---------------------------------
    < COMMAND > --- < UNBAN >
---------------------------------- */

// ----- < [ KHAI BÁO ] - REQUIRE MODULE CẦN THIẾT > ----- //
const moment = require("moment-timezone");
const fs = require("fs");

// ----- < [ CONFIG ] - THÔNG TIN VỀ LỆNH > ----- //
const config = {
    name: "unban",
    description: "Lệnh gỡ đình chỉ người dùng sử dụng Bot",
    type: "admin",
    usage: "/kiki unban [ TAG ]",
    condition: ["ub", "unban", "whitelist"],
    exception: [],
    permission: 3,
    priority: 3
}

// ----- < [ HÀM ] - XỬ LÍ LỆNH > ----- //
async function onCall({ message }) {
    await message.react("⏱");

    const { random } = global.function;
    const { botBlacklistPath } = global;
    const errorSentences = [
        "Clm lỗi cmnr, bố thg chủ ngu vcl",
        "Anh ơi em lam déo dc, bị con kac j r",
        "Loi cmnr 🙂 Quân ngu",
        "Loi roi thg ngu 🙂",
        "Anh Quan oi loi cmnr 🙂"
    ];

    try {
        const targetID = Object.keys(message.mentions)[0];
        const blacklist = JSON.parse(fs.readFileSync(botBlacklistPath, "utf8"));
        
        if (!targetID) throw(error);

        delete blacklist[targetID];

        fs.writeFileSync(botBlacklistPath, JSON.stringify(blacklist, null, 4), "utf8");

        message.react("🔹");
    } catch(error) {
        message.react("⭕️");
        message.reply(errorSentences[random(0, errorSentences.length)]);
    }
}

// ----- < [ EXPORT ] - XUẤT MODULE > ----- //
module.exports = {
    config,
    onCall
}