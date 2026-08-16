/* ----------------------------------------
    < COMMAND > --- < LOG USERS INFO >
----------------------------------------- */

// ----- < [ KHAI BÁO ] - REQUIRE MODULE CẦN THIẾT > ----- //
const fs = require("fs");
const { resolve } = require("path");
const { registerFont } = require("canvas");
const { saveImage } = require("table-renderer");
const TableRenderer = require("table-renderer").default;

// ----- < [ CONFIG ] - THÔNG TIN VỀ LỆNH > ----- //
const config = {
    name: "logUsersInfo",
    description: "Lệnh xuất thông tin người dùng.",
    type: "admin",
    usage: "/kiki logUsersInfo",
    condition: ["logusersinfo", "logusers", "lui"],
    exception: ["lụi", "lùi", "lủi"],
    permission: 1,
    priority: 3
}

// ----- < [ HÀM ] - XỬ LÍ LỆNH > ----- //
async function onCall({ message }) {
    await message.react("⏱");

    const { usersInfo, assetsPath, cachesPath } = global;
    const { random } = global.function;
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

        const dataSource = [ "-" ];
        Object.keys(usersInfo).forEach((key, index) => {
            const dataObject = {
                num: new Intl.NumberFormat("en-US", { minimumIntegerDigits: 2 }).format(index + 1),
                id: key,
                name: usersInfo[key].fullName,
                gender: usersInfo[key].gender,
                rank: usersInfo[key].rank,
                money: (usersInfo[key].money == 0) ? "0" : usersInfo[key].money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
            };

            dataSource.push(dataObject);
        });

        const renderTable = TableRenderer({ paddingHorizontal: 30, paddingVertical: 30, titleSpacing: 20, fontFamily: "Quicksand" }).render;
        const canvasTable = renderTable({
            title: "DANH SÁCH THÔNG TIN NGƯỜI DÙNG",
            titleStyle: {
                font: "normal 30px Bungee",
                fillStyle: "#30343f"
            },
            columns: [
                { width: 75, title: "STT", dataIndex: "num" },
                { width: 200, title: "ID NGƯỜI DÙNG", dataIndex: "id" },
                { width: 300, title: "TÊN NGƯỜI DÙNG", dataIndex: "name" },
                { width: 150, title: "GIỚI TÍNH", dataIndex: "gender" },
                { width: 150, title: "QUYỀN HẠN", dataIndex: "rank" },
                { width: 200, title: "SỐ DƯ", dataIndex: "money" }
            ],
            dataSource: dataSource
        });

        await saveImage(canvasTable, resolve(cachesPath, "usersInfoTable.png"));
        
        message.reply({ attachment: fs.createReadStream(resolve(cachesPath, "usersInfoTable.png")) });
        message.react("🔹");
    } catch(error) {
        message.react("⭕️");
        message.reply(errorSentences[random(0, errorSentences.length)])
    }
}

// ----- < [ EXPORT ] - XUẤT MODULE > ----- //
module.exports = {
    config,
    onCall
}