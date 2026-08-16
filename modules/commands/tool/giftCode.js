/* -------------==-------------------
    < COMMAND > --- < GIFT CODE >
----------------------------------- */

// ----- < [ KHAI BÁO ] - REQUIRE MODULE CẦN THIẾT > ----- //
const fs = require("fs");

// ----- < [ CONFIG ] - THÔNG TIN VỀ LỆNH > ----- //
const config = {
    name: "giftCode",
    description: "Lệnh sử dụng Gift Code.",
    type: "tool",
    usage: "/kiki giftcode [ GIFT CODE ]",
    condition: ["giftcode", "gift", "code", "gf"],
    exception: [],
    permission: 0,
    priority: 0
}

// ----- < [ HÀM ] - XỬ LÍ LỆNH > ----- //
async function onCall({ message, args }) {
    await message.react("⏱");
    
    const { senderID } = message;
    const { adminID, usersInfo, giftCodesPath } = global;
    const { random, checkMessage, moneyFormat, updateUsersInfo } = global.function;
    const errorSentences = [
        "Lỗi r, thg ad đâu lo đi fix đi 🙂",
        "Lỗi cmnr thử lại đi 🙂",
        "Lỗi r tại m đó, thử lại đi",
        "Ăn ở cak j mà lỗi r, thử lại đi 🙂",
        "Thử lại đi lỗi cmnr 🙂",
        "Djt cụ m lỗi r, thử lại xem",
        "Lỗi r , có cái lệnh cx k xog 🙂"
    ];
    const notFoundSentences = [
        "giftcode cặc j v?",
        "Mã đéo j đấy 😀",
        "Mẫ lồn j v 🙂?",
        "gift code đéo tồn tại 🙂",
        "Đ có giftcode này 🙂"
    ];

    try {
        const command = args[0];
        const userGiftCodes = args;
        const lastGiftCodes = JSON.parse(fs.readFileSync(giftCodesPath, "utf8"));

        if (checkMessage(command, ["tao", "create", "generate"], ["tao", "táo", "tảo", "tào"])) {
            const quantity = args[1];
            const value = args[2] || 10000;
            const generateGiftCode = (length, quantity, value) => {
                const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                const giftCodes = [];
            
                for (let index = 0; index < quantity; index++) {
                    let giftCode = `${moneyFormat(value, 0)}-`;
            
                    for (let i = 0; i < length; i++) giftCode += chars.charAt(Math.floor(Math.random() * chars.length));
                    giftCodes.push(giftCode);
                }
                return giftCodes;
            }
            
            const giftCodes = generateGiftCode(5, quantity, value);
            const giftCodesObject = {};

            giftCodes.forEach(giftCode => {
                giftCodesObject[giftCode] = +value;
            });

            Object.assign(giftCodesObject, lastGiftCodes);
            fs.writeFileSync(giftCodesPath, JSON.stringify(giftCodesObject, null, 4), "utf8");
            message.react("🔹");
        }

        else if (checkMessage(command, ["show", "list", "danh sach"]) && senderID == adminID) {
            let giftCodesList = "";

            Object.keys(lastGiftCodes).sort((x, y) => lastGiftCodes[x] > lastGiftCodes[y]).forEach(giftCode => {
                giftCodesList += `• ${giftCode}\n`;
            })

            message.react("🔹");
            message.reply(giftCodesList);
        }

        else if (userGiftCodes.every(giftCode => Object.keys(lastGiftCodes).includes(giftCode))) {
            userGiftCodes.forEach(giftCode => {
                usersInfo[senderID].money += +lastGiftCodes[giftCode];
                delete lastGiftCodes[giftCode];
            });

            fs.writeFileSync(giftCodesPath, JSON.stringify(lastGiftCodes, null, 4), "utf8");
            updateUsersInfo(usersInfo)
            message.react("🔹");
        }

        else {
            message.react("⭕️");
            message.reply(notFoundSentences[random(0, notFoundSentences.length)]);
        }

    } catch(error) {
        console.log(error);
        message.react("⭕️");
        message.reply(errorSentences[random(0, errorSentences.length)]);
    }
}

// ----- < [ EXPORT ] - XUẤT MODULE > ----- //
module.exports = {
    config,
    onCall
}