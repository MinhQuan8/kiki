/* -----------------------------
    < COMMAND > --- < MAP >
------------------------------ */

// ----- < [ KHAI BÁO ] - REQUIRE MODULE CẦN THIẾT > ----- //
const fs = require("fs");
const { resolve } = require("path");
const captureWebsite = require("capture-website");

// ----- < [ CONFIG ] - THÔNG TIN VỀ LỆNH > ----- //
const config = {
    name: "map",
    description: "Lệnh giúp bạn sử dụng GG Map trực tiếp qua lệnh.",
    type: "tool",
    usage: "/kiki map [ SEARCH CONTENT ]",
    condition: ["map", "ggmap", "ggm"],
    exception: [],
    permission: 0,
    priority: 2
}

// ----- < [ HÀM ] - XỬ LÍ LỆNH > ----- //
async function onCall({ message, args }) {
    await message.react("⏱");
    
    const { cachesPath } = global;
    const { random } = global.function;
    const errorSentences = [
        "Lỗi r, thg admin đâu lo đi fix đi 🙂",
        "Lỗi cmnr thử lại đi 🙂",
        "Lỗi r tại m đó, thử lại đi",
        "Ăn ở cak j mà lỗi r, thử lại đi 🙂",
        "Thử lại đi lỗi cmnr 🙂",
        "Djt cụ m lỗi r, thử lại xem",
        "Lỗi r , có cái search cx k xog 🙂"
    ];

    try {
        const search = args.join("+");
        const saveUrl = resolve(cachesPath, "map.png");
        let url;

        if (search.split(",+").length == 1) url = `https://www.google.com/maps/search/${search}`;
        else url = `https://www.google.com/maps/dir/${search.split(",+")[0]}/${search.split(",")[1]}`;
        
        fs.promises.access(saveUrl, fs.constants.F_OK).then(() => fs.unlinkSync(saveUrl));
        
        await captureWebsite.file(url, resolve(cachesPath, "map.png"), {
            fullPage: true,
            hideElements: [
                "div.F63Kk",
                "div.gb_Sf",
                "div#assistive-chips"
            ],
            beforeScreenshot: async (page) => {
                await page.click("button.yra0jd");
            }
        }); 
        message.reply({ attachment: fs.createReadStream(saveUrl) });
        message.react("🔹");
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