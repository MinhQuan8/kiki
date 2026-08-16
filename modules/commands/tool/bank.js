/* -------------==--------------
    < COMMAND > --- < BANK >
------------------------------ */

// ----- < [ CONFIG ] - THÔNG TIN VỀ LỆNH > ----- //
const config = {
    name: "bank",
    description: "Lệnh trả về số dư hiện có của người dùng.",
    type: "tool",
    usage: "/kiki bank",
    condition: ["bank", "money"],
    exception: [],
    permission: 0,
    priority: 0
}

// ----- < [ HÀM ] - XỬ LÍ LỆNH > ----- //
async function onCall({ message, args }) {
    await message.react("⏱");
    
    const { senderID } = message;
    const { usersInfo, adminID } = global;
    const { random } = global.function;
    const errorSentences = [
        "Lỗi r, thg ad đâu lo đi fix đi 🙂",
        "Lỗi cmnr thử lại đi 🙂",
        "Lỗi r tại m đó, thử lại đi",
        "Ăn ở cak j mà lỗi r, thử lại đi 🙂",
        "Thử lại đi lỗi cmnr 🙂",
        "Djt cụ m lỗi r, thử lại xem",
        "Lỗi r , có cái lệnh cx k xog 🙂"
    ];
    const notEnoughtMoneySentences = [
        "Đéo đủ tiền chuyển cái lồn mạ m à?",
        "Đã nghèo rách còn bày đặt chuyển lắm, m đ đủ tiền oclon 😀",
        "Đéo đủ tiền chuyển cc nhà m à 🙂",
        "Đỗ nghèo khỉ đòi chuyển cl, đ đủ tiền kìa 🙂",
        "Đói nghèo rách! đ đủ tiền chuyển oc cặc 🙂"
    ];
    const returnMoneySentences = (money) => {
        return [
            `M có có ${money} thoi occho 🙂!`,
            `Số dư m còn đúng ${money}`,
            `M còn tới ${money} lận 😀`,
            `Oclon này còn ${money}`,
            `Con đỗ nghèo khỉ này còn ${money} 🙂`
        ]
    };

    try {
        if (args.length == 0) {
            const money = usersInfo[senderID].money;
                
            message.reply(returnMoneySentences(money)[random(0, returnMoneySentences(money).length)]);
            message.react("🔹");
        }

        if (args.length > 0) {
            const targetIDs = Object.keys(message.mentions);
            const sendMoney = +args.pop();
            const money = usersInfo[senderID].money;

            console.log(targetIDs)

            if (sendMoney * targetIDs.length > money && senderID != adminID) {
                message.react("⭕️");
                message.reply(notEnoughtMoneySentences[random(0, notEnoughtMoneySentences.length)]);
                return;
            }
            
            if (!isNaN(sendMoney) && targetIDs.length > 0 && (senderID == adminID ? true : sendMoney > 0)) {
                targetIDs.forEach(targetID => {
                    global.usersInfo[senderID].money -= senderID == adminID ? 0 : sendMoney;
                    global.usersInfo[targetID].money += sendMoney;
                });

                message.react("🔹");
            }
            else message.react("⭕️");
        }
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