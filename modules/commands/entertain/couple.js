/* -------------------------------
    < COMMAND > --- < COUPLE >
-------------------------------- */

// ----- < [ KHAI BÁO ] - REQUIRE MODULE CẦN THIẾT > ----- //
const fs = require("fs");
const { resolve } = require("path");
const { createCanvas, loadImage } = require("canvas");

// ----- < [ CONFIG ] - THÔNG TIN VỀ LỆNH > ----- //
const config = {
    name: "couple",
    description: "Lệnh ghép đôi với người khác.",
    type: "entertain",
    usage: "/kiki couple",
    condition: ["couple", "love", "setlove"],
    exception: [],
    permission: 0,
    priority: 0
}

// ----- < [ HÀM ] - XỬ LÍ LỆNH > ----- //
async function onCall({ message }) {
    await message.react("⏱");
    
    const { senderID } = message;
    const { usersInfo, threadsInfo, cachesPath, assetsPath } = global;
    const { random } = global.function;
    const errorSentences = [
        "Lỗi r, thg admin đâu lo đi fix đi 🙂",
        "Lỗi cmnr thử lại đi 🙂",
        "Lỗi r tại m đó, thử lại đi",
        "Ăn ở cak j mà lỗi r, thử lại đi 🙂",
        "Thử lại đi lỗi cmnr 🙂",
        "Djt cụ m lỗi r, thử lại xem",
        "anh Quaan oiw lỗi r"
    ];
    const loveSentences = [
        "❤", "💓", "💞", "💗", "💕", "💟", "💘",
        "😘", "😍", "😻",
        "👌👈", "👉👌"
    ]

    try {
        const coupleAssetsPath = resolve(assetsPath, "couple");
        const threadParticipants = threadsInfo[message.threadID].participants.filter(participant => { return participant.userID != senderID });
        const target = threadParticipants[random(0, threadParticipants.length)];
        const targetName = usersInfo[target.userID].fullName;
        const senderName = usersInfo[senderID].fullName;

        const canvas = createCanvas(1200, 600);
        const ctx = canvas.getContext("2d");

        const background = await loadImage(resolve(coupleAssetsPath, "coupleBackground.png"));
        const avatarUser = await loadImage(target.profilePicture)
        const avatarTarget = await loadImage(usersInfo[senderID].profileImage);

        ctx.drawImage(background, 0, 0);
        ctx.drawImage(avatarUser, 201.5, 183, 230, 230);
        ctx.drawImage(avatarTarget, 768, 183, 230, 230);

        canvas.createPNGStream().pipe(fs.createWriteStream(resolve(cachesPath, "couple.png"))).on("finish", () => {
            message.reply({
                body: `@${targetName} ${loveSentences[random(0, loveSentences.length)]} @${senderName}`,
                mentions: [
                    {
                        tag: `@${targetName}`,
                        id: target.userID
                    },
                    {
                        tag: `@${senderName}`,
                        id: senderID
                    }
                ],
                attachment: fs.createReadStream(resolve(cachesPath, "couple.png"))
            });
            message.react("🔹");
        });
    } catch(error) {
        console.log(error)
        message.react("⭕️");
        message.reply(errorSentences[random(0, errorSentences.length)]);
    }
}

// ----- < [ EXPORT ] - XUẤT MODULE > ----- //
module.exports = {
    config,
    onCall
}