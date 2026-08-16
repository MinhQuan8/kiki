/* -----------------------------
    < COMMAND > --- < FUCK >
------------------------------ */

// ----- < [ KHAI BÁO ] - REQUIRE MODULE CẦN THIẾT > ----- //
const client = require("aflb");
const XMLHttpRequest = require("xhr2").XMLHttpRequest;
const https = require("https");

// ----- < [ CONFIG ] - THÔNG TIN VỀ LỆNH > ----- //
const config = {
    name: "fuck",
    description: "Lệnh giúp bạn đụ người khác bằng cách tag tên.",
    type: "entertain",
    usage: "/kiki fuck [ TAG ]",
    condition: ["fuck", "fuk", "chich"],
    exception: ["chích"],
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
        "Lỗi r , có cái fuck cx k xog 🙂"
    ];
    const notFoundSentences = [
        "M đụ cai lồn j v 🙂",
        "M đ bt dùng lệnh à? Đụ ai??",
        "M đụ ông nội m chắc? Đụ th nao? 🙂",
        "Đụ không khí chắc?, đụ cak j v 🙂",
    ];
    const antiAttackAdminSentences = [
        "Tuổi loz =))",
        "Cút, anh quân của t",
        "Nonnnn",
        "Cúc =))",
        "Em con non lammm =))",
        "M nghĩ t ngu a 😏",
        "Tuoilozzzz",
        "Tuổi cặc 😏",
        "Nó anh tao, m cút 😏",
    ];
    const antiSelfDestructionSentences = [
        "M nghĩ t ngu à 😏",
        "Tuổi loz lừa t 😏",
        "T thông minh hơn r =))",
        "M khinh thường trí tuệ của t a ?",
        "Tuoiloz dụ t 😏",
        "Cút 😏",
        "Em còn non lắm =))",
        "Nonlozzz",
        "Tuoi cac =))",
        "Chú nghĩ a ngu à?",
    ];
    const replySentences = [
        "Mlem mlem 😋😋",
        "Banh lồn ra 😏",
        "Cởi quần ra 😏",
        "Lột đồ nhanh 😏",
        "Tuột quần! Nhanh 😋",
        "😏😏😏",
    ];
    const maleReplySentences = [
        "Móc cu ra 😏",
        "Móc cặc ra nhanh?",
        "Moi cuu ra lẹ 😏?",
        "Moi cak m ra??",
        "Cu đâu 😋?",
        "Mlem mlem 😋😋",
        "Banh căk ra 😏",
        "Cởi quần ra 😏",
        "Lột đồ nhanh 😏",
        "Tuột quần! Nhanh 😋",
        "😏😏😏",
    ];
    const femaleReplySentences = [
        "Móc lồn m ra 😏",
        "Móc lonz ra nhanh ?",
        "Moi cailonmay ra lẹ 😏 ?",
        "Moi lòn m ra??",
        "Lồn đâu em 😋?",
        "Mlem mlem 😋😋",
        "Banh lồn ra 😏",
        "Cởi quần ra 😏",
        "Lột đồ nhanh 😏",
        "Tuột quần! Nhanh 😋",
        "😏😏😏",
    ];

    try {
        const targetID = Object.keys(message.mentions);
        const targetTag = Object.values(message.mentions);
        const getFuck = async () => {
            for (let i = 0; i < targetID.length; i++) {
                const targetGender = global.usersInfo[targetID[i]].gender;
                const imageUrl = random(0, 1) ? await aflb.sfw.sex() : await aflb.nsfw.hentai_gif();
                const xhr = new XMLHttpRequest();

                xhr.onload = () => {
                    if (xhr.status == 200)
                        https.get(imageUrl, (stream) => {
                            message.reply({
                                body: `${targetTag[i]} ${
                                    (targetGender == "MALE") ? maleReplySentences[random(0, maleReplySentences.length)] : 
                                    (targetGender == "FEMALE") ? femaleReplySentences[random(0, femaleReplySentences.length)] :
                                    replySentences[random(0, replySentences.length)]
                                }`,
                                mentions: [{ tag: targetTag[i], id: targetID[i] }],
                                attachment: [stream]
                            });
                            message.react("🔹");
                        });
                    else getFuck();
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
        else getFuck();
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