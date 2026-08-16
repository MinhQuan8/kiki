/* --------------------------------
    < COMMAND > --- < RULE34 >
--------------------------------- */

// ----- < [ KHAI BÁO ] - REQUIRE MODULE CẦN THIẾT > ----- //
const Booru = require("booru");
const https = require("https");
const Path = require("path");
const Url = require("url");

// ----- < [ CONFIG ] - THÔNG TIN VỀ LỆNH > ----- //
const config = {
    name: "rule34",
    description: "Lệnh trả về ảnh từ Rule34 theo thông tin tìm kiếm.",
    type: "porn",
    usage: "/kiki rule34 [ SEARCH CONTENT ]",
    condition: ["rule", "rule34", "r34"],
    exception: [],
    permission: 0,
    priority: 1
}

// ----- < [ HÀM ] - XỬ LÍ LỆNH > ----- //
async function onCall({ message, args }) {
    await message.react("⏱");

    const checkSendImage = async (url) => {
        const status = await new Promise((resolve, reject) => {
            try {
                https.get(url, (stream) => {
                    if (stream.statusCode >= 300) return resolve(false);
        
                    message.reply({ attachment: [stream] });
                    message.react("🔹");
                    return resolve(true);
                });
            } 
            catch (err) {
                reject(err);
            }
        })

        return status;
    }
    const { random, removeVietnamese } = global.function;
    const errorSentences = [
        "Lỗi r, thg admin đâu lo đi fix đi 🙂",
        "Lỗi cmnr thử lại đi 🙂",
        "Lỗi r tại m đó, thử lại đi",
        "Ăn ở cak j mà lỗi r, thử lại đi 🙂",
        "Thử lại đi lỗi cmnr 🙂",
        "Djt cụ m lỗi r, thử lại xem",
        "Lỗi r =)), có cái xem sếch cx k xog"
    ];
    const notFoundSentences = [
        "Cặc j v tìm đ ra, thử khác xem",
        "Đ có thử khác đi loz",
        "Bố m đ tìm đc, kiếm cái khác đi",
        "Đ có, cái khác đi",
        "Search cái cak j v đ có, thử khác đi 🙂",
        "Có cái tìm kiếm cx k xog, ngu đéo chịu đc 🙂"
    ];

    try {
        const search = removeVietnamese(args.join("_"));
        
        Booru.search("rule34", [search], { limit: 10, random: true }).then(async (posts) => {
            if (posts.length == 0) {
                message.react("⭕️");
                message.reply(notFoundSentences[random(0, notFoundSentences.length)]);
                return;
            }

            for (let index = 0; index < posts.length; index++) {
                const type = Path.extname(Url.parse(posts[index].fileUrl).pathname);
                if (type != ".png" && type != ".jpg" && type != ".jpeg") continue;

                const status = await checkSendImage(posts[index].fileUrl);
                if (status) break;

                if (index == posts.length - 1) {
                    message.react("⭕️");
                    message.reply(errorSentences[random(0, errorSentences.length)]);
                }
            }
        });
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