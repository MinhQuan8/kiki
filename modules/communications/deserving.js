/* ----------------------------------------
    < COMMUNICATION > --- < DESERVING >
----------------------------------------- */

// ----- < [ CONFIG ] - THÔNG TIN VỀ PHÉP GIAO TIẾP > ----- //
const config = {
    name: "deserving",
    description: "Giao tiếp - Khen ngợi",
    type: "communication",
    condition: [
        "dep", "depp", "deptrai", "depgai", "xinh", "xinhdep", "xinhxan",
        "iu", "iuu", "iuuu", "yeu", "yeuu",
        "dangyeu", "dang yeu", "cute", "cuti", "cutie", "cuto",
        "ngoan", "ngoann",
        "gioi", "gioii",
        "khon", "thongminh", "thong minh",
        "gut chop",
        "pretty", "handsome", "good", "goodjob"
    ],
    exception: [
        "đang yêu",
        "khốn", "khồn", "khộn"
    ],
    permission: 0,
    priority: 0
}

// ----- < [ HÀM ] - XỬ LÍ PHÉP GIAO TIẾP > ----- //
async function onCall({ message }) {
    const { senderID } = message;
    const { random } = global.function;
    const { vocative, shortName } = global.usersInfo[senderID];
    const replySentences = [
        "😘", "😘😘", "😘😘😘",
        "🥰", "🥰🥰", "🥰🥰🥰",
        "😍", "😍😍", "😍😍😍",
        "😇", "😇😇", "😇😇😇",
        "😽", "😽😽", "😽😽😽",
        "😻", "😻😻", "😻😻😻",
        "😅", "😼", "🫶", "😏", "👁👄👁",
        "Mãi yêu 😽",
        "Love youu 😻",
        `${vocative} ${shortName} 😍😍`,
        `Iuuu ${shortName} 😘😘`,
        `Love diuu ${shortName} 😻😽`
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