/* -----------------------------
    < COMMAND > --- < BEAST >
------------------------------ */

// ----- < [ KHAI BÁO ] - REQUIRE MODULE CẦN THIẾT > ----- //
const fs = require("fs");
const { resolve } = require("path");
const moment = require("moment-timezone");
const { saveImage } = require("table-renderer");
const TableRenderer = require("table-renderer").default;
const { createCanvas, loadImage, registerFont } = require("canvas");

// ----- < [ CONFIG ] - THÔNG TIN VỀ LỆNH > ----- //
const config = {
    name: "beast",
    description: "Lệnh khởi tạo trò chơi Bầu - Cua - Tôm - Cá.",
    type: "game",
    usage: "/kiki beast",
    condition: ["beast", "bau cua", "baucua", "bc"],
    exception: [],
    permission: 3,
    priority: 0
}

// ----- < [ HÀM ] - XỬ LÍ LỆNH > ----- //
async function onCall({ message, args }) {
    await message.react("🔹");
    
    const { senderID } = message;
    const { api, usersInfo, cachesPath, assetsPath, botCall } = global;
    const { random, checkMessage, delay, updateGamesStatistic } = global.function;
    const errorSentences = [
        "Lỗi r, thg admin đâu lo đi fix đi 🙂",
        "Lỗi cmnr thử lại đi 🙂",
        "Lỗi r tại m đó, thử lại đi",
        "Ăn ở cak j mà lỗi r, thử lại đi 🙂",
        "Thử lại đi lỗi cmnr 🙂",
        "Djt cụ m lỗi r, thử lại xem",
        "anh Quaan oiw lỗi r"
    ];
    const startGameSentences = [
        "Okk, game Bầu cua bắt đầu!!",
        "Vô ván Bầu cua nha mấy đứa 😘",
        "Bắt đầu ván Bầu - Cua - Tôm - Cá ~~",
        "Vào game nè !!",
        "Lên ván Bầu Cua nè 🙂"
    ];
    const stopGameSentences = [
        "R, đã hủy game 🙂",
        "Hủy game r, kêu làm đéo j xog g đ chịu chs 🙂",
        "Gọi đã xog đ chs, đúng thg chủ sv",
        "Kêu xog đ chịu chs r hủy 🙂",
        "Hủy r đó thg sv 🙂"
    ];
    const joinIntroduceSentences = [
        "Nào chơi thì trả lời cái tin nhắn bố vừa gửi",
        "Chs thì rep cái tin nhắn t vừa ms gửi",
        "Ai vô chs thì trả lời cái tin nhắn t vừa gửi",
        "Chs thì tự giác trloi cái tin nhắn t gửi",
        "Muốn vô chs thì trl tin nhắn t vừa gửi"
    ];
    const notEnoughtMoneySentences = [
        "Rách! Đéo đủ tiền cuoc 🙂",
        "Đỗ nghèo khỉ, m đéo ddu tiền để cược 🙂",
        "Rách vcl, đ đủ tiền vô cuọcw 😏",
        "Nghèo cúc, đ đủ tiền cược 🙂",
        "Đcm cược cái lon, m đ đủ tiền 🙂🙂"
    ];
    const startBetSenteces = [
        "Đặt cược đi! trả lời tin nhắn t vừa gửi",
        "Đặt bao nhiêu, ô nào thì trả lời tin nhắn t mới gửi",
        "Trl tin nhắn t gửi để đặt cược!",
        "Đặt cược bn thì rep tin nhắn t để đặt ~",
        "Nào cược thì trl tin nhắn t vừa gửi"
    ];
    const gameOverSentences = [
        "Gamee kết thúc !!",
        "Bầu cua kết thúc r !~~",
        "Ván bầu cua đã kết thúc !",
        "Hết vánn !",
        "Hết ván bầu cuaa r ~~",
    ];
    const showSlotSentences = [
        "Khuii nè!",
        "Những ô thắng là ...",
        "Những ô thắng gồm ..",
        "Khui nè ~~",
        "các ô thắng là :"
    ];
    const errorInputSentences = [
        "Nhập cljv?",
        "Mù à? Nhập cljv 🙂",
        "Nhập đ j v, bố thg ngu 🙂",
        "Nhập ccj đấy 🙂?",
        "Ngu à? nhập cljv 🙂?"
    ];
    const noWinnerSenteces = [
        "Đéo có ai ăn tiền hết 😂!",
        "Đ nào thắng hết !!",
        "K ai ăn tiền hét 😂😂",
        "Thua hét r, bỏ cờ bạc đi nghe conn 🤪",
        "Lũ gà, thua hết cmnr 😀"
    ];
    const plusMoneyNotificateSentences = [
        "T gửi thu nhập ván vừa rồi=))",
        "Tiền kiếm được ván vừa r của tụi m!",
        "Tiền thắng ván bầu cua của bây:",
        "Tiền lụm đc từ game nãy:",
        "T gửi tiền tụi m kiếm đc từ game vừa r =)"
    ];
    const joinNotificateSentences = (playerName, index) => {
        return [
            `Chào mừng con chó ${playerName} đến vs game Bầu Cua - ${index}`,
            `${playerName} vừa vào ván bầu cu 🙂 - ${index}`,
            `Đĩ ${playerName} vừa tham gia Bầu Cua - ${index}`,
            `Concho ${playerName} đã vào game bầu cua 🙂 - ${index}`,
            `sv ${playerName} vừa gia nhập ván Bầu cua 😀 - ${index}`
        ];
    };
    const notEnoughPlayerSentences = (currentPlayer) => {
        return [
            `Thiếu người chs kìa thg lon 🙂\n Ms có ${currentPlayer} đứa`,
            `Ms có ${currentPlayer} thôi, chs thế đ nào đc?`,
            `Con thiếu ng chs, có ${currentPlayer} thằng chs kiểu loz j??`,
            `Đ thấy thiếu người à?\nMs có ${currentPlayer} đứa`,
            `Thieesu người kìa loz ngu, có mỗi ${currentPlayer} đứa 🙂`
        ];
    };
    const betNotificateSentences = (playerName) => {
        return [
            `${playerName} đã đặt cược thành công !`,
            `sv ${playerName} đã đặt cược ~~`,
            `Ocloz ${playerName} vừa đặt cược !`,
            `${playerName} vừa mới đạt cược!!`,
            `${playerName} đặt cược thành công ~!`
        ];
    };

    try {
        const beastAssetsPath = resolve(assetsPath, "beast");
        const confirmMessageID = (await message.reply("┌──── ∘°❉°∘ ────┐\n\n  🎮〡 CHƠI BẦU CUA\n\n══════════════\n  [ - 𝘙𝘦𝘱𝘭𝘺 𝘔𝘦𝘴𝘴𝘢𝘨𝘦 - ]\n\n└──── °∘❉∘° ────┘")).messageID;
        await message.send(joinIntroduceSentences[random(0, joinIntroduceSentences.length)]);

        const gameState = {
            start: false,
            over: false,

            minPlayer: 1,
            maxPlayer: 30,
            playersCount: 0,
            playersID: [],
            playersInfo: {},

            listen: false,
            listenMessageID: null,
            listenStart: false,
            listenCount: 0,

            winSlot: [],
            slotQuantity: 3,

            money: {}
        }
        
        return await new Promise(stopPromise => {
            api.listenMqtt(async (err, event) => {
                if (err) throw new Error(err);

                const processGameOverMoney = async () => {
                    // --- < IN BẢNG TIỀN THẮNG TRONG GAME > --- //
                    const dataSource = [ "-" ];
                    Object.keys(gameState.money).forEach((player, index) => {
                        const dataObject = {
                            num: new Intl.NumberFormat("en-US", { minimumIntegerDigits: 2 }).format(index + 1),
                            player: usersInfo[player].fullName,
                            money: gameState.money[player].toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                        };
            
                        global.gamesStatistic[player].beast.playTimes++;
                        global.gamesStatistic[player].beast.totalEarn += gameState.money[player];
                        global.gamesStatistic[player].beast.highestEarn = Math.max(gameState.money[player], global.gamesStatistic[player].beast.highestEarn);

                        dataSource.push(dataObject);
                    });

                    const renderTable = TableRenderer({ paddingHorizontal: 30, paddingVertical: 30, titleSpacing: 20, fontFamily: "Quicksand" }).render;
                    const canvasTable = renderTable({
                        title: "TIỀN THẮNG GAME BẦU CUA",
                        titleStyle: {
                            font: "normal 30px Bungee",
                            fillStyle: "#30343f"
                        },
                        columns: [
                            { width: 75, title: "STT", dataIndex: "num" },
                            { width: 250, title: "NGƯỜI CHƠI", dataIndex: "player" },
                            { width: 250, title: "TIỀN THẮNG", dataIndex: "money" }
                        ],
                        dataSource: dataSource
                    });
            
                    await saveImage(canvasTable, resolve(cachesPath, "beastMoneyInfo.png"));
                    await delay(1500);
                    await message.send({
                        body: plusMoneyNotificateSentences[random(0, plusMoneyNotificateSentences.length)],
                        attachment: fs.createReadStream(resolve(cachesPath, "beastMoneyInfo.png"))
                    });

                    updateGamesStatistic(global.gamesStatistic);
                }
                const processSendSlots = async (slotsPath) => {
                    return new Promise(async (slotStream) => {
                        const canvas = createCanvas(300 * slotsPath.length + 10 * (slotsPath.length - 1), 300);
                        const ctx = canvas.getContext("2d");
    
                        for (let index = 0; index < slotsPath.length; index++) {
                            const slotImage = await loadImage(slotsPath[index]);
                            ctx.drawImage(slotImage, 310 * index, 0, 300, 300);
                        }
    
                        canvas.createPNGStream().pipe(fs.createWriteStream(resolve(cachesPath, "beastSlot.png"))).on("finish", async () => {
                            await delay(500);
                            return slotStream(fs.createReadStream(resolve(cachesPath, "beastSlot.png")));
                        });
                    })
                }
                const processBet = async () => {
                    return new Promise(async stop => {
                        for (let index = 0; index < gameState.slotQuantity; index++) gameState.winSlot.push(random(1, 7));

                        await delay(1500);
                        await message.send({ attachment: fs.createReadStream(resolve(beastAssetsPath, "shuffle.gif")) });

                        await delay(3000);
                        await message.send({ attachment: fs.createReadStream(resolve(beastAssetsPath, "table.png")) });
                        const betMessageID = (await message.send("┌──── ∘°❉°∘ ────┐\n\n    🎰〡 ĐẶT CƯỢC\n\n══════════════\n [ STT Ô + Tiền Cược ]\n\n└──── °∘❉∘° ────┘")).messageID;
                        await message.send(startBetSenteces[random(0, startBetSenteces.length)]);

                        gameState.listen = true;
                        gameState.listenStart = true;
                        gameState.listenMessageID = betMessageID;
                        
                        setTimeout(() => {
                            if (!gameState.listen || gameState.over) return;

                            gameState.listen = false;
                            stop();
                        }, 100000);
                    });
                }
                const startGame = async () => {
                    // --- < CẬP NHẬT THÔNG SỐ GAME > --- //
                    let  startTagMessage = "", startTagArray = [];
                    gameState.start = true;



                    // --- < TAG NGƯỜI CHƠI > --- //
                    gameState.playersID.forEach((player) => {
                        const playerInfo = usersInfo[player];
                        startTagMessage += ` @${playerInfo.fullName}`;
                        startTagArray.push({
                            tag: `@${playerInfo.fullName}`,
                            id: player
                        });
                    });
                    


                    // --- < IN BẢNG THÔNG TIN GAME > --- //
                    registerFont(resolve(assetsPath, "fonts", "Quicksand-Medium.ttf"), { family: "Quicksand" });
                    registerFont(resolve(assetsPath, "fonts", "Bungee-Regular.ttf"), { family: "Bungee" });

                    const renderTable = TableRenderer({ paddingHorizontal: 30, paddingVertical: 30, titleSpacing: 20, fontFamily: "Quicksand" }).render;
                    const canvasTable = renderTable({
                        title: "THÔNG TIN GAME BẦU CUA",
                        titleStyle: {
                            font: "normal 30px Bungee",
                            fillStyle: "#30343f"
                        },
                        columns: [
                            { width: 200, title: "THÔNG TIN", dataIndex: "info" },
                            { width: 300, title: "NỘI DUNG", dataIndex: "content" }
                        ],
                        dataSource: [
                            "-",
                            {
                                info: "Thời gian",
                                content: moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss - DD/MM/YYYY")
                            },
                            {
                                info: "Số người chơi",
                                content: gameState.playersCount
                            },
                        ]
                    });



                    // --- < XỬ LÍ THÔNG TIN NGƯỜI CHƠI > --- //
                    for (let index = 0; index < gameState.playersCount; index++) {
                        const playerID = gameState.playersID[index];
                        const playerInfo = {
                            betSlot: [],
                            betMoney: 0,
                            betState: false
                        }   

                        gameState.playersInfo[playerID] = playerInfo;
                    }



                    // --- < GỬI TIN NHẮN KHỞI ĐỘNG GAME > --- //
                    await saveImage(canvasTable, resolve(cachesPath, "beastStartInfo.png"));
                    await message.send({
                        body: `- NGƯỜI CHƠI:${startTagMessage}`,
                        mentions: startTagArray,
                        attachment: fs.createReadStream(resolve(cachesPath, "beastStartInfo.png"))
                    });


                    
                    // --- < KHỞI ĐỘNG GAME > --- //
                    await processBet();
                }
                const checkGameCommand = async () => {
                    // --- < NHẬN LỆNH GAME > --- //
                    if (checkMessage(inGameMessage, botCall) && inGameSenderID == senderID) {
                        if (checkMessage(inGameMessage, ["huy", "huyy", "huyr", "cancel", "stop"])) {
                            message.react("🔹", inGameMessageID);
                            message.send(stopGameSentences[random(0, stopGameSentences.length)], null, inGameMessageID);
                            gameState.over = true;
                        }
    
                        if (checkMessage(inGameMessage, ["bat dau", "khoi dau", "choi", "start"]) && !gameState.start) {
                            if (gameState.playersCount < gameState.minPlayer) {
                                message.react("⭕️", inGameMessageID);
                                message.send(notEnoughPlayerSentences(gameState.playersCount)[random(0, notEnoughPlayerSentences(gameState.playersCount).length)], null, inGameMessageID);
                            }
                            else {
                                message.react("🔹", inGameMessageID);
                                message.send(startGameSentences[random(0, startGameSentences.length)], null, inGameMessageID);
                                await startGame();
                            }
                        }
                    }
                }
                const checkGameOver = async () => {
                    gameState.over = true;
                    let winnerTagMessage = "", winnerTagArray = [], winnerArray = [];

                    for (let index = 0; index < gameState.playersID.length; index++) {
                        const playerID = gameState.playersID[index];
                        const playerBetSlot = gameState.playersInfo[playerID].betSlot;
                        const playerBetMoney = gameState.playersInfo[playerID].betMoney;
                        let winSlotCount = 0;

                        playerBetSlot.forEach(slot => {
                            winSlotCount += gameState.winSlot.reduce((total, current) => total += (current == slot) ? 1 : 0, 0);
                        });

                        if (winSlotCount > 0) winnerArray.push(playerID);

                        gameState.money[playerID] = 2 * playerBetMoney * winSlotCount;
                        global.usersInfo[playerID].money += 2 * playerBetMoney * winSlotCount;
                        global.usersInfo[playerID].money -= playerBetMoney * playerBetSlot.length;
                        global.gamesStatistic[playerID].beast.totalBet += playerBetMoney * playerBetSlot.length;
                        global.gamesStatistic[playerID].beast.highestBet = Math.max(playerBetMoney * playerBetSlot.length, global.gamesStatistic[playerID].beast.highestBet);
                    }

                    winnerArray.forEach((player) => {
                        const playerInfo = usersInfo[player];   
                        winnerTagMessage += ` @${playerInfo.fullName}`;
                        winnerTagArray.push({
                            tag: `@${playerInfo.fullName}`,
                            id: player
                        });

                        global.gamesStatistic[player].beast.winCount++;
                    });

                    await delay(3000);
                    await message.send(gameOverSentences[random(0, gameOverSentences.length)]);
                    await message.send(showSlotSentences[random(0, showSlotSentences.length)]);
                    
                    await delay(1500);
                    await message.send({ attachment: await processSendSlots(gameState.winSlot.map(slot => resolve(beastAssetsPath, `${slot}.png`))) });

                    await delay(1500);
                    if (winnerArray.length > 0) {
                        await message.send({
                            body: `- NGƯỜI THẮNG CUỘC:${winnerTagMessage}`,
                            mentions: winnerTagArray
                        });
                        await processGameOverMoney();
                    }
                    else await message.send(noWinnerSenteces[random(0, noWinnerSenteces.length)]);
                }
                const checkInputValue = async () => {
                    if (!gameState.over && gameState.listen && inGameMessageReply.messageID == gameState.listenMessageID && gameState.playersID.includes(inGameSenderID)) {
                        const betValueArray = inGameMessage.split(/\s+/).map(value => parseInt(value));
                        const betMoney = betValueArray.pop();
                        
                        if (
                            betValueArray.map(value => isNaN(value)).includes(true) ||
                            betValueArray.filter(value => value > 6 || value <= 0).length > 0 ||
                            betValueArray.length == 0 || betValueArray.length > 6 ||
                            isNaN(betMoney) ||
                            betMoney < 0
                        ) {
                            await message.react("⭕️", inGameMessageID);
                            await message.send(errorInputSentences[random(0, errorInputSentences.length)], null, inGameMessageID);
                            return;
                        }

                        if (usersInfo[inGameSenderID].money < betValueArray.length * betMoney) {
                            await message.react("⭕️", inGameMessageID);
                            await message.send(notEnoughtMoneySentences[random(0, notEnoughtMoneySentences.length)], null, inGameMessageID);
                            return;
                        }
                        
                        if (!gameState.playersInfo[inGameSenderID].betState) gameState.listenCount++;
                            
                        gameState.playersInfo[inGameSenderID].betSlot = [... betValueArray];
                        gameState.playersInfo[inGameSenderID].betMoney = betMoney;
                        gameState.playersInfo[inGameSenderID].betState = true;

                        await message.react("🔹", inGameMessageID);
                        await message.send(betNotificateSentences(usersInfo[inGameSenderID].shortName)[random(0, betNotificateSentences(usersInfo[inGameSenderID].shortName).length)]);
                    }
                }



                // --- < KIỂM TRA GAME OVER > --- //
                if (gameState.over) {
                    stopPromise();
                    return;
                }



                // --- < KIỂM TRA NHẬP GIÁ TRỊ GAME > --- //
                if (gameState.start && gameState.listen && gameState.listenCount == gameState.playersCount) gameState.listen = false;
                if (gameState.start && !gameState.over && !gameState.listen && gameState.listenStart) {
                    gameState.listenStart = false;
                    await checkGameOver();
                }
                


                const inGameMessage = event.body;
                const inGameMessageID = event.messageID;
                const inGameMessageReply = event.messageReply;
                const inGameSenderID = event.senderID;

                switch(event.type) {
                    case "message_reply":
                        checkGameCommand();
                        
                        // --- < KIỂM TRA NGƯỜI CHƠI THAM GIA > --- //
                        if (
                            !gameState.start && inGameMessageReply.messageID == confirmMessageID &&
                            !gameState.playersID.includes(inGameSenderID) && gameState.playersCount < gameState.maxPlayer
                        ) {
                            gameState.playersID.push(inGameSenderID);
                            gameState.playersCount++;

                            await message.react("🔹", inGameMessageID);
                            await message.send(joinNotificateSentences(usersInfo[inGameSenderID].shortName, gameState.playersCount)[random(0, joinNotificateSentences(usersInfo[inGameSenderID].shortName, gameState.playersCount).length)]);
                        }



                        // --- < KIỂM TRA NHẬN DỮ LIỆU > --- //
                        await checkInputValue();

                    break;

                    case "message":
                        checkGameCommand();
                    break;
                }
            })
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