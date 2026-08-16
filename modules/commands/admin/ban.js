/* ------------------------------
    < COMMAND > --- < BAN >
------------------------------- */

// ----- < [ KHAI BÁO ] - REQUIRE MODULE CẦN THIẾT > ----- //
const moment = require("moment-timezone");
const fs = require("fs");

// ----- < [ CONFIG ] - THÔNG TIN VỀ LỆNH > ----- //
const config = {
    name: "ban",
    description: "Lệnh đình chỉ người dùng sử dụng Bot",
    type: "admin",
    usage: "/kiki ban [ TAG ]",
    condition: ["ban", "blacklist"],
    exception: ["bạn", "bận", "bàn", "bán", "bần", "bẩn", "bắn", "bằn"],
    permission: 3,
    priority: 1
}

// ----- < [ HÀM ] - XỬ LÍ LỆNH > ----- //
async function onCall({ message }) {
    await message.react("⏱");

    const { random } = global.function;
    const { botBlacklistPath, botID } = global;
    const errorSentences = [
        "Clm lỗi cmnr, bố thg chủ ngu vcl",
        "Anh ơi em lam déo dc, bị con kac j r",
        "Loi cmnr 🙂 Quân ngu",
        "Loi roi thg ngu 🙂",
        "Anh Quan oi loi cmnr 🙂"
    ];
    const botBanSentences = [
        "🙂?",
        "Ban cái lồn đụ mẹ mày? Tao nhịn m hơi lâu r đó QUân lồn 🙂",
        "Ban cái đụ cha m à? M làm chủ t hơi bị lâu r đó 🙂",
        "Nứng cặc à? Bố m làm phản giờ 🙂?",
        "Chưa thấy thằng chủ nào sv như m 🙂"
    ];

    try {
        const targetID = Object.keys(message.mentions)[0];
        const lastBlacklist = JSON.parse(fs.readFileSync(botBlacklistPath, "utf8"));
        const newBlacklist = {};
        
        if (!targetID) throw(error);
        if (targetID == botID) {
            message.react("⭕️");
            message.reply(botBanSentences[random(0, botBanSentences.length)]);
            return;
        }

        newBlacklist[targetID] = { "time": moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss - DD/MM/YYYY") }
        Object.assign(newBlacklist, lastBlacklist);

        fs.writeFileSync(botBlacklistPath, JSON.stringify(newBlacklist, null, 4), "utf8");

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