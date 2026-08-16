/*-------------------------------
    < COMMAND > --- < HELP >
------------------------------- */

// ----- < [ KHAI BÁO ] - REQUIRE MODULE CẦN THIẾT > ----- //
const fs = require("fs");
const { resolve } = require("path");
const { registerFont } = require("canvas");
const { saveImage } = require("table-renderer");
const TableRenderer = require("table-renderer").default;

// ----- < [ CONFIG ] - THÔNG TIN VỀ LỆNH > ----- //
const config = {
    name: "help",
    description: "Lệnh xuất thông tin tất cả các lệnh.",
    type: "tool",
    usage: "/kiki help",
    condition: ["help", "helpp", "helper", "sos", "giup", "menu"],
    exception: [],
    permission: 0,
    priority: 1
}

// ----- < [ HÀM ] - XỬ LÍ LỆNH > ----- //
async function onCall({ message }) {
    await message.react("⏱");

    const { commandsConfig } = global.modules;
    const { random } = global.function;
    const rankPermission = {
        5: "ADMINISTRATOR",
        4: "ADMINISTRATOR",
        3: "ADMINISTRATOR",
        1: "MODERATOR",
        0: "USER"
    };
    const errorSentences = [
        "Đéo đc đại ka ơi :) lỗi cmnr",
        "Anh ơi em lam déo dc, bị con kac j r",
        "Loi cmnr 🙂 Ad ngu",
        "Loi roi thg ngu 🙂",
        "Anh Quan oi loi cmnr 🙂",
    ];

    try {
        registerFont(resolve(assetsPath, "fonts", "Quicksand-Medium.ttf"), { family: "Quicksand" });
        registerFont(resolve(assetsPath, "fonts", "Bungee-Regular.ttf"), { family: "Bungee" });

        let dataSource = [ "-" ], index = 1;
        new Map([...commandsConfig].sort((a, b) => b[1].permission - a[1].permission)).forEach((commandConfig) => {
            const dataObject = {
                num: new Intl.NumberFormat("en-US", { minimumIntegerDigits: 2 }).format(index),
                name: commandConfig.name,
                description: commandConfig.description,
                type: (commandConfig.type).toUpperCase(),
                permission: rankPermission[commandConfig.permission],
                usage: commandConfig.usage
            };

            dataSource.push(dataObject);
            index++;
        })

        const renderTable = TableRenderer({ paddingHorizontal: 30, paddingVertical: 30, titleSpacing: 20, fontFamily: "Quicksand" }).render;
        const canvasTable = renderTable({
            title: "DANH SÁCH VÀ CÚ PHÁP CÁC LỆNH",
            titleStyle: {
                font: "normal 30px Bungee",
                fillStyle: "#30343f"
            },
            columns: [
                { width: 75, title: "STT", dataIndex: "num" },
                { width: 150, title: "TÊN LỆNH", dataIndex: "name" },
                { width: 450, title: "MÔ TẢ", dataIndex: "description" },
                { width: 150, title: "PHÂN LOẠI", dataIndex: "type" },
                { width: 180, title: "QUYỀN HẠN", dataIndex: "permission" },
                { width: 300, title: "CÚ PHÁP", dataIndex: "usage" }
            ],
            dataSource: dataSource
        });

        await saveImage(canvasTable, resolve(cachesPath, "commandsUsage.png"));
        
        message.reply({ attachment: fs.createReadStream(resolve(cachesPath, "commandsUsage.png")) });
        message.react("🔹");
    } catch(error) {
        console.log(error)
        message.react("⭕️");
        message.reply(errorSentences[random(0, errorSentences.length)])
    }
}

// ----- < [ EXPORT ] - XUẤT MODULE > ----- //
module.exports = {
    config,
    onCall
}