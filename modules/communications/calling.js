/* ---------------------------------------
    < COMMUNICATION > --- < CALLING >
---------------------------------------- */

// ----- < [ CONFIG ] - THÔNG TIN VỀ PHÉP GIAO TIẾP > ----- //
const config = {
    name: "calling",
    description: "Giao tiếp - Kêu gọi",
    type: "communication",
    condition: ["-", "e", "ee", "ey", "eyy", "eey", "hey", "heyy", "oi", "oii"],
    exception: ["è"],
    permission: 0,
    priority: 1
}
    
// ----- < [ HÀM ] - XỬ LÍ PHÉP GIAO TIẾP > ----- //
async function onCall({ message }) {
    const { senderID } = message;
    const { random } = global.function;
    const { vocative } = global.usersInfo[senderID];
    const replySentences = [
        vocative + " này kêu j 😘",
        vocative + " kêu j 😏?",
        "Kêu loz j thì sủa nhanh 😃",
        "kêu con đĩ mẹ m à 🙂?",
        "ocloz nay kêu ccj?",
        "Kêu con mẹ j t 🙂?",
        "m keu cac j? 🙃",
        "Kêu ccj 🙂",
        "j 🙂?",
        "sủa 😃?",
        "gáy? 😃",
        "sua j? 🙃",
        "nói",
        "sủa lẹ 😃",
        "ẳng hộ bố m cái?"
    ];
    
    message.reply(replySentences[random(0, replySentences.length)]);
}

// ----- < [ EXPORT ] - XUẤT MODULE > ----- //
module.exports = {
    config,
    onCall
}