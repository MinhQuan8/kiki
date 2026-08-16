/* -----------------------------
    < COMMAND > --- < KISS >
------------------------------ */

// ----- < [ KHAI BÁO ] - REQUIRE MODULE CẦN THIẾT > ----- //
const client = require("aflb");
const XMLHttpRequest = require("xhr2").XMLHttpRequest;
const https = require("https");

// ----- < [ CONFIG ] - THÔNG TIN VỀ LỆNH > ----- //
const config = {
    name: "kiss",
    description: "Lệnh giúp bạn hôn người khác bằng cách tag tên.",
    type: "entertain",
    usage: "/kiki kiss [ TAG ]",
    condition: ["kiss"],
    exception: [],
    permission: 0,
    priority: 0
}

// ----- < [ HÀM ] - XỬ LÍ LỆNH > ----- //
async function onCall({ message }) {
    await message.react("⏱");
    
    const { senderID } = message;
    const { botID } = global;
    const { random } = global.function;
    const aflb = new client();
    const errorSentences = [
        "Lỗi r, thg admin đâu lo đi fix đi 🙂",
        "Lỗi cmnr thử lại đi 🙂",
        "Lỗi r tại m đó, thử lại đi",
        "Ăn ở cak j mà lỗi r, thử lại đi 🙂",
        "Thử lại đi lỗi cmnr 🙂",
        "Djt cụ m lỗi r, thử lại xem",
        "Lỗi r , có cái kiss cx đ xog 🙂"
    ];
    const notFoundSentences = [
        "M kiss cai lồn j v 🙂",
        "M đ bt dùng lệnh à? Hon ai??",
        "M kiss ông nội m à? Hôn th nao? 🙂",
        "Kiss không khí chắc?, cak j v 🙂",
    ];
    const replySentences = [
        "Mlem mlem 😋",
        "😋😋😋",
        "😋😋",
        "😋",
        "😏😏😏",
        "😏😏",
        "😏",
    ];
    const onBotReplySentences = [
        `Mãi yêuuu bạn ${global.usersInfo[senderID].shortName} 😘`,
        `Iuuu bạn ${global.usersInfo[senderID].shortName} thé nhờ 😍`,
        `Yeu ${global.usersInfo[senderID].shortName} 😘😘`,
        "😍😍😍",
        "😍😍",
        "😍",
        "😘😘😘",
        "😘😘",
        "😘",
        "🥰🥰🥰",
        "🥰🥰",
        "🥰",
    ];

    try {
        const targetID = Object.keys(message.mentions);
        const targetTag = Object.values(message.mentions);
        const getKiss = async () => {
            for (let i = 0; i < targetID.length; i++) {
                const imageUrl = random(0, 1) ? await aflb.sfw.kiss() : await aflb.sfw.kissCheek();
                const xhr = new XMLHttpRequest();

                xhr.onload = () => {
                    if (xhr.status == 200)
                        https.get(imageUrl, (stream) => {
                            message.reply({
                                body: `${targetTag[i]} ${
                                    (targetID[i] == botID) ?
                                    onBotReplySentences[random(0, onBotReplySentences.length)] :
                                    replySentences[random(0, replySentences.length)]
                                }`,
                                mentions: [{ tag: targetTag[i], id: targetID[i] }],
                                attachment: [stream]
                            });
                            message.react("🔹");
                        });
                    else getKiss();
                };
                xhr.open("HEAD", imageUrl);
                xhr.send();
            }
        }

        if (!targetID.length) {
            message.react("⭕️");
            message.reply(notFoundSentences[random(0, notFoundSentences.length)]);
        }
        else getKiss();
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