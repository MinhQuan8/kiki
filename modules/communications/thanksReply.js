/* -------------------------------------------
    < COMMUNICATION > --- < THANKS REPLY >
-------------------------------------------- */

// ----- < [ CONFIG ] - THÔNG TIN VỀ PHÉP GIAO TIẾP > ----- //
const config = {
    name: "thanksReply",
    description: "Giao tiếp - Đáp lại lời cám ơn",
    type: "communication",
    condition: [
        "thank", "thankk", "thanks", "thankyou", "thankyouu",
        "thks", "thkss", "tks", "tkss",
        "cam on", "camm on", "cam mon", "camon", "cammon"
    ],
    exception: [],
    permission: 0,
    priority: 0
}
    
// ----- < [ HÀM ] - XỬ LÍ PHÉP GIAO TIẾP > ----- //
async function onCall({ message }) {
    const { senderID } = message;
    const { random } = global.function;
    const { vocative } = global.usersInfo[senderID];
    const replySentences = [
        "Okk",
        "okie",
        "Okii",
        "Ô kê",
        "Okee",
        "ok 😘",
        "Okee 😘",
        "Okk 🥰",
        "Oki 🥰🥰",
        "Giỏii",
        "Biết điều",
        "Biết điều đó",
        "Biết điều phết",
        "🥰", "🥰🥰",
        "😙", "😙😙", "😚", "😚😚",
        `ok ${vocative}`,
        `Okki ${vocative}`,
        `Oke nhe ${vocative}`
    ];
    const replyReaction = [
        "🥰", "😘", "😗", "😙", "😚", "😅",
        "🥲", "😇", "😊", "☺️", "😏",
        "😽", "😼",
        "💋", "❤️", "💖", "💗",
        "👍", "🫰", "👌", "🫶"
    ];
    
    switch(random(0, 2)) {
        case 0:
            message.reply(replySentences[random(0, replySentences.length)]);
            break;
        case 1:
            message.react(replyReaction[random(0, replyReaction.length)]);
            break;
    }
}

// ----- < [ EXPORT ] - XUẤT MODULE > ----- //
module.exports = {
    config,
    onCall
}