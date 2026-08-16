/* -------------------------------
    < COMMAND > --- < PORN >
-------------------------------- */

// ----- < [ KHAI BÁO ] - REQUIRE MODULE CẦN THIẾT > ----- //
const fs = require("fs");
const https = require("https");
const { resolve } = require("path");
const { registerFont } = require("canvas");
const { saveImage } = require("table-renderer");
const TableRenderer = require("table-renderer").default;

// ----- < [ CONFIG ] - THÔNG TIN VỀ LỆNH > ----- //
const config = {
    name: "porn",
    description: "Lệnh trả về ảnh NSFW.",
    type: "porn",
    usage: "/kiki porn [ SEARCH CONTENT ]",
    condition: ["porn", "pon"],
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
    const { senderID } = message;
    const { random, checkMessage } = global.function;
    const { assetsPath, cachesPath, adminID } = global;
    const nsfwPath = resolve(assetsPath, "nsfw");
    const categories = new Map([
        ["male", {
            condition: ["male", "dick", "cock", "penis", "cu", "cac", "buoi", "gay", "trai", "duc"],
            exception: ["cũ", "cú", "cụ", "các", "buổi", "gáy"],
            path: [
                resolve(nsfwPath, "lgbt_gay"),
                resolve(nsfwPath, "body-parts_lower-body_genitalia_penis"),
                resolve(nsfwPath, "body-parts_lower-body_genitalia_penis_large"),
                resolve(nsfwPath, "body-parts_lower-body_genitalia_penis_small")
            ]
        }],
        ["female", {
            condition: ["female", "pussy", "ass", "asshole", "vulva", "breast", "breasts", "lon", "loz", "dit", "mong", "gai", "phu nu", "vu", "veu"],
            exception: ["lộn", "vụ", "móng", "vù"],
            path: [
                resolve(nsfwPath, "body-parts_lower-body_genitalia_vulva"),
                resolve(nsfwPath, "body-parts_lower-body_genitalia_vulva_hair"),
                resolve(nsfwPath, "body-parts_lower-body_genitalia_vulva_labia"),
                resolve(nsfwPath, "body-parts_upper-body_breasts"),
                resolve(nsfwPath, "body-parts_upper-body_breasts_from-an-angle"),
                resolve(nsfwPath, "body-parts_upper-body_breasts_implants"),
                resolve(nsfwPath, "body-parts_upper-body_breasts_large"),
                resolve(nsfwPath, "body-parts_upper-body_breasts_nipples"),
                resolve(nsfwPath, "body-parts_upper-body_breasts_small"),
                resolve(nsfwPath, "lgbt_lesbian"),
                resolve(nsfwPath, "sex_anal"),
                resolve(nsfwPath, "sex_breasts")
            ]
        }],
        ["teen", {
            condition: ["teen", "young", "child", "tre", "nhoc"],
            exception: [],
            path: [
                resolve(nsfwPath, "age_college"),
                resolve(nsfwPath, "age_milf"),
                resolve(nsfwPath, "age_teen")
            ]
        }],
        ["amateur", {
            condition: ["amateur", "adult", "nguoi lon", "truong thanh"],
            exception: [],
            path: [
                resolve(nsfwPath, "amateur"),
                resolve(nsfwPath, "amateur_self-shots"),
                resolve(nsfwPath, "age_mature")
            ]
        }],
        ["underwear", {
            condition: ["underwear", "panties", "quan xi", "xi lip", "noi y"],
            exception: [],
            path: [
                resolve(nsfwPath, "appearance_clothing_underwear"),
                resolve(nsfwPath, "appearance_clothing_underwear_panties"),
                resolve(nsfwPath, "appearance_clothing_underwear_thongs")
            ]
        }],
        ["uniform", {
            condition: ["uniform", "dong phuc"],
            exception: [],
            path: [
                resolve(nsfwPath, "appearance_clothing_uniforms-outfits"),
                resolve(nsfwPath, "appearance_clothing_uniforms-outfits_cosplay")
            ]
        }],
        ["artificial", {
            condition: ["artificial", "hoat hinh", "comic", "hentai"],
            exception: [],
            path: [
                resolve(nsfwPath, "artificial-images"),
                resolve(nsfwPath, "artificial-images_fictional-characters-shows"),
                resolve(nsfwPath, "artificial-images_hentai"),
                resolve(nsfwPath, "artificial-images_photoshop")
            ]
        }],
        ["cum", {
            condition: ["cum", "tinh", "ban", "xuat"],
            exception: ["tính", "cúm", "bạn", "bán"],
            path: [
                resolve(nsfwPath, "cum-play_cum"),
                resolve(nsfwPath, "cum-play_cum_creampie"),
                resolve(nsfwPath, "cum-play_cum_cum-shot"),
                resolve(nsfwPath, "cum-play_cum_cum-shot_bukkake"),
                resolve(nsfwPath, "cum-play_cum_cum-shot_facial"),
                resolve(nsfwPath, "cum-play_cum_swallowing"),
                resolve(nsfwPath, "cum-play_female")
            ]
        }],
        ["asian", {
            condition: ["asian", "yellow", "chau a", "vang"],
            exception: ["vâng"],
            path: [
                resolve(nsfwPath, "ethnicity_asian"),
                resolve(nsfwPath, "ethnicity_japanese")
            ]
        }],
        ["africa", {
            condition: ["africa", "black", "chau phi", "den"],
            exception: ["đến", "đền"],
            path: [
                resolve(nsfwPath, "ethnicity_black"),
                resolve(nsfwPath, "ethnicity_indian")
            ]
        }],
        ["europe", {
            condition: ["europe", "euro", "white", "chau au", "chau mi", "chau my", "trang"],
            exception: [],
            path: [
                resolve(nsfwPath, "ethnicity_euro")
            ]
        }],
        ["bdsm", {
            condition: ["bdsm", "bao dam"],
            exception: [],
            path: [
                resolve(nsfwPath, "fetish_bdsm"),
                resolve(nsfwPath, "fetish_bdsm_bondage"),
                resolve(nsfwPath, "fetish_bdsm_domination-&-submission"),
                resolve(nsfwPath, "fetish_bdsm_domination-&-submission_femdom")
            ]
        }],
        ["lgbt", {
            condition: ["lgbt", "lau ga binh thanh"],
            exception: [],
            path: [
                resolve(nsfwPath, "lgbt_bisexual"),
                resolve(nsfwPath, "lgbt_crossdressing"),
                resolve(nsfwPath, "lgbt_gay"),
                resolve(nsfwPath, "lgbt_lesbian"),
                resolve(nsfwPath, "lgbt_transgender"),
                resolve(nsfwPath, "lgbt_transsexual")
            ]
        }],
        ["group", {
            condition: ["group", "tap the", "threesomes", "threesome", "foursomes", "foursome", "fivesomes", "fivesome"],
            exception: [],
            path: [
                resolve(nsfwPath, "sex_group"),
                resolve(nsfwPath, "sex_group_large-group"),
                resolve(nsfwPath, "sex_group_swinging"),
                resolve(nsfwPath, "sex_group_threesome")
            ]
        }],
        ["masturbation", {
            condition: ["masturbation", "masturbate", "thu dam", "thudam", "suc", "succac", "moclon", "mocloz"],
            exception: [],
            path: [
                resolve(nsfwPath, "sex_masturbation"),
                resolve(nsfwPath, "sex_toys")
            ]
        }]
    ]);
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
        "Porn cái lòn j v 🙂, xem này đỡ nứng đi",
        "Thể loại cak j v, t đ có 🙂, xem đỡ đi",
        "M pỏn casiloz j v? T đ có the loại đó 🙂, xem đỡ",
        "Bố đéo có thể loại đó, xem đỡ này cho bớt nứng"
    ];
    const outPermissionSentences = [
        "M đ co quyền dùng lệnh 😏",
        "Tuổi cặc dùng lệnh này 😏",
        "M đéo p anh Quân, cúc 😏",
        "Kêu cmm a\nTuoi lon dug lệnh này",
        "Tuoi lon sai tao\nM đ có quyền dùng lenh này 😏",
        "Tủi cawk sai t làm lệnh này 😏",
        "Tuổi lồn dùng lệnh? Cút hộ"
    ];

    try {

        const search = args.join(" ");

        if (search == "") {
            const categoryPath = fs.readdirSync(nsfwPath)[random(0, fs.readdirSync(nsfwPath).length)];
            const directoriesArray = fs.readdirSync(resolve(nsfwPath, categoryPath));
            
            while (true) {
                const imagesArray = fs.readFileSync(resolve(nsfwPath, categoryPath, directoriesArray[random(0, directoriesArray.length)]), "utf8").split("\n");
                const imageUrl = imagesArray[random(0, imagesArray.length)].replace(/['"]+/g, "");
                const status = await checkSendImage(imageUrl);

                if (status) break;
            }
        }
        else {
            const categoriesCondition = [];
            const categoriesException = [];
            categories.forEach(categoryData => categoryData.condition.forEach(condition => categoriesCondition.push(condition) ));
            categories.forEach(categoryData => categoryData.exception.forEach(exception => categoriesException.push(exception) ));
            
            if (checkMessage(search, ["help", "data", "list", "danh sach", "noi dung", "the loai"])) {
                let dataSource = [ "-" ];
                let categoriesIndex = 1;
                categories.forEach((categoryData, categoryName) => {
                    let categoryImages = 0;
                    categoryData.path.forEach(path => {
                        fs.readdirSync(path).forEach(directory => {
                            fs.readFileSync(resolve(path, directory), "utf8").split("\n").forEach(() => {
                                categoryImages++;
                            })
                        })
                    });
                    
                    const dataObject = {
                        num: new Intl.NumberFormat("en-US", { minimumIntegerDigits: 2 }).format(categoriesIndex),
                        name: categoryName.toUpperCase(),
                        condition: "[ " + categoryData.condition.join(" / ") + " ]",
                        quantity: categoryImages.toLocaleString('vi-VN').replace(/\./, " ")
                    };
                    
                    categoriesIndex++;
                    dataSource.push(dataObject);
                });

                registerFont(resolve(process.cwd(), "assets", "fonts", "Quicksand-Medium.ttf"), { family: "Quicksand" });
                const renderTable = TableRenderer({ paddingHorizontal: 30, paddingVertical: 30, titleSpacing: 20, fontFamily: "Quicksand" }).render;
                const canvasTable = renderTable({
                    title: "DANH SÁCH CÁC THỂ LOẠI KHIÊU DÂM - PORN",
                    titleStyle: {
                        font: "normal 30px bungee",
                        fillStyle: "#30343f"
                    },
                    columns: [
                        { width: 75, title: "STT", dataIndex: "num" },
                        { width: 200, title: "TÊN THỂ LOẠI", dataIndex: "name" },
                        { width: 900, title: "CÚ PHÁP", dataIndex: "condition" },
                        { width: 100, title: "SỐ LƯỢNG", dataIndex: "quantity" },
                    ],
                    dataSource: dataSource
                });

                await saveImage(canvasTable, resolve(cachesPath, "pornCategoriesTable.png"));
        
                message.reply({ attachment: fs.createReadStream(resolve(cachesPath, "pornCategoriesTable.png")) });
                message.react("🔹");
            }

            else if (checkMessage(search, ["ultimate", "unlimited", "unlimit", "toi chet", "toi chan", "vinh vien"])) {
                if (senderID != adminID) {
                    message.react("🚫");
                    message.reply(outPermissionSentences[random(0, outPermissionSentences.length)]);
                    return;
                }
                
                const pornInterval = setInterval(async () => {
                    const categoryPath = fs.readdirSync(nsfwPath)[random(0, fs.readdirSync(nsfwPath).length)];
                    const directoriesArray = fs.readdirSync(resolve(nsfwPath, categoryPath));
                    
                    while (true) {
                        const imagesArray = fs.readFileSync(resolve(nsfwPath, categoryPath, directoriesArray[random(0, directoriesArray.length)]), "utf8").split("\n");
                        const imageUrl = imagesArray[random(0, imagesArray.length)].replace(/['"]+/g, "");
                        const status = await checkSendImage(imageUrl);

                        if (status) break;
                    }
                }, 1500);

                setTimeout(() => { 
                    clearInterval(pornInterval);
                    message.react("🔹");
                }, 60000);
            }

            else if (checkMessage(search, categoriesCondition, categoriesException)) {
                categories.forEach(async (categoryData) => {
                    if (checkMessage(search, categoryData.condition, categoryData.exception)) {
                        const path = categoryData.path[random(0, categoryData.path.length)];
                        const directoriesArray = fs.readdirSync(path);
    
                        while (true) {
                            const imagesArray = fs.readFileSync(resolve(path, directoriesArray[random(0, directoriesArray.length)]), "utf8").split("\n");
                            const imageUrl = imagesArray[random(0, imagesArray.length)].replace(/['"]+/g, "");
                            const status = await checkSendImage(imageUrl);

                            if (status) break;
                        }
                    }
                });
            }

            else {
                message.reply(notFoundSentences[random(0, notFoundSentences.length)]);

                const categoryPath = fs.readdirSync(nsfwPath)[random(0, fs.readdirSync(nsfwPath).length)];
                const directoriesArray = fs.readdirSync(resolve(nsfwPath, categoryPath));
                
                while (true) {
                    const imagesArray = fs.readFileSync(resolve(nsfwPath, categoryPath, directoriesArray[random(0, directoriesArray.length)]), "utf8").split("\n");
                    const imageUrl = imagesArray[random(0, imagesArray.length)].replace(/['"]+/g, "");
                    const status = await checkSendImage(imageUrl);

                    if (status) break;
                }
            }
        }
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