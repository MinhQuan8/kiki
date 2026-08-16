/* -----------------------------------
    < COMMAND > --- < BLACK JACK >
------------------------------------ */

// ----- < [ KHAI BÁO ] - REQUIRE MODULE CẦN THIẾT > ----- //
const fs = require("fs");
const { resolve } = require("path");
const moment = require("moment-timezone");
const { saveImage } = require("table-renderer");
const TableRenderer = require("table-renderer").default;
const { createCanvas, loadImage, registerFont } = require("canvas");

// ----- < [ CONFIG ] - THÔNG TIN VỀ LỆNH > ----- //
const config = {
    name: "blackjack",
    description: "Lệnh khởi tạo trò chơi Xì dách.",
    type: "game",
    usage: "/kiki blackjack",
    condition: ["blackjack", "bj", "xi dach", "xidach"],
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
        "Okk, game Xì dách bắt đầu!!",
        "Vô ván xì dách nha mấy đứa 😘",
        "Bắt đầu ván xì dách ~~",
        "Vào game nè !!",
        "Lên ván xì dách nè 🙂"
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
    const joinConfirmSentences = [
        "M vừa tham gia game Xì dách!! Check ib t để theo dõi game 😏😏",
        "M đã vào phòng Xì dách, nhớ check ib t thường xuyên 😏",
        "M vừa vô ván Xì dách thành công, nhớ check ib!!",
        "Con sv này, m vừa tham gia game Xì dách, thường xuyên check ib t đi à 😏",
        "Vừa tham gia ván Xì dách r đó, nhớ check ib thuognwf xuyên 😏"
    ];
    const joinErrorSentences = [
        "Đ gửi tin nhắn cho ib của m đc 🙂",
        "T đ gửi tin nhắn riêng cho m đc 🙂🙂",
        "Đ gửi ib m đc, xem lại đi sv",
        "M có chặn t k?? T đ gửi ib m đc 🙂",
        "Xem lại xem, t đ gửi ib cho m đc 🙂"
    ];
    const notEnoughtMoneySentences = [
        "Rách! Đéo đủ tiền chơi 🙂",
        "Đỗ nghèo khỉ, m đéo ddu tiền chs 🙂",
        "Rách vcl, đ đủ tiền vô game 😏",
        "Nghèo cúc, đ đủ tiền vô ván 🙂",
        "Đcm đ đủ tiền vô vo cái lồn 🙂🙂"
    ];
    const sendCardSentences = [
        "Bài của m nè nhóc 😏",
        "Bài trong ván của m nè 😏",
        "Bố m gửi bài nè !~",
        "T gửi bài của m nè 😏",
        "Bài nè 😏"
    ];
    const sendNewCardSentences = [
        "Bài mới bốc nè cuu!",
        "Bài m vừa mới bốc ~",
        "Bài mới bốc của m~!",
        "T gửi bài mới bốc ~~",
        "Bài mới bốc thêm của m nè ~"
    ];
    const sendCardNotificateSentences = [
        "T vừa mới gửi bài của tụi m r đó, vô check inbox đi",
        "Check ib đi, t vừa gửi bài của mấy đứa r đó 😏",
        "T vừa gửi bài vô ib đó, check xem",
        "Xem tin nhắn riêng đi, bố vừa gửi bài 😏",
        "gửi bài r đó, vô ib xem đi 😏"
    ];
    const pickCardSentences = [
        "Ai bốcc tiếp thì rep tin nhắn vừa r",
        "Nào bốc bài tiếp thì rep tn t ms gửi",
        "Bốc tiếp thì rep tn t gửi",
        "Ngon bóc tiếp thì rep tn t vừa gửi",
        "Bóc thêm thì trl tin nhắn t ms gửi"
    ];
    const notPickCardSentences = [
        "Kh ai bốc nx thì thoi à 🙂",
        "Đ ai dám bốc nx chứ j 😏",
        "Đ ai bốc nx đk 😏",
        "Kh thg nào bốc nx thì tiếp !",
        "Đ bốc tiếp thì thoi 😏😏"
    ];
    const overPickCardSentences = [
        "M quá r bốc cái lồn à?",
        "Bốc clj, m quắt cmnr 🙂",
        "Quắc mẹ nó r bốc cái đ j?",
        "Bốc ccj, m quắc r con ạ !",
        "Quá r bốc clj nx 🙂"
    ];
    const showCardNotificationSentences = [
        "Showw bài nè!!",
        "Khui bài từng đứa nè !",
        "Khui bài nè ~~",
        "Mở bài nè !",
        "Showww bài!~"
    ]
    const gameOverSentences = [
        "Gamee kết thúc !!",
        "Ván kết thúc r !~~",
        "Ván xì dách đã kết thúc !",
        "Hết vánn !",
        "Hết ván xì dách r ~~",
    ];
    const joinNotificateSentences = (playerName, index) => {
        return [
            `Chào mừng con chó ${playerName} đến vs game Xì dách - ${index}`,
            `${playerName} vừa vào ván Xì dách 🙂 - ${index}`,
            `Đĩ ${playerName} vừa tham gia Xì dách - ${index}`,
            `Concho ${playerName} đã vào game Xì dách 🙂 - ${index}`,
            `sv ${playerName} vừa gia nhập phòng Xì dách 😀 - ${index}`
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
    const pickCardNotificateSentences = (playerName) => {
        return [
            `${playerName} vừa bốc bài`,
            `${playerName} đã bốc thêm lá nx !!`,
            `Sv ${playerName} đã bốc thêm bài ~`,
            `Ocloz ${playerName} vừa bốc thêm lá nx!`,
            `${playerName} đã bốc thêm 1 lá!`
        ];
    };
    const showCardNotificateSentences = (playerName, playerPoint) => {
        return [
            `Bai của ${playerName} - ${playerPoint} điểm 😏`,
            `Bài này là của ${playerName} với ${playerPoint} điểm 🙂`,
            `Show của đĩ ${playerName}, ${playerPoint} điểm 😏😏`,
            `Bài của sv ${playerName} với ${playerPoint} điểm ~`,
            `Show bài của sv ${playerName} nè, ${playerPoint} điểmm!`,
        ]
    }

    try {
        const bet = parseInt(args.join(""));
        const blackjackAssetsPath = resolve(assetsPath, "poker");
        const confirmMessageID = (await message.reply("┌──── ∘°❉°∘ ────┐\n\n  🎮〡 CHƠI XÌ DÁCH\n\n══════════════\n  [ - 𝘙𝘦𝘱𝘭𝘺 𝘔𝘦𝘴𝘴𝘢𝘨𝘦 - ]\n\n└──── °∘❉∘° ────┘")).messageID;
        await message.send(joinIntroduceSentences[random(0, joinIntroduceSentences.length)]);

        const gameState = {
            start: false,
            over: false,

            bet: (isNaN(bet) ? 0 : bet),
            totalBet: 0,

            pickCount: 0,
            pickTimes: 0,
            pickStart: false,
            pickCard: {
                listen: false,
                listenMessageID: null,
            },

            minPlayer: 1,
            maxPlayer: 10,
            playersCount: 0,
            playersID: [],
            playersInfo: {},

            cards: {}
        }

        const cardTypes = ["H", "D", "C", "S"];
        cardTypes.forEach(cardType => {
            for (let i = 1; i <= 13; i++)
                gameState.cards[`${i}${cardType}`] = {
                    value: i > 10 ? 10 : i,
                    state: true,
                    path: resolve(blackjackAssetsPath, `${i}${cardType}.png`)
                }
        });
        
        return await new Promise(stopPromise => {
            api.listenMqtt(async (err, event) => {
                if (err) throw new Error(err);

                const processSendCards = (cardsPath, index) => {
                    return new Promise(async (cardStream) => {
                        const canvas = createCanvas(300 * cardsPath.length + 10 * (cardsPath.length - 1), 300);
                        const ctx = canvas.getContext("2d");
    
                        for (let i = 0; i < cardsPath.length; i++) {
                            const cardImage = await loadImage(cardsPath[i]);
                            ctx.drawImage(cardImage, 310 * i, 0, 300, 300);
                        }
    
                        canvas.createPNGStream().pipe(fs.createWriteStream(resolve(cachesPath, `blackjackCard${index}.png`))).on("finish", async () => {
                            return cardStream(fs.createReadStream(resolve(cachesPath, `blackjackCard${index}.png`)));
                        });
                    })
                }
                const processPoint = (playerID) => {
                    const playerCards = [...gameState.playersInfo[playerID].cards];
                    let playerPoint = 0, playerMinPoint;

                    playerCards.filter(card => gameState.cards[card].value != 1).forEach(card => {
                        playerPoint += gameState.cards[card].value;
                    });

                    playerMinPoint = playerPoint;
                    while (playerCards.map(card => gameState.cards[card].value).includes(1)) {
                        playerMinPoint++;

                        const pointState = [[16, 21], [22, 95], [0, 15]];
                        const acePoint = [11, 10, 1];
                    
                        loop: for (const state of pointState) {
                            let tempAcePoint;

                            if (state[0] == 22 && state[1] == 95) tempAcePoint = [...acePoint].reverse();
                            else tempAcePoint = [...acePoint];
                            
                            for (const point of tempAcePoint)
                                if (playerPoint + point >= state[0] && playerPoint + point <= state[1]) {
                                    playerPoint += point;
                                    break loop;
                                }
                        }

                        playerCards.splice(playerCards.map(card => gameState.cards[card].value).indexOf(1), 1);
                    }
                    gameState.playersInfo[playerID].minPoint = playerMinPoint;
                    return playerPoint;
                }
                const processPickCard = async () => {
                    return new Promise(async stop => {
                        await delay(5000);

                        const pickCardMessageID = (await message.send("┌──── ∘°❉°∘ ────┐\n\n 🃏〡 BỐC THÊM BÀI\n\n══════════════\n  [ - 𝘙𝘦𝘱𝘭𝘺 𝘔𝘦𝘴𝘴𝘢𝘨𝘦 - ]\n\n└──── °∘❉∘° ────┘")).messageID;
                        await message.send(pickCardSentences[random(0, pickCardSentences.length)]);

                        gameState.pickTimes++;
                        gameState.pickCount = 0;
                        gameState.pickStart = true;
                        gameState.pickCard = {
                            listen: true,
                            listenMessageID: pickCardMessageID,
                        }

                        setTimeout(() => {
                            if (!gameState.pickCard.listen || gameState.over) return;

                            gameState.pickCard.listen = false;
                            message.send(notPickCardSentences[random(0, notPickCardSentences.length)]);

                            stop();
                        }, 60000);
                    });
                }
                const processShowCard = async () => {
                    return new Promise(async stop => {
                        await delay(3000);
                        await message.send(showCardNotificationSentences[random(0, showCardNotificationSentences.length)]);

                        for (let index = 0; index < gameState.playersCount; index++) {
                            const playerID = gameState.playersID[index];
                            const playerName = usersInfo[playerID].fullName;
                            const playerPoint = gameState.playersInfo[playerID].point;
                            const playerCards = gameState.playersInfo[playerID].cards;

                            await message.send({
                                body: showCardNotificateSentences(playerName, playerPoint)[random(0, showCardNotificateSentences(playerName, playerPoint).length)],
                                attachment: await processSendCards(playerCards.map(card => gameState.cards[card].path), index)
                            });
                        }

                        stop();
                    });
                }
                const startGame = async () => {
                    // --- < CẬP NHẬT THÔNG SỐ GAME > --- //
                    let  startTagMessage = "", startTagArray = [];
                    gameState.start = true;
                    gameState.totalBet = gameState.playersCount * gameState.bet;



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
                        title: "THÔNG TIN GAME XÌ DÁCH",
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
                            {
                                info: "Tổng tiền cược",
                                content: (gameState.totalBet == 0) ? "0" : gameState.totalBet
                            }
                        ]
                    });

                    

                    // --- < GỬI TIN NHẮN KHỞI ĐỘNG GAME > --- //
                    await saveImage(canvasTable, resolve(cachesPath, "blackjackStartInfo.png"));
                    await message.send({
                        body: `- NGƯỜI CHƠI:${startTagMessage}`,
                        mentions: startTagArray,
                        attachment: fs.createReadStream(resolve(cachesPath, "blackjackStartInfo.png"))
                    });


                    
                    // --- < CHIA BÀI TRONG GAME > --- //
                    const selectedCard = [];
                    for (let index = 0; index < gameState.playersCount * 2; index++) {
                        while (true) {
                            const ranPos = random(0, 52);
                            const ranCard = Object.keys(gameState.cards)[ranPos];

                            if (!selectedCard.includes(ranCard)) {
                                selectedCard.push(ranCard);
                                gameState.cards[ranCard].state = false;
                                break;
                            }
                        }
                    }
                   
                    await message.send(sendCardNotificateSentences[random(0, sendCardNotificateSentences.length)]);
                    for (let index = 0; index < gameState.playersCount; index++) {
                        const playerID = gameState.playersID[index];
                        const playerInfo = {
                            cards: [selectedCard[index * 2], selectedCard[index * 2 + 1]],
                            point: 0,
                            minPoint: 0,
                        }

                        gameState.playersInfo[playerID] = playerInfo;
                        gameState.playersInfo[playerID].point = processPoint(playerID);

                        await delay(1000);
                        await message.send({
                            body: sendCardSentences[random(0, sendCardSentences.length)],
                            attachment: await processSendCards(gameState.playersInfo[playerID].cards.map(card => gameState.cards[card].path), index)
                        }, playerID);
                    }

                    
                    // --- < KHỞI ĐỘNG GAME > --- //
                    if (Object.values(gameState.playersInfo).map(playerInfo => playerInfo.point).filter(point => point == 21).length > 0) await checkGameOver();
                    else await processPickCard();
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
                    let winnerTagMessage = "", winnerTagArray = [];
                    const maxPoint = {
                        winner: [],
                        winnerPoint: null,
                        enough: 0,
                        old: 95,
                        young: 0
                    }
                    
                    const pointState = {
                        enough: [16, 21],
                        old: [22, 95],
                        young: [0, 15]
                    };
                    
                    for (let index = 0; index < gameState.playersCount; index++) {
                        const playerID = gameState.playersID[index];
                        const playerPoint = gameState.playersInfo[playerID].point;
                        const playerCardsCount = gameState.playersInfo[playerID].cards.length;
                    
                        if (playerCardsCount == 5 && playerPoint <= 21) maxPoint.winner.push(playerID);

                        for (const stateName of Object.keys(pointState)) {
                            if (
                                playerPoint >= pointState[stateName][0] &&
                                playerPoint <= pointState[stateName][1] &&
                                (stateName == "old" ? playerPoint < maxPoint[stateName] : playerPoint > maxPoint[stateName])
                            ) {
                                maxPoint[stateName] = playerPoint;
                                break;
                            }
                        }
                    }
                    
                    if (maxPoint.winner.length == 0) {
                        for (const stateName of Object.keys(pointState))
                            if ((stateName == "old" ? maxPoint[stateName] < 95 : maxPoint[stateName] > 0)) {
                                maxPoint.winnerPoint = maxPoint[stateName];
                                break;
                            }
                        
                        for (let index = 0; index < gameState.playersCount; index++) {
                            const playerID = gameState.playersID[index];
                            const playerPoint = gameState.playersInfo[playerID].point;
                            
                            if (playerPoint == maxPoint.winnerPoint) maxPoint.winner.push(playerID);
                        }
                    }
                    
                    maxPoint.winner.forEach((player) => {
                        const playerInfo = usersInfo[player];
                        const earnMoney = Math.round(gameState.totalBet / maxPoint.winner.length);

                        winnerTagMessage += ` @${playerInfo.fullName}`;
                        winnerTagArray.push({
                            tag: `@${playerInfo.fullName}`,
                            id: player
                        });

                        global.gamesStatistic[player].blackjack.winCount++;
                        global.gamesStatistic[player].blackjack.playTimes++;
                        global.gamesStatistic[player].blackjack.totalEarn += earnMoney;
                        global.gamesStatistic[player].blackjack.highestEarn = Math.max(earnMoney, global.gamesStatistic[player].blackjack.highestEarn);
                        global.usersInfo[player].money += earnMoney;
                    });

                    gameState.playersID.forEach(player => {
                        global.usersInfo[player].money -= gameState.bet;
                        global.gamesStatistic[player].blackjack.totalBet += gameState.bet;
                        global.gamesStatistic[player].blackjack.highestBet = Math.max(gameState.bet, global.gamesStatistic[player].blackjack.highestBet);
                    });
                    
                    await message.send(gameOverSentences[random(0, gameOverSentences.length)]);
                    await processShowCard();
                    
                    await delay(3000);
                    await message.send({
                        body: `- NGƯỜI THẮNG CUỘC:${winnerTagMessage}` + "\n" + `- TIỀN THẮNG: ${(gameState.totalBet / maxPoint.winner.length).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}`,
                        mentions: winnerTagArray
                    });

                    updateGamesStatistic(global.gamesStatistic);
                }



                // --- < KIỂM TRA GAME OVER > --- //
                if (gameState.over) {
                    stopPromise();
                    return;
                }



                // --- < KIỂM TRA NHẬP GIÁ TRỊ GAME > --- //
                if (gameState.start && gameState.pickCard.listen && gameState.pickCount == gameState.playersCount) gameState.pickCard.listen = false;
                if (gameState.start && !gameState.over && gameState.pickStart && !gameState.pickCard.listen) {
                    gameState.pickStart = false;

                    for (let index = 0; index < gameState.playersCount; index++) {
                        const playerID = gameState.playersID[index];
                        const playerPoint = processPoint(playerID);

                        gameState.playersInfo[playerID].point = playerPoint;
                    }
                    
                    if (gameState.pickTimes >= 3 || gameState.pickCount == 0) await checkGameOver();
                    else await processPickCard();
                }
                


                const inGameMessage = event.body;
                const inGameMessageID = event.messageID;
                const inGameMessageReply = event.messageReply;
                const inGameSenderID = event.senderID;

                switch(event.type) {
                    case "message_reply":
                        checkGameCommand();
                        
                        // --- < KIỂM TRA NGƯỜI CHƠI THAM GIA > --- //
                        if (!gameState.start && inGameMessageReply.messageID == confirmMessageID) {
                            if (usersInfo[inGameSenderID].money < gameState.bet) {
                                await message.react("⭕️", inGameMessageID);
                                await message.send(notEnoughtMoneySentences[random(0, notEnoughtMoneySentences.length)], null, inGameMessageID);
                            }

                            else if (!gameState.playersID.includes(inGameSenderID) && gameState.playersCount < gameState.maxPlayer) {
                                const inboxState = message.send(joinConfirmSentences[random(0, joinConfirmSentences.length)], inGameSenderID);
                                inboxState.then(
                                    () => {
                                        gameState.playersID.push(inGameSenderID);
                                        gameState.playersCount++;

                                        message.react("🔹", inGameMessageID);
                                        message.send(joinNotificateSentences(usersInfo[inGameSenderID].shortName, gameState.playersCount)[random(0, joinNotificateSentences(usersInfo[inGameSenderID].shortName, gameState.playersCount).length)]);
                                    },
                                    () => {
                                        message.react("⭕️", inGameMessageID);
                                        message.send(joinErrorSentences[random(0, joinErrorSentences.length)], null, inGameMessageID);
                                    }
                                )
                            }
                        }



                        // --- < KIỂM TRA NHẬN DỮ LIỆU > --- //
                        if (!gameState.over && gameState.pickCard.listen && inGameMessageReply.messageID == gameState.pickCard.listenMessageID && gameState.playersID.includes(inGameSenderID)) {
                            if (gameState.playersInfo[inGameSenderID].minPoint > 21) {
                                await message.react("⭕️", inGameMessageID);
                                await message.send(overPickCardSentences[random(0, overPickCardSentences.length)], null, inGameMessageID);
                            }

                            else if (gameState.playersInfo[inGameSenderID].cards.length < 2 + gameState.pickTimes) {
                                await message.react("🔹", inGameMessageID);
                                await message.send(pickCardNotificateSentences(usersInfo[inGameSenderID].shortName)[random(0, pickCardNotificateSentences(usersInfo[inGameSenderID].shortName).length)]);

                                while (true) {
                                    const ranPos = random(0, 52);
                                    const ranCard = Object.keys(gameState.cards)[ranPos];
        
                                    if (gameState.cards[ranCard].state) {
                                        gameState.pickCount++;
                                        gameState.cards[ranCard].state = false;
                                        gameState.playersInfo[inGameSenderID].cards.push(ranCard);

                                        await delay(1000);
                                        await message.send({
                                            body: sendNewCardSentences[random(0, sendNewCardSentences.length)],
                                            attachment: await processSendCards(gameState.playersInfo[inGameSenderID].cards.map(card => gameState.cards[card].path), gameState.playersID.findIndex(playerID => playerID == inGameSenderID))
                                        }, inGameSenderID);
                                        break;
                                    }
                                }
                            }
                        }
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