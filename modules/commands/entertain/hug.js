/* ----------------------------
    < COMMAND > --- < HUG >
----------------------------- */

// ----- < [ KHAI BÁO ] - REQUIRE MODULE CẦN THIẾT > ----- //
const client = require("aflb");
const XMLHttpRequest = require("xhr2").XMLHttpRequest;
const https = require("https");

// ----- < [ CONFIG ] - THÔNG TIN VỀ LỆNH > ----- //
const config = {
    name: "hug",
    description: "Lệnh ôm người khác bằng cách tag tên.",
    type: "entertain",
    usage: "/kiki hug [ TAG ]",
    condition: ["hug", "hugg"],
    exception: [],
    permission: 0,
    priority: 0
}

// ----- < [ HÀM ] - XỬ LÍ LỆNH > ----- //
async function onCall({ message }) {
    await message.react("⏱");
    
    const { adminID, botID } = global;
    const { random } = global.function;
    const aflb = new client();
    const errorSentences = [
        "Lỗi r, thg admin đâu lo đi fix đi 🙂",
        "Lỗi cmnr thử lại đi 🙂",
        "Lỗi r tại m đó, thử lại đi",
        "Ăn ở cak j mà lỗi r, thử lại đi 🙂",
        "Thử lại đi lỗi cmnr 🙂",
        "Djt cụ m lỗi r, thử lại xem",
        "Lỗi r , có cái ôm cx đ xog 🙂"
    ];
    const notFoundSentences = [
        "M hug cai lồn j v 🙂",
        "M đ bt dùng lệnh à? Ôm ai??",
        "M hug bà già nhà t chắc? Ôm thg nao? 🙂",
        "Hug cmm chắc?, cak j v 🙂",
    ];
    const replySentences = [
        "kiki, ra đây đi 😏",
        "😏😏😏",
        "😏😏",
        "😏",
    ];
    const onAdminReplySentences = [
        "😼😼😼",
        "😼😼",
        "😼",
        "😿"
    ];
    const onBotReplySentences = [
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
        const getHug = async () => {
            for (let i = 0; i < targetID.length; i++) {
                const imageUrl = await aflb.sfw.hug();
                const xhr = new XMLHttpRequest();

                xhr.onload = () => {
                    if (xhr.status == 200)
                        https.get(imageUrl, (stream) => {
                            message.reply({
                                body: `${targetTag[i]} ${
                                    (targetID[i] == adminID) ? onAdminReplySentences[random(0, onAdminReplySentences.length)] :
                                    (targetID[i] == botID) ? onBotReplySentences[random(0, onBotReplySentences.length)] :
                                    replySentences[random(0, replySentences.length)]
                                }`,
                                mentions: [{ tag: targetTag[i], id: targetID[i] }],
                                attachment: [stream]
                            });
                            message.react("🔹");
                        });
                    else getHug();
                };
                xhr.open("HEAD", imageUrl);
                xhr.send();
            }
        }

        if (!targetID.length) {
            message.react("⭕️");
            message.reply(notFoundSentences[random(0, notFoundSentences.length)]);
        }
        else getHug();
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