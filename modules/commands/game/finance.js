/* -------------------------------
    < COMMAND > --- < FINANCE >
-------------------------------- */

// ----- < [ KHAI BÁO ] - REQUIRE MODULE CẦN THIẾT > ----- //
const fs = require("fs");
const { resolve } = require("path");
const { registerFont } = require("canvas");
const { saveImage } = require("table-renderer");
const TableRenderer = require("table-renderer").default;

// ----- < [ CONFIG ] - THÔNG TIN VỀ LỆNH > ----- //
const config = {
    name: "finance",
    description: "Lệnh mô phỏng chứng khoán.",
    type: "game",
    usage: "/kiki finance [ COMMAND ]",
    condition: ["finance", "invest", "stock", "stocks", "chung khoan", "chk", "ck"],
    exception: [],
    permission: 0,
    priority: 2
};

// ----- < [ HÀM ] - XỬ LÍ LỆNH > ----- //
async function onCall({ message, args }) {
    await message.react("⏱");

    const { senderID } = message;
    const { usersInfo, cachesPath } = global;
    const { stocksCode, stocksInfo } = global.gamesInfo.finance;
    const { random, checkMessage, updateUsersInfo } = global.function;
    const errorSentences = [
        "Lỗi r, thg ad đâu lo đi fix đi 🙂",
        "Lỗi cmnr thử lại đi 🙂",
        "Lỗi r tại m đó, thử lại đi",
        "Ăn ở cak j mà lỗi r, thử lại đi 🙂",
        "Thử lại đi lỗi cmnr 🙂",
        "Djt cụ m lỗi r, thử lại xem",
        "Lỗi r , có cái lệnh cx k xog 🙂"
    ];
    const notEnoughCommandSentences = ["Cú pháp cặc j đấy?", "M làm con mẹ j v 🙂", "Đ biết dùng lệnh à?", "Oclon này dùng lệnh kiểu cặc j v 🙂s", "M xài lệnh đ j đấy 🙂?"];
    const emptyStocksWalletSentences = ["Ví rỗng, đúng đói nghèo rách!!", "Đ có con cặc j đâu mà xem ví 🙂", "Có cái đụ đĩ mẹ m trong ví nè 🙂", "Đúng đỗ nghèo khỉ, chả có vẹo j trong ví chứng khoán 🙂", "Chả có cặc j mà tìm, rách!"];
    const notEnoughtMoneySentences = ["Rách! Đéo đủ tiền mua 🙂", "Đỗ nghèo khỉ, m đéo ddu tiền để muaa 🙂", "Rách vcl, đ đủ tiền mua 😏", "Nghèo cúc, đ đủ tiền mua 🙂", "Đcm mua cái lon, m đ đủ mua 🙂🙂"];
    const notFoundStockSentences = ["Mã chứng khoán đéo tồn tại 🙂", "Mã lồn j v, ngu à 🙂?", "M kiếm mã chứng khoán đéo j v 🙂", "Lm đéo j có mã chứng khoán này 🙂!", "Mã cặc j đấy? Lm đ j có 🙂🙂"];
    const notHasStockSentences = ["M làm mẹ j có mà bán ?", "Có đéo đâu, bán clj", "Nghèo rách như m có cái đếch j mà bán?", "Đúng đói nghèo hèn luôn, đ có còn đòi bán 🙂", "Rách vl, có đ đâu mà bán 🙂"];
    const overQuantityStockSentences = ["Lafm đ j đủ mà bán ?", "Bán condime m hay j, còn đủ đ đâu 🙂", "Đ còn đủ cho m bán 🙂", "Bán mẹ j nhiều v, còn đéo 🙂", "Còn đủ cho m bán nhiêu đó đéo ?"];
    const quantityErrorSentences = ["Số lượng đéo j v 🙂", "Ngu à, nhập số lượng cặc j đấy 🙂?", "M bị occho à, số đ j v 🙂", "Não cặc chắc?, số lồn j đâu 🙂!", "Số lượng? Bị ngu à 🙂🙂"];
    const buyNotificateSentences = (stocks, quantity, price) => {
        return [
            `M đã thu mua thành công ${quantity} cổ phần: ${stocks.join(", ")}\n- Tổng giá trị: ${price}`,
            `M đã mua vafo ${quantity} cổ phieu: ${stocks.join(", ")}\n- Tổng giá trị: ${price}`,
            `M vừa mới mua ${quantity} cổ phiếu: ${stocks.join(", ")}\n- Tổng giá trị: ${price}`,
            `Sv này vừa ms mua vô ${quantity} cổ phiếu của: ${stocks.join(", ")}\n- Tổng giá trị: ${price}`,
            `Occho này đã thu mua ${quantity} cổ phần: ${stocks.join(", ")}\n- Tổng giá trị: ${price}`
        ];
    };
    const sellNotificateSentences = (stocks, quantity, price, change) => {
        return [
            `M đã bán thành công ${quantity} cổ phần: ${stocks.join(", ")}\n- Tổng giá trị: ${price}\n- Lãi / Lỗ: ${change > 0 ? "+" + change : change}`,
            `M đã bán ${quantity} cổ phieu: ${stocks.join(", ")}\n- Tổng giá trị: ${price}\n- Lãi / Lỗ: ${change > 0 ? "+" + change : change}`,
            `M vừa mới bán ${quantity} cổ phiếu: ${stocks.join(", ")}\n- Tổng giá trị: ${price}\n- Lãi / Lỗ: ${change > 0 ? "+" + change : change}`,
            `Sv này vừa ms bán ${quantity} cổ phiếu của: ${stocks.join(", ")}\n- Tổng giá trị: ${price}\n- Lãi / Lỗ: ${change > 0 ? "+" + change : change}`,
            `Occho này đã bán ${quantity} cổ phần: ${stocks.join(", ")}\n- Tổng giá trị: ${price}\n- Lãi / Lỗ: ${change > 0 ? "+" + change : change}`
        ];
    };

    try {
        registerFont(resolve(assetsPath, "fonts", "Quicksand-Medium.ttf"), { family: "Quicksand" });
        registerFont(resolve(assetsPath, "fonts", "Bungee-Regular.ttf"), { family: "Bungee" });
        const stocksWallet = usersInfo[senderID].inventory.hasOwnProperty("stocks")
            ? Object.keys(usersInfo[senderID].inventory.stocks)
                  .filter((stock) => usersInfo[senderID].inventory.stocks[stock].quantity > 0)
                  .reduce((object, current) => ((object[current] = usersInfo[senderID].inventory.stocks[current]), object), {})
            : {};

        if (args.length == 0) {
            const dataSource = ["-"];

            if (Object.keys(stocksWallet).length <= 0) {
                message.react("⭕️");
                message.reply(emptyStocksWalletSentences[random(0, emptyStocksWalletSentences.length)]);
                return;
            }

            Object.keys(stocksWallet).forEach((stock, index) => {
                const profit = parseInt(((stocksInfo[stock][0].close - stocksWallet[stock].buyPrice) * stocksWallet[stock].quantity).toFixed());
                const dataObject = {
                    num: new Intl.NumberFormat("en-US", { minimumIntegerDigits: 2 }).format(index + 1),
                    stock: stock,
                    quantity: stocksWallet[stock].quantity.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "),
                    buyPrice: stocksWallet[stock].buyPrice
                        .toFixed(2)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, " "),
                    currentPrice: stocksInfo[stock][0].close
                        .toFixed(2)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, " "),
                    profit:
                        profit > 0
                            ? "+ " + profit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                            : profit
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                                  .replace("-", "- ")
                };

                dataSource.push(dataObject);
            });

            const renderTable = TableRenderer({ paddingHorizontal: 30, paddingVertical: 30, titleSpacing: 20, fontFamily: "Quicksand" }).render;
            const canvasTable = renderTable({
                title: `VÍ CHỨNG KHOẢN - ${usersInfo[senderID].fullName}`,
                titleStyle: {
                    font: "normal 30px Bungee",
                    fillStyle: "#30343f"
                },
                columns: [
                    { width: 75, title: "STT", dataIndex: "num" },
                    { width: 150, title: "MÃ CK", dataIndex: "stock" },
                    { width: 200, title: "SỐ LƯỢNG", dataIndex: "quantity" },
                    { width: 200, title: "GIÁ MUA", dataIndex: "buyPrice" },
                    { width: 200, title: "GIÁ HIỆN TẠI", dataIndex: "currentPrice" },
                    { width: 200, title: "LỜI / LỖ", dataIndex: "profit" }
                ],
                dataSource: dataSource
            });

            await saveImage(canvasTable, resolve(cachesPath, "userFinanceWallet.png"));
            message.reply({ attachment: fs.createReadStream(resolve(cachesPath, "userFinanceWallet.png")) });
            message.react("🔹");
            return;
        }

        if (checkMessage(args[0], ["list", "menu", "danh sach"])) {
            const dataSource = ["-"];

            Object.keys(stocksInfo).forEach((stock, index) => {
                const dataObject = {
                    num: new Intl.NumberFormat("en-US", { minimumIntegerDigits: 2 }).format(index + 1),
                    stock: stock,
                    openPrice: stocksInfo[stock][0].open
                        .toFixed(2)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, " "),
                    closePrice: stocksInfo[stock][0].close
                        .toFixed(2)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, " "),
                    highPrice: stocksInfo[stock][0].high
                        .toFixed(2)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, " "),
                    lowPrice: stocksInfo[stock][0].low
                        .toFixed(2)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, " "),
                    volume: stocksInfo[stock][0].volume.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                };

                dataSource.push(dataObject);
            });

            const renderTable = TableRenderer({ paddingHorizontal: 30, paddingVertical: 30, titleSpacing: 20, fontFamily: "Quicksand" }).render;
            const canvasTable = renderTable({
                title: "DANH SÁCH MÃ CHỨNG KHOÁN",
                titleStyle: {
                    font: "normal 30px Bungee",
                    fillStyle: "#30343f"
                },
                columns: [
                    { width: 75, title: "STT", dataIndex: "num" },
                    { width: 150, title: "MÃ CK", dataIndex: "stock" },
                    { width: 150, title: "GIÁ MỞ CỬA", dataIndex: "openPrice" },
                    { width: 150, title: "GIÁ ĐÓNG CỬA", dataIndex: "closePrice" },
                    { width: 150, title: "GIÁ CAO NHẤT", dataIndex: "highPrice" },
                    { width: 150, title: "GIÁ THẤP NHẤT", dataIndex: "lowPrice" },
                    { width: 200, title: "KHỐI LƯỢNG GD", dataIndex: "volume" }
                ],
                dataSource: dataSource
            });

            await saveImage(canvasTable, resolve(cachesPath, "stocksFinance.png"));
            message.reply({ attachment: fs.createReadStream(resolve(cachesPath, "stocksFinance.png")) });
            message.react("🔹");
            return;
        }

        if (args.length > 2) {
            const command = args.shift();
            const quantity = parseInt(args.pop());
            const requireStocksCode = args.map((element) => element.toUpperCase());

            if (requireStocksCode.map((stock) => stocksCode.includes(stock)).includes(false)) {
                message.react("⭕️");
                message.reply(notFoundStockSentences[random(0, notFoundStockSentences.length)]);
                return;
            }

            if (isNaN(quantity) || quantity <= 0) {
                message.react("⭕️");
                message.reply(quantityErrorSentences[random(0, quantityErrorSentences.length)]);
                return;
            }

            const stocksTotalPrice = requireStocksCode.reduce((total, current) => (total += stocksInfo[current][0].close), 0) * quantity;

            if (checkMessage(command, ["mua", "muaa", "buy", "buyy", "get"])) {
                if (stocksTotalPrice > usersInfo[senderID].money) {
                    message.react("⭕️");
                    message.reply(notEnoughtMoneySentences[random(0, notEnoughtMoneySentences.length)]);
                    return;
                }

                if (!usersInfo[senderID].inventory.hasOwnProperty("stocks")) usersInfo[senderID].inventory.stocks = {};

                usersInfo[senderID].money -= parseInt(stocksTotalPrice.toFixed());
                requireStocksCode.forEach((stock) => {
                    usersInfo[senderID].inventory.stocks[stock] = {
                        quantity: stocksWallet.hasOwnProperty(stock) ? stocksWallet[stock].quantity + quantity : quantity,
                        buyPrice: stocksWallet.hasOwnProperty(stock)
                            ? parseFloat(((stocksWallet[stock].quantity * stocksWallet[stock].buyPrice + quantity * stocksInfo[stock][0].close) / (stocksWallet[stock].quantity + quantity)).toFixed(2))
                            : parseFloat(stocksInfo[stock][0].close.toFixed(2))
                    };
                });

                updateUsersInfo(usersInfo);
                message.reply(buyNotificateSentences(requireStocksCode, quantity, stocksTotalPrice.toFixed())[random(0, buyNotificateSentences(requireStocksCode, quantity, stocksTotalPrice.toFixed()).length)]);
                message.react("🔹");
            }

            if (checkMessage(command, ["ban", "bann", "sell", "sold"])) {
                const stocksTotalBuyPrice = requireStocksCode.reduce((total, current) => (total += usersInfo[senderID].inventory.stocks[current].buyPrice), 0) * quantity;

                if (requireStocksCode.map((stock) => Object.keys(stocksWallet).includes(stock)).includes(false)) {
                    message.react("⭕️");
                    message.reply(notHasStockSentences[random(0, notHasStockSentences.length)]);
                    return;
                }

                if (requireStocksCode.map((stock) => stocksWallet[stock].quantity >= quantity).includes(false)) {
                    message.react("⭕️");
                    message.reply(overQuantityStockSentences[random(0, overQuantityStockSentences.length)]);
                    return;
                }

                usersInfo[senderID].money += parseInt(stocksTotalPrice.toFixed());
                requireStocksCode.forEach((stock) => {
                    usersInfo[senderID].inventory.stocks[stock].quantity -= quantity;
                });

                updateUsersInfo(usersInfo);
                message.reply(
                    sellNotificateSentences(requireStocksCode, quantity, stocksTotalPrice.toFixed(), parseInt((stocksTotalPrice - stocksTotalBuyPrice).toFixed()))[
                        random(0, sellNotificateSentences(requireStocksCode, quantity, stocksTotalPrice.toFixed(), parseInt((stocksTotalPrice - stocksTotalBuyPrice).toFixed())).length)
                    ]
                );
                message.react("🔹");
            }
            return;
        }

        message.react("⭕️");
        message.reply(notEnoughCommandSentences[random(0, notEnoughCommandSentences.length)]);
    } catch (error) {
        console.log(error);
        message.react("⭕️");
        message.reply(errorSentences[random(0, errorSentences.length)]);
    }
}

// ----- < [ EXPORT ] - XUẤT MODULE > ----- //
module.exports = {
    config,
    onCall
};
