/* -----------------------------
    < COMMAND > --- < KILL >
------------------------------ */

// ----- < [ KHAI BÁO ] - REQUIRE MODULE CẦN THIẾT > ----- //
const client = require("aflb");
const XMLHttpRequest = require("xhr2").XMLHttpRequest;
const https = require("https");

// ----- < [ CONFIG ] - THÔNG TIN VỀ LỆNH > ----- //
const config = {
    name: "kill",
    description: "Lệnh xiên người khác bằng cách tag tên.",
    type: "entertain",
    usage: "/kiki kill [ TAG ]",
    condition: ["kill", "assassinate", "am sat", "amsat", "giet", "giett"],
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
        "Lỗi r , có cái xiên cx đ xog 🙂"
    ];
    const notFoundSentences = [
        "M kill cai lồn j v 🙂",
        "M đ bt dùng lệnh à? Giets ai??",
        "M chém ông nội m à? Xiên th nao? 🙂",
        "Kill không khí chắc?, cak j v 🙂",
    ];
    const antiAttackAdminSentences = [
        "Tuổi loz =))",
        "Cút, anh quân của t",
        "Nonnnn",
        "Cut =))",
        "Em con non lammm =))",
        "M nghĩ t ngu a 😏",
        "Tuoilozzzz",
        "Tuổi cặc 😏",
        "Nó anh tao, m cút 😏",
    ];
    const antiSelfDestructionSentences = [
        "M nghĩ t ngu à 😏",
        "Tuổi loz lừa t 😏",
        "T thông minh hơn m tưởng=)",
        "M khinh thường trí tuệ của t a ?",
        "Tuoiloz dụ t 😏",
        "Cút 😏",
        "Em còn non lắm =))",
        "Non lozzz",
        "Tuoi cac nhé emm",
        "M nghĩ a ngu à?",
    ];
    const replySentences = [
        "Chuẩn bị chetdi",
        "Chém loi lon m 😏",
        "Đâm chetme m 😏",
        "T xiên chết cha m 😏",
        "Chém chetme oog nội m 😏",
        "😏😏😏",
        "😏😏",
        "😏",
    ];

    try {
        const targetID = Object.keys(message.mentions);
        const targetTag = Object.values(message.mentions);
        const getKill = async () => {
            for (let i = 0; i < targetID.length; i++) {
                const imageUrl = await aflb.sfw.kill();
                const xhr = new XMLHttpRequest();

                xhr.onload = () => {
                    if (xhr.status == 200)
                        https.get(imageUrl, (stream) => {
                            message.reply({
                                body: `${targetTag[i]} ${replySentences[random(0, replySentences.length)]}`,
                                mentions: [{ tag: targetTag[i], id: targetID[i] }],
                                attachment: [stream]
                            });
                            message.react("🔹");
                        });
                    else getKill();
                };
                xhr.open("HEAD", imageUrl);
                xhr.send();
            }
        }

        if (!targetID.length) {
            message.react("⭕️");
            message.reply(notFoundSentences[random(0, notFoundSentences.length)]);
        }
        else if (targetID.includes(adminID)) {
            message.react("⭕️");
            message.reply(antiAttackAdminSentences[random(0, antiAttackAdminSentences.length)]);
        }
        else if (targetID.includes(botID)) {
            message.react("⭕️");
            message.reply(antiSelfDestructionSentences[random(0, antiSelfDestructionSentences.length)]);
        }
        else getKill();
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