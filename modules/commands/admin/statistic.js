/* --------------------------------------
    < COMMAND > --- < GAME STATISTIC >
---------------------------------------- */

// ----- < [ KHAI BÁO ] - REQUIRE MODULE CẦN THIẾT > ----- //
const fs = require("fs");
const { resolve } = require("path");
const { registerFont } = require("canvas");
const { saveImage } = require("table-renderer");
const TableRenderer = require("table-renderer").default;

// ----- < [ CONFIG ] - THÔNG TIN VỀ LỆNH > ----- //
const config = {
    name: "statistic",
    description: "Lệnh trả về thống kế số liệu các trò chơi.",
    type: "admin",
    usage: "/kiki statistic",
    condition: ["statistic", "statis", "sts", "thong ke"],
    exception: [],
    permission: 1,
    priority: 0
}

// ----- < [ HÀM ] - XỬ LÍ LỆNH > ----- //
async function onCall({ message }) {
    await message.react("⏱");

    const { usersInfo, dataPath, gamesName } = global;
    const { random } = global.function;
    const errorSentences = [
        "Lỗi r, thg ad đâu lo đi fix đi 🙂",
        "Lỗi cmnr thử lại đi 🙂",
        "Lỗi r tại m đó, thử lại đi",
        "Ăn ở cak j mà lỗi r, thử lại đi 🙂",
        "Thử lại đi lỗi cmnr 🙂",
        "Djt cụ m lỗi r, thử lại xem",
        "Lỗi r , có cái lệnh cx k xog 🙂"
    ];

    try {
        registerFont(resolve(assetsPath, "fonts", "Quicksand-Medium.ttf"), { family: "Quicksand" });
        registerFont(resolve(assetsPath, "fonts", "Bungee-Regular.ttf"), { family: "Bungee" });
        const targetIDs = Object.keys(message.mentions);
        let canvasTable;

        const gamesStatisticPath = resolve(dataPath, "gamesStatistic.json");
        const gamesStatistic = JSON.parse(fs.readFileSync(gamesStatisticPath, "utf8"));
        const renderTable = TableRenderer({ paddingHorizontal: 30, paddingVertical: 30, titleSpacing: 20, fontFamily: "Quicksand" }).render;
        const dataSource = [ "-" ];

        switch (targetIDs.length) {
            case 0:
                Object.keys(gamesStatistic).forEach((userID, index) => {
                    const dataObject = {
                        num: new Intl.NumberFormat("en-US", { minimumIntegerDigits: 2 }).format(index + 1),
                        name: usersInfo[userID].fullName,
                        money: (usersInfo[userID].money == 0) ? "0" : (usersInfo[userID].money).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "),
                        playTimes: Object.values(gamesStatistic[userID]).reduce((total, current) => total += current.playTimes, 0) || "0",
                        totalBet: Object.values(gamesStatistic[userID]).reduce((total, current) => total += current.totalBet, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") || "0",
                        totalEarn: Object.values(gamesStatistic[userID]).reduce((total, current) => total += current.totalEarn, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") || "0",
                        highestBet: Math.max(...Object.values(gamesStatistic[userID]).map(data => data.highestBet)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") || "0",
                        highestEarn: Math.max(...Object.values(gamesStatistic[userID]).map(data => data.highestEarn)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") || "0"
                    };

                    dataSource.push(dataObject);
                });

                canvasTable = renderTable({
                    title: "THỐNG KẾ SỐ LIỆU CÁC TRÒ CHƠI",
                    titleStyle: {
                        font: "normal 30px Bungee",
                        fillStyle: "#30343f"
                    },
                    columns: [
                        { width: 75, title: "STT", dataIndex: "num" },
                        { width: 300, title: "TÊN NGƯỜI DÙNG", dataIndex: "name" },
                        { width: 175, title: "SỐ DƯ", dataIndex: "money" },
                        { width: 175, title: "TỔNG SỐ LẦN CHƠI", dataIndex: "playTimes" },
                        { width: 200, title: "TỔNG SỐ TIỀN CƯỢC", dataIndex: "totalBet" },
                        { width: 200, title: "TỔNG SỐ TIỀN THẮNG", dataIndex: "totalEarn" },
                        { width: 225, title: "SỐ TIỀN CƯỢC LỚN NHẤT", dataIndex: "highestBet" },
                        { width: 225, title: "SỐ TIỀN THẮNG LỚN NHẤT", dataIndex: "highestEarn" }
                    ],
                    dataSource: dataSource
                });
            break;
            default:
                const tables = [];

                

                targetIDs.forEach(userID => {
                    let index = 4;
                    const tempDataSource = [
                        "-",
                        {
                            num: "01",
                            info: "Tổng số lần chơi",
                            data: Object.values(gamesStatistic[userID]).reduce((total, current) => total += current.playTimes, 0) || "0"
                        },
                        {
                            num: "02",
                            info: "Tổng số tiền cược",
                            data: Object.values(gamesStatistic[userID]).reduce((total, current) => total += current.totalBet, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") || "0"
                        },
                        {
                            num: "03",
                            info: "Tổng số tiền thắng",
                            data: Object.values(gamesStatistic[userID]).reduce((total, current) => total += current.totalEarn, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") || "0"
                        },
                        "-"
                    ];

                    Object.keys(gamesStatistic[userID]).forEach(game => {
                        tempDataSource.push(
                            {
                                num: new Intl.NumberFormat("en-US", { minimumIntegerDigits: 2 }).format(index++),
                                info: `Số lần chơi ${gamesName[game]}`,
                                data: gamesStatistic[userID][game].playTimes || "0"
                            },
                            {
                                num: new Intl.NumberFormat("en-US", { minimumIntegerDigits: 2 }).format(index++),
                                info: `Số lần thắng ${gamesName[game]}`,
                                data: gamesStatistic[userID][game].winCount || "0"
                            },
                            {
                                num: new Intl.NumberFormat("en-US", { minimumIntegerDigits: 2 }).format(index++),
                                info: `Số tiền cược ${gamesName[game]}`,
                                data: gamesStatistic[userID][game].totalBet.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") || "0"
                            },
                            {
                                num: new Intl.NumberFormat("en-US", { minimumIntegerDigits: 2 }).format(index++),
                                info: `Số tiền thắng ${gamesName[game]}`,
                                data: gamesStatistic[userID][game].totalEarn.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") || "0"
                            },
                            {
                                num: new Intl.NumberFormat("en-US", { minimumIntegerDigits: 2 }).format(index++),
                                info: `Số tiền cược ${gamesName[game]} lớn nhất`,
                                data: gamesStatistic[userID][game].highestBet.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") || "0"
                            },
                            {
                                num: new Intl.NumberFormat("en-US", { minimumIntegerDigits: 2 }).format(index++),
                                info: `Số tiền thắng ${gamesName[game]} lớn nhất`,
                                data: gamesStatistic[userID][game].highestEarn.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") || "0"
                            },
                            "-"
                        );
                    })

                    tables.push({
                        title: `SỐ LIỆU TRÒ CHƠI ${usersInfo[userID].fullName}`,
                        titleStyle: {
                            font: "normal 30px Bungee",
                            fillStyle: "#30343f"
                        },
                        columns: [
                            { width: 75, title: "STT", dataIndex: "num" },
                            { width: 350, title: "THÔNG TIN", dataIndex: "info" },
                            { width: 200, title: "SỐ LIỆU", dataIndex: "data" },
                        ],
                        dataSource: tempDataSource
                    });
                });

                canvasTable = renderTable(tables);
            break;
        }

        await saveImage(canvasTable, resolve(cachesPath, "usersInfoTable.png"));
        
        message.reply({ attachment: fs.createReadStream(resolve(cachesPath, "usersInfoTable.png")) });
        message.react("🔹");
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