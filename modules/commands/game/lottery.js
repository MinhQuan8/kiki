/* -------------------------------
    < COMMAND > --- < LOTTERY >
-------------------------------- */

// ----- < [ KHAI BÁO ] - REQUIRE MODULE CẦN THIẾT > ----- //
const fs = require("fs");
const { resolve } = require("path");
const { saveImage } = require("table-renderer");
const TableRenderer = require("table-renderer").default;
const { createCanvas, loadImage, registerFont } = require("canvas");
const moment = require("moment-timezone");

// ----- < [ CONFIG ] - THÔNG TIN VỀ LỆNH > ----- //
const config = {
    name: "lottery",
    description: "Lệnh mô phỏng vé số.",
    type: "game",
    usage: "/kiki lottery [ COMMAND ]",
    condition: ["lottery", "ve so", "xo so", "ltr"],
    exception: [],
    permission: 0,
    priority: 2
}

// ----- < [ HÀM ] - XỬ LÍ LỆNH > ----- //
async function onCall({ message, args }) {
    await message.react("⏱");
    
    const { senderID } = message;
    const { usersInfo, cachesPath } = global;
    const { random, checkMessage, updateUsersInfo, setGamesInfo, readGamesInfo } = global.function;
    const errorSentences = [
        "Lỗi r, thg ad đâu lo đi fix đi 🙂",
        "Lỗi cmnr thử lại đi 🙂",
        "Lỗi r tại m đó, thử lại đi",
        "Ăn ở cak j mà lỗi r, thử lại đi 🙂",
        "Thử lại đi lỗi cmnr 🙂",
        "Djt cụ m lỗi r, thử lại xem",
        "Lỗi r , có cái lệnh cx k xog 🙂"
    ];
    const notEnoughCommandSentences = [
        "Cú pháp cặc j đấy?",
        "M làm con mẹ j v 🙂",
        "Đ biết dùng lệnh à?",
        "Oclon này dùng lệnh kiểu cặc j v 🙂s",
        "M xài lệnh đ j đấy 🙂?"
    ];
    const emptyLotteriesWalletSentences = [
        "Đ có vé số, đúng đói nghèo rách!!",
        "Đ có con cặc j đâu mà xem 🙂",
        "Có cái đụ đĩ mẹ m trong ví nè 🙂",
        "Đúng đỗ nghèo khỉ, chả có tờ vé số nào 🙂",
        "Chả có cặc j mà tìm, rách!"
    ];
    const notEnoughtMoneySentences = [
        "Rách! Đéo đủ tiền mua 🙂",
        "Đỗ nghèo khỉ, m đéo ddu tiền để muaa 🙂",
        "Rách vcl, đ đủ tiền mua 😏",
        "Nghèo cúc, đ đủ tiền mua 🙂",
        "Đcm mua cái lon, m đ đủ mua 🙂🙂"
    ];
    const invalidLotterySentences = [
        "Mã vé số cajwcj đấy 🙂",
        "Chỉ 6 số thoi, ngu à 🙂?",
        "M mua vé cặc j v 🙂",
        "Lm đéo j có mã vé số nào như này 🙂!",
        "Bị nguu à, có ai mua vé số như m k? 🙂🙂"
    ];
    const notHasLotterySentences = [
        "M làm mẹ j có mà nhận giải ?",
        "Có đéo đâu, đổi giải clj",
        "Nghèo rách như m có cái đếch j mà đòi nhận giải?",
        "Có cái lồn mà nhận giải 🙂",
        "Rách vl, có ccawc j đâu mà cx đi đổi giải 🙂"
    ];
    const notWinLotterySentences = [
        "Trúng đ đây cx đòi đổi 🙂",
        "Trúng cái lồn mẹ m nè ?",
        "Có cc mà trúng giải 🙂",
        "Đuma đ trúng cx đi đổi, rách vl",
        "Trúng ccj đâu mà đổi 🙂"
    ];
    const overWinLotterySentences = [
        "Quá hạn cx đòi đổi 🙂",
        "Quá hạn r thg ngu =)))) ?",
        "Vé số hét hạn cmnr 🙂",
        "Vé quá hạn r con",
        "Quá hạn r, đổi cl 🙂"
    ];
    const overQuantityLotterySentences = [
        "Lafm đ j đủ mà đổi giải ?",
        "Bán condime m hay j, có đủ đ đâu 🙂",
        "Đ còn đủ nhiêu đó tờ cho m nhận giải 🙂",
        "Đổi mẹ j nhiều v, có đủ đéo 🙂",
        "Có đủ cho m đổi nhiêu đó đéo ?"
    ];
    const quantityErrorSentences = [
        "Số lượng đéo j v 🙂",
        "Ngu à, nhập số lượng cặc j đấy 🙂?",
        "M bị occho à, số đ j v 🙂",
        "Não cặc chắc?, số lồn j đâu 🙂!",
        "Số lượng? Bị ngu à 🙂🙂"
    ];
    const buyNotificateSentences = (lotteries, quantity, price) => {
        return [
            `M đã mua thành công ${quantity} vé: ${lotteries.join(", ")}\n- Tổng giá trị: ${price}`,
            `M đã mua vafo ${quantity} tờ: ${lotteries.join(", ")}\n- Tổng giá trị: ${price}`,
            `M vừa mới mua ${quantity} tờ vé số: ${lotteries.join(", ")}\n- Tổng giá trị: ${price}`,
            `Sv này vừa ms mua vô ${quantity} vé: ${lotteries.join(", ")}\n- Tổng giá trị: ${price}`,
            `Occho này đã mua ${quantity} tờ vé số: ${lotteries.join(", ")}\n- Tổng giá trị: ${price}`
        ]
    };
    const claimNotificateSentences = (lotteries, quantity, value) => {
        return [
            `M đã đổi giải thành công ${quantity} vé: ${lotteries.join(", ")}\n- Tổng giá trị: ${value}`,
            `M đã nhận giải ${quantity} tờ: ${lotteries.join(", ")}\n- Tổng giá trị: ${value}`,
            `M vừa đổi giải ${quantity} tờ vé số: ${lotteries.join(", ")}\n- Tổng giá trị: ${value}`,
            `Sv này vừa ms nhận giai ${quantity} vé số: ${lotteries.join(", ")}\n- Tổng giá trị: ${value}`,
            `Occho này đã đổi giiai ${quantity} tờ: ${lotteries.join(", ")}\n- Tổng giá trị: ${value}`
        ]
    };

    try {
        registerFont(resolve(assetsPath, "fonts", "Hatton-Bold.otf"), { family: "Hatton" });
        registerFont(resolve(assetsPath, "fonts", "Quicksand-Bold.otf"), { family: "Quicksand-Bold" });
        registerFont(resolve(assetsPath, "fonts", "Quicksand-Medium.ttf"), { family: "Quicksand" });
        registerFont(resolve(assetsPath, "fonts", "Bungee-Regular.ttf"), { family: "Bungee" });

        const lotteriesWallet = usersInfo[senderID].inventory.hasOwnProperty("lotteries") ? usersInfo[senderID].inventory.lotteries : {};
        const lotteryResult = readGamesInfo("lottery");
        const checkLotteryResult = () => {
            const lastLotteryResultDate = moment(lotteryResult.date, "HH:mm:ss - DD/MM/YYYY").add(1, "d").valueOf();
            const currentDate = moment(moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss - DD/MM/YYYY"), "HH:mm:ss - DD/MM/YYYY").valueOf();
            const generateRandomNumber = (length, quantity) => {
                const digits = "0123456789";
                let numbers = [];
                
                for (let index = 0; index < quantity; index++) {
                    let number = "";
                    for (let i = 0; i < length; i++) number += digits.charAt(Math.floor(Math.random() * digits.length));
                    numbers.push(number);
                }

                return numbers;
            }

            if (lastLotteryResultDate < currentDate) {
                lotteryResult.date = `17:00:00 - ${moment.tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY")}`,
                lotteryResult.jackpot = generateRandomNumber(6, 1),
                lotteryResult.first = generateRandomNumber(5, 1),
                lotteryResult.second = generateRandomNumber(5, 1),
                lotteryResult.third = generateRandomNumber(5, 2),
                lotteryResult.fourth = generateRandomNumber(5, 7),
                lotteryResult.fifth = generateRandomNumber(4, 1),
                lotteryResult.sixth = generateRandomNumber(4, 3),
                lotteryResult.seventh = generateRandomNumber(3, 1),
                lotteryResult.eighth = generateRandomNumber(2, 1),

                setGamesInfo("lottery", lotteryResult);           
            }
        }
        const createLotteryImage = (lottery, time, date) => {
            return new Promise(async (lotteryStream) => {
                const canvas = createCanvas(1200, 600);
                const ctx = canvas.getContext("2d");
                const background = await loadImage(resolve(assetsPath, "lottery", "lotteryBackground.png"));
                
                ctx.drawImage(background, 0, 0);
                ctx.fillStyle = "#FFFAEF";
                
                ctx.font = "normal 130px Hatton";
                ctx.fillText(lottery, 130, 480);
            
                ctx.font = "bold 30px Quicksand-Bold";
                ctx.fillText(time, 875, 420);
                
                ctx.font = "normal 30px Quicksand";
                ctx.fillText(date, 875, 460);
                
                canvas.createPNGStream().pipe(fs.createWriteStream(resolve(cachesPath, "lottery.png"))).on("finish", async () => {
                    return lotteryStream(fs.createReadStream(resolve(cachesPath, "lottery.png")));
                });
            });
        }
        const prizeInfo = {
            jackpot: { name: "Giải Đặc Biệt", value: 2000000000 },
            first: { name: "Giải Nhất", value: 30000000 },
            second: { name: "Giải Nhì", value: 15000000 },
            third: { name: "Giải Ba", value: 10000000 },
            fourth: { name: "Giải Tư", value: 3000000 },
            fifth: { name: "Giải Năm", value: 1000000 },
            sixth: { name: "Giải Sáu", value: 400000 },
            seventh: { name: "Giải Bảy", value: 200000 },
            eighth: { name: "Giải Tám", value: 100000 },
        }

        Object.keys(lotteriesWallet).forEach(lottery => {
            const lotteryDate = moment(usersInfo[senderID].inventory.lotteries[lottery].date, "HH:mm:ss - DD/MM/YYYY").valueOf();
            const expiryDate = moment.tz("Asia/Ho_Chi_Minh").subtract(2, "d").valueOf();
            if (usersInfo[senderID].inventory.lotteries[lottery].quantity <= 0 || lotteryDate < expiryDate) {
                delete lotteriesWallet[lottery];
                delete usersInfo[senderID].inventory.lotteries[lottery];
            }
        })

        if (args.length == 0) {
            const dataSource = [ "-" ];

            if (Object.keys(lotteriesWallet).length <= 0) {
                message.react("⭕️");
                message.reply(emptyLotteriesWalletSentences[random(0, emptyLotteriesWalletSentences.length)]);
                return;
            }

            Object.keys(lotteriesWallet).forEach((lottery, index) => {
                const dataObject = {
                    num: new Intl.NumberFormat("en-US", { minimumIntegerDigits: 2 }).format(index + 1),
                    lottery: lottery,
                    quantity: lotteriesWallet[lottery].quantity,
                    date: lotteriesWallet[lottery].date
                };

                dataSource.push(dataObject);
            });

            const renderTable = TableRenderer({ paddingHorizontal: 30, paddingVertical: 30, titleSpacing: 20, fontFamily: "Quicksand" }).render;
            const canvasTable = renderTable({
                title: `VÍ VÉ SỐ - ${usersInfo[senderID].fullName}`,
                titleStyle: {
                    font: "normal 30px Bungee",
                    fillStyle: "#30343f"
                },
                columns: [
                    { width: 75, title: "STT", dataIndex: "num" },
                    { width: 150, title: "MÃ VÉ SỐ", dataIndex: "lottery" },
                    { width: 150, title: "SỐ LƯỢNG", dataIndex: "quantity" },
                    { width: 200, title: "NGÀY MUA", dataIndex: "date" },
                ],
                dataSource: dataSource
            });

            await saveImage(canvasTable, resolve(cachesPath, "userLotteriesWallet.png"));
            message.reply({ attachment: fs.createReadStream(resolve(cachesPath, "userLotteriesWallet.png")) });
            message.react("🔹");
            return;
        }

        else if (checkMessage(args.join(" "), ["ket qua", "kq", "result"])) {
            checkLotteryResult();

            const dataSource = ["-"];
            Object.keys(lotteryResult).forEach(prize => {
                if (prize == "date") return;

                dataSource.push({
                    prize: prizeInfo[prize].name,
                    value: prizeInfo[prize].value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "),
                    lottery: lotteryResult[prize].join("     "),
                });
            });

            const renderTable = TableRenderer({ paddingHorizontal: 30, paddingVertical: 30, titleSpacing: 20, fontFamily: "Quicksand" }).render;
            const canvasTable = renderTable({
                title: `KẾT QUẢ XỔ SỐ - ${moment(lotteryResult.date, "HH:mm:ss - DD/MM/YYYY").format("DD/MM/YYYY")}`,
                titleStyle: {
                    font: "normal 30px Bungee",
                    fillStyle: "#30343f"
                },
                columns: [
                    { width: 175, title: "LOẠI GIẢI", dataIndex: "prize" },
                    { width: 200, title: "GIÁ TRỊ GIẢI", dataIndex: "value" },
                    { width: 500, title: "SỐ TRÚNG THƯỞNG", dataIndex: "lottery" },
                ],
                dataSource: dataSource
            });

            await saveImage(canvasTable, resolve(cachesPath, "LotteryResult.png"));
            message.reply({ attachment: fs.createReadStream(resolve(cachesPath, "LotteryResult.png")) });
            message.react("🔹");
            return;
        }

        else if (args.length > 1) {
            const command = args.shift();
            const quantity = args.length > 1 ? parseInt(args.pop()) : 1;
            const requireLotteries = args;

            if (requireLotteries.map(lottery => !isNaN(parseInt(lottery)) && lottery.length == 6).includes(false)) {
                message.react("⭕️");
                message.reply(invalidLotterySentences[random(0, invalidLotterySentences.length)]);
                return;
            }

            if (isNaN(quantity) || quantity <= 0) {
                message.react("⭕️");
                message.reply(quantityErrorSentences[random(0, quantityErrorSentences.length)]);
                return;
            }

            if (checkMessage(command, ["mua", "muaa", "buy", "buyy", "get"])) {
                const lotteriesTotalPrice = 10000 * quantity;

                if (lotteriesTotalPrice > usersInfo[senderID].money) {
                    message.react("⭕️");
                    message.reply(notEnoughtMoneySentences[random(0, notEnoughtMoneySentences.length)]);
                    return;
                }

                if (!usersInfo[senderID].inventory.hasOwnProperty("lotteries")) usersInfo[senderID].inventory.lotteries = {};
                
                usersInfo[senderID].money -= lotteriesTotalPrice;
                requireLotteries.forEach(lottery => {
                    usersInfo[senderID].inventory.lotteries[lottery] = {
                        quantity: lotteriesWallet.hasOwnProperty(lottery) ? lotteriesWallet[lottery].quantity + quantity : quantity,
                        date: moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss - DD/MM/YYYY")
                    }
                });
                
                updateUsersInfo(usersInfo);
                message.react("🔹");
                message.reply({
                    body: buyNotificateSentences(requireLotteries, quantity, lotteriesTotalPrice)[random(0, buyNotificateSentences(requireLotteries, quantity, lotteriesTotalPrice).length)],
                    attachment: await createLotteryImage(requireLotteries[0], moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss"), moment.tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY"))
                });
            }
            
            if (checkMessage(command, ["nhan", "doi giai", "claim"])) {
                if (requireLotteries.map(lottery => Object.keys(lotteriesWallet).includes(lottery)).includes(false)) {
                    message.react("⭕️");
                    message.reply(notHasLotterySentences[random(0, notHasLotterySentences.length)]);
                    return;
                }

                if (requireLotteries.map(lottery => lotteriesWallet[lottery].quantity >= quantity).includes(false)) {
                    message.react("⭕️");
                    message.reply(overQuantityLotterySentences[random(0, overQuantityLotterySentences.length)]);
                    return;
                }

                checkLotteryResult();
                const winLotteries = [];

                Object.keys(lotteryResult).forEach(prize => {
                    if (prize == "date") return;

                    lotteryResult[prize].forEach(winLottery => {
                        requireLotteries.forEach(lottery => {
                            if (lottery.endsWith(winLottery)) winLotteries.push({ lottery: lottery, value: prizeInfo[prize].value });
                        });
                    });
                });

                if (
                    winLotteries.map(winLottery => 
                        moment(lotteriesWallet[winLottery.lottery].date, "HH:mm:ss - DD/MM/YYYY").valueOf() <= moment(lotteryResult.date, "HH:mm:ss - DD/MM/YYYY").add(1, "d").valueOf() &&
                        moment(lotteriesWallet[winLottery.lottery].date, "HH:mm:ss - DD/MM/YYYY").valueOf() >= moment(lotteryResult.date, "HH:mm:ss - DD/MM/YYYY").subtract(1, "d").valueOf()
                    ).includes(false)
                ) {
                    message.react("⭕️");
                    message.reply(overWinLotterySentences[random(0, overWinLotterySentences.length)]);
                    return;
                }

                if (winLotteries.length == 0) {
                    message.react("⭕️");
                    message.reply(notWinLotterySentences[random(0, notWinLotterySentences.length)]);
                    return;
                }

                const winMoney = winLotteries.reduce((total, lottery) => total += lottery.value * quantity, 0);
                usersInfo[senderID].money += winMoney;
                requireLotteries.forEach(lottery => {
                    usersInfo[senderID].inventory.lotteries[lottery].quantity -= quantity;
                    if (usersInfo[senderID].inventory.lotteries[lottery].quantity == 0) delete usersInfo[senderID].inventory.lotteries[lottery];
                });

                updateUsersInfo(usersInfo);

                message.reply(claimNotificateSentences(requireLotteries, quantity, winMoney)[random(0, claimNotificateSentences(requireLotteries, quantity, winMoney).length)]);
                message.react("🔹");
            }
            return;
        }

        message.react("⭕️");
        message.reply(notEnoughCommandSentences[random(0, notEnoughCommandSentences.length)]);
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