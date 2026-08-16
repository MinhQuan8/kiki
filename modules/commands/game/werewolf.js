/* ----------------------------------
    < COMMAND > --- < WEREWOLF >
---------------------------------- */

// ----- < [ KHAI BÁO ] - REQUIRE MODULE CẦN THIẾT > ----- //
const fs = require("fs");
const { resolve } = require("path");
const moment = require("moment-timezone");
const { registerFont } = require("canvas");
const { saveImage } = require("table-renderer");
const TableRenderer = require("table-renderer").default;

// ----- < [ CONFIG ] - THÔNG TIN VỀ LỆNH > ----- //
const config = {
    name: "werewolf",
    description: "Lệnh khởi tạo trò chơi Ma sói.",
    type: "game",
    usage: "/kiki werewolf",
    condition: ["werewolf", "ww", "ma soi"],
    exception: [],
    permission: 3,
    priority: 0
}

// ----- < [ HÀM ] - XỬ LÍ LỆNH > ----- //
async function onCall({ message }) {
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
        "Okk, game Ma Sói bắt đầu!!",
        "Bắt đầu gam Ma Sói nha mấy đứa 😘",
        "Bắt đầu game Ma Sói ~~",
        "Vào game nè !!",
        "Lên game Ma Sói nè 🙂"
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
        "M vừa tham gia game Ma Sói!! Check ib t để theo dõi game 😏😏",
        "M đã tham gia game Ma Sói, nhớ check ib t thường xuyên 😏",
        "M vừa tham gia Ma Sói thành công, nhớ check ib!!",
        "Con sv này, m vừa tham gia game Ma Sói, thường xuyên check ib t đi à 😏",
        "Vừa tham gia game Ma Sói r đó, nhớ check ib thuognwf xuyên 😏"
    ];
    const joinErrorSentences = [
        "Đ gửi tin nhắn cho ib của m đc 🙂",
        "T đ gửi tin nhắn riêng cho m đc 🙂🙂",
        "Đ gửi ib m đc, xem lại đi sv",
        "M có chặn t k?? T đ gửi ib m đc 🙂",
        "Xem lại xem, t đ gửi ib cho m đc 🙂"
    ];
    const sendRoleSentences = [
        "Vai trò của m nè nhóc 😏",
        "Vai trò trong game của m nè 😏",
        "Bố m gửi vai trò nè !~",
        "T gửi vai trò của m nè 😏",
        "Vai trò nè 😏"
    ];
    const sendRoleNotificateSentences = [
        "T vừa mới gửi vai trò của tụi m r đó, vô check inbox đi",
        "Check ib đi, t vừa gửi vai trò của mấy đứa r đó 😏",
        "T vừa gửi vai trò vô ib đó, check xem",
        "Xem tin nhắn riêng đi, bố vừa gửi vai trò 😏",
        "gửi vai trò r đó, vô ib xem đi 😏"
    ];
    const werewolfAbilitySentences = [
        "Chọn một người để giết, trloi tin nhắn bên dưới của t để chọn",
        "Pick 1 đứa để giết đi sói, trl tin nhắn t gửi để chọn",
        "Chọn 1 đứa phải chết, rep tin nhắn bên dưới của t để chọn",
        "Chọn lẹ 1 đứa r giết đi, rep tin kia của t để chọn",
        "CHọn 1 đứa p chét, rep tin nhắn bên dưới của t để chọn"
    ];
    const oldwolfAbilitySentences = [
        "Chọn một người để giết, trloi tin nhắn bên dưới của t để chọn",
        "Pick 1 đứa để giết đi sói, trl tin nhắn t gửi để chọn",
        "Chọn 1 đứa phải chết, rep tin nhắn bên dưới của t để chọn 😏",
        "Chọn lẹ 1 đứa r giết đi, rep tin kia của t để chọn",
        "Chọnn 1 đứa p chét, rep tin nhắn bên dưới của t để chọn 😏"
    ];
    const hunterAbilitySentences = [
        "Chọn 1 đứa để vác súng bắn bỏ đi, trl tin nhắn bên dưới để chọn",
        "Pickk đại 1 đứa r bắn bỏ, trloi tin nhắn bên dưới của t để chọn",
        "Chọn 1 đứa để m cho ăn kẹo đồng, rep tin nhắn bên dưới của t để chọn 😏",
        "Chọn một người để bắn chet, rep tin nhắn bên dưới của t để chọn",
        "Chọn 1 đứa r bắn chet cmn đi, rep tin kia của t để chọn"
    ];
    const defenderAbilitySentences = [
        "Chọn một người để bảo vệ, trloi tin nhắn bên dưới của t để chọn",
        "Pick 1 đứa để bảo kê đi, trl tin nhắn t gửi để chọn",
        "Chọn 1 đứa đc bảo kê đêm nay, rep tin nhắn bên dưới của t để chọn",
        "Chọn lẹ 1 đứa để bảo vệ đi, rep tin kia của t để chọn",
        "CHọn 1 đứa đc bảo vệ, rep tin nhắn bên dưới của t để chọn"
    ];
    const seerAbilitySentences = [
        "Chọn một người để soii, trloi tin nhắn bên dưới của t để chọn",
        "Pick 1 đứa r soi vai trò, trl tin nhắn t gửi để chọn",
        "Chọn 1 đứa xog soi vai trò nó, rep tin nhắn bên dưới của t để chọn",
        "Chọn lẹ 1 đứa để soi hàng đi, rep tin kia của t để chọn",
        "CHọn 1 đứa để xem vai trò, rep tin nhắn bên dưới của t để chọn"
    ];
    const startDaySentences = [
        "Sáng r các con ơi !!",
        "Trời sáng r, dậy đi mấy con đĩ ~~",
        "Mấy đĩ ơi dậy đi, sáng cmnr",
        "TRời sángg roi, dậy đee !",
        "Dậy đi các con, troi đã sáng ròi ~"
    ];
    const startElectSentences = [
        "tới giờ bầu chọn ai là sói!\nTụi m cứ thảo luận đi, r rep tin nhắn trog ib để chọn",
        "Đến lúc chọn lựa xem ai mới là sói\nThảo luận xog thì rep tin nhắn ib t để chọn",
        "Giờ thảo luậnn!!\nXog xuôi r thì trl tin nhắn trog ib t để bỏ phiếu",
        "Đến giờ bầu chọnn người phải chét~~\nCứ thảo luận vs nhau đi, trl tin nhắn trong ib để biểu quyết",
        "Đến lúc quyết định xem ai là sói !!\nThảo luận r thì rep tin nhắn trog inbox t để chọn"
    ];
    const electIntroduceSentences = [
        "Bầu chọn đứa m tin là sói đi, xog thì rep tin nhắn bên dưới để chọn",
        "Chọn 1 đứa m tin là ma sói, xog r thì rep tin t gửi bên dưới mà chọn",
        "Chọn lẹ 1 đứa m nghi ngờ, xog thì trl tin nhắn t gửi để chọn",
        "Chọn 1 đứa m đg nghi là sói, trả lời tin bên dưới của t để chọn",
        "Bỏ phiếu cho 1 đứa khả nghi, trl tin nhắn dưới của t để chọn"
    ];
    const errorInputSentences = [
        "Nhập cljv?",
        "Mù à? Nhập cljv 🙂",
        "Nhập đ j v, bố thg ngu 🙂",
        "Nhập ccj đấy 🙂?",
        "nhập cljv 🙂?"
    ];
    const deadNotificateSentences = [
        "Chúc mừng, m bị dân làng treo cổ chết cmnr",
        "Bạn đã bị dân làng ban chết 🥳🥳",
        "Chúc mừng nhé, con đã chết dưới tay dân làng 🥳",
        "M bị dân làng xử tử r con ạ 🥳",
        "M chết cmnr, bị dân làng treo cổ 🙂"
    ];
    const killedNotificateSentences = [
        "Chúc mừng bạn đã bị giết chết ~~",
        "M bị giết chết r con ạ 🥳🥳",
        "Chúc mừng em đã chết ☠️",
        "M bị thủ tiêu r con =))",
        "Đem qua m đã bị giết chết 🥳"
    ];
    const werewolfTeamWinSentences = [
        "Chúc mừng lũ chó đã chiến thắng !! 🥳🥳",
        "Team chó sói đã chiến thắnggg 🥳",
        "Lũ dân gà, bọn sói win rồi 🥳🥳🥳",
        "Team sói đã thắngg, chúc mừng 🥳",
        "Team chó thắng r, dân làng tuổi lồn 🥳"
    ];
    const villagerTeamWinSentences = [
        "Chúc mừng dân làng đã chiến thắng 🥳🥳",
        "Dân làng đã thắng lũ chó 🥳🥳🥳",
        "Chúc mừng dân làng thắng lũ chó dại !! 🥳",
        "Dân làng đã tiêu diệt lũ chó sói, chúc mừng các em đã thắng 🥳🥳",
        "Team dân làng đã thắng !! Sói tuổi lồn 🥳🥳"
    ];
    const gameOverSentences = [
        "Gamee ma sói kết thúc !!",
        "Game kết thúc r !~~",
        "Game Ma Sói đã kết thúc !",
        "Hết gamee !",
        "Game Ma Sói kết thúc ~~",
    ];
    const plusMoneyNotificateSentences = [
        "T gửi thu nhập ván vừa rồi=))",
        "Tiền kiếm được ván vừa r của tụi m!",
        "Tiền thắng từ ván ma sói của bây:",
        "Tiền lụm đc từ game nãy:",
        "T gửi tiền tụi m kiếm đc từ game vừa r =)"
    ];
    const joinNotificateSentences = (playerName, index) => {
        return [
            `Chào mừng con chó ${playerName} đến vs game Ma Sói - ${index}`,
            `${playerName} vừa vào game Ma Sói 🙂 - ${index}`,
            `Đĩ ${playerName} vừa tham gia Ma Sói - ${index}`,
            `Concho ${playerName} đã vào game Ma Sói 🙂 - ${index}`,
            `sv ${playerName} vừa gia nhập game Ma Sói 😀 - ${index}`
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
    const startNightSentences = (night) => {
        return [
            `Đếm thứ ${night} bắt đầu ...\nNgủ đi mấycon đũy 😏`,
            `Bắt đầu đêm thứ ${night} ...\nChúc các con ngủ thật ngonnn, mơ giấc mơ đẹp`,
            `Đêm thứ ${night} ...\nNgu di cac con`,
            `Đêm thứ ${night} bắt đầu ...\nNgủuuu đi`,
            `Đến đêm thứ ${night}..`
        ];
    }
    const roleAbilityUsedNotificateSentences = (role) => {
        switch(role) {
            case 0:
                return [
                    "Sói vừa cắn một đứa 🙂",
                    "Ma Sói đã cắn một đứa !!",
                    "Có người đã hóa sói, cắn chét mẹ 1 đứa r 🙂",
                    "Ma Sói đã cắn người ~~",
                    "Chó đã bắt đầu cắn người !"
                ];
            case 1:
                return [
                    "Sói Già vừa gặm xương 1 đứa 🙂",
                    "Lại thêm một đứa bị Chó Già gặm !",
                    "Chó Già vừa cắn ngườiii~~",
                    "Sói Già đã cắn chét ai đó 🙂",
                    "Lại có đứa bị Sói Già cắn chet ~!"
                ];
            case 2:
                return [
                    "Bảo Vệ vừa dùng năng lực của mình !",
                    "Bảo Vệ đã dùng năng lực của mình ~",
                    "Thg Bảo Vệ vừa sử dụng năng lực 🙂",
                    "Bảo Vệ vừa bảo kê 1 đứa 🙂",
                    "Bảo Vệ đã bảo kê một đứa !!"
                ];
            case 3:
                return [
                    "Thợ Săn vừa dùng năng lực của mình !",
                    "Thợ Săn đã dùng năng lực của mình ~",
                    "Thg Thợ Săn vừa nổ súng! 🙂",
                    "Thợ Săn vừa bắn bỏ 1 đứa 🙂",
                    "Thợ Săn đã bắn lủng lon một đứa !!"
                ];
            case 4:
                return [
                    "Tiên Tri đã dùng năng lực của mình!",
                    "Tiên Tri đã soi hàng một đứa 🙂",
                    "Tiên Tri vừa mới soi hàng một đứa !!",
                    "Sv Tiên Tri vừa dùng năng lực ~",
                    "Tiên Tri vừa dùng năng lực 🙂"
                ];
        }
    }
    const lastNightNotificateSentences = (deadArray) => {
        const deadNameList = "\n" + `Gồm: ${deadArray.join(", ")}`;
        return [
            `Đêm qua có ${deadArray.length} đứa ngỏm 🥳${(deadArray.length > 0) ? deadNameList : ""}`,
            `Đêm vừa qua.., có ${deadArray.length} nạn nhân${(deadArray.length > 0) ? deadNameList : ""}`,
            `Đem qua, có ${deadArray.length} đứa lên bảng điểm số 🥳${(deadArray.length > 0) ? deadNameList : ""}`,
            `Đêm đã hết, vừa qua có ${deadArray.length} đứa chầu ông bà${(deadArray.length > 0) ? deadNameList : ""}`,
            `Đem vừa qua, đã có ${deadArray.length} đứa liệm 🥳🥳${(deadArray.length > 0) ? deadNameList : ""}`
        ];
    }
    const electedNotificateSentences = (name) => {
        return [
            `${name} đã bỏ phiếu!`,
            `${name} đã ra quyết định ~`,
            `${name} cũng đã bỏ phiếu`,
            `Oclon ${name} vừa bỏ phiếu xog`,
            `Sv ${name} vừa bỏ phiếu !`,
        ];
    }
    const executedNotificateSentences = (name, count) => {
        return [
            `Vì số phiếu cao nhất - ${count} phiếu, nên ${name} đã bị xử tử...`,
            `Do ăn ở thiếu uy tín với ${count} phiếu chọn, ${name} đã bị dân làng xử tử 💀`,
            `Được bình chọn cao nhất với ${count} phiếu, nên ${name} đã bị xử tử dưới tay dân làng ☠️`,
            `Vì mặt tiền gây thiếu thiện cảm - ${count} lượt chọn, ${name} đã đc ban chết 💀💀`,
            `Do sống chó với dân - ${count} phiếu chọn giết, nên ${name} đã bị treo cổ chết cmnr ☠️☠️`
        ];
    }

    try {
        registerFont(resolve(assetsPath, "fonts", "Quicksand-Medium.ttf"), { family: "Quicksand" });
        registerFont(resolve(assetsPath, "fonts", "Bungee-Regular.ttf"), { family: "Bungee" });
        
        const werewolfAssetsPath = resolve(assetsPath, "werewolf");
        const confirmMessageID = (await message.reply("┌──── ∘°❉°∘ ────┐\n\n  🎮〡 CHƠI MA SÓI\n\n══════════════\n  [ - 𝘙𝘦𝘱𝘭𝘺 𝘔𝘦𝘴𝘴𝘢𝘨𝘦 - ]\n\n└──── °∘❉∘° ────┘")).messageID;
        await message.send(joinIntroduceSentences[random(0, joinIntroduceSentences.length)]);

        const gameState = {
            start: false,
            over: false,
            voteStart: false,   
            dayPlay: false,
            lastNightPlay: 0,
            nightPlay: 0,
            
            roleCount: 0,
            roleAvailable: {
                "werewolf": true,
                "oldwolf": true,

                "defender": true,
                "hunter": true,
                "seer": true,
            },

            villagerTeamState: false,
            villagerTeamCount: 0,

            werewolfTeamState: false,
            werewolfTeamCount: 0,

            minPlayer: 5,
            playersCount: 0,
            playersID: [],
            playersInfo: {},
            playersAbility: {
                "werewolf": {
                    listen: false,
                    listenMessageID: null,
                    listenThreadID: null,
                    listenSenderID: null,
                    selectorID: null,
                    selectorArray: []
                },
                "oldwolf": {
                        listen: false,
                        listenMessageID: null,
                        listenThreadID: null,
                        listenSenderID: null,
                        selectorID: null,
                        selectorArray: []
                },
                "defender": {
                        listen: false,
                        listenMessageID: null,
                        listenThreadID: null,
                        listenSenderID: null,
                        selectorID: null,
                        selectorArray: []
                },
                "hunter": {
                        listen: false,
                        listenMessageID: null,
                        listenThreadID: null,
                        listenSenderID: null,
                        selectorID: null,
                        selectorArray: []
                },
                "seer": {
                        listen: false,
                        listenMessageID: null,
                        listenThreadID: null,
                        listenSenderID: null,
                        selectorID: null,
                        selectorArray: []
                }
            },

            money: {}
        };
        
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
            
                        global.gamesStatistic[player].werewolf.playTimes++;
                        global.gamesStatistic[player].werewolf.totalEarn += gameState.money[player];
                        global.gamesStatistic[player].werewolf.highestEarn = Math.max(gameState.money[player], global.gamesStatistic[player].werewolf.highestEarn);
                        global.usersInfo[player].money += gameState.money[player];
                        dataSource.push(dataObject);
                    });

                    const renderTable = TableRenderer({ paddingHorizontal: 30, paddingVertical: 30, titleSpacing: 20, fontFamily: "Quicksand" }).render;
                    const canvasTable = renderTable({
                        title: "TIỀN THẮNG GAME MA SÓI",
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
            
                    await saveImage(canvasTable, resolve(cachesPath, "werewolfMoneyInfo.png"));
                    await delay(3000);
                    await message.send({
                        body: plusMoneyNotificateSentences[random(0, plusMoneyNotificateSentences.length)],
                        attachment: fs.createReadStream(resolve(cachesPath, "werewolfMoneyInfo.png"))
                    });

                    updateGamesStatistic(global.gamesStatistic);
                }
                const processNotification = async () => {
                    return new Promise(async stop => {
                        const deadArrayID = [], deadArrayName = [];

                        for (const playerID in gameState.playersInfo) {
                            if (gameState.playersInfo[playerID].life <= 0) {
								if (gameState.playersInfo[playerID].clan == "werewolf") gameState.werewolfTeamCount--;
                                else gameState.villagerTeamCount--;
															
                                delete gameState.playersInfo[playerID];
                                deadArrayID.push(playerID);
                                gameState.playersCount--;
                            }
                        }

                        gameState.playersID = gameState.playersID.filter(playerID => !deadArrayID.includes(playerID));

                        for (let index = 0; index < deadArrayID.length; index++) {
                            deadArrayName.push(usersInfo[deadArrayID[index]].fullName);
                            await message.send(killedNotificateSentences[random(0, killedNotificateSentences.length)], deadArrayID[index]);
                        }

                        await delay(3000);
                        await message.send(startDaySentences[random(0, startDaySentences.length)]);
                        await delay(3000);
                        await message.send(lastNightNotificateSentences(deadArrayName)[random(0, lastNightNotificateSentences(deadArrayName).length)]);
                        stop();
                    });
                }
                const processVote = async () => {
                    return new Promise(async stop => {
                        let inputCount = 1, inputMessageID, inputMessage = "", inputArray = [];

                        await delay(3000);
                        await message.send(startElectSentences[random(0, startElectSentences.length)]);

                        Object.keys(gameState.playersInfo).forEach(player => {
                            inputMessage += `${inputCount} - ${usersInfo[player].fullName}` + "\n";
                            inputArray.push(player);
                            inputCount++;
                        });

                        for (let index = 0; index < gameState.playersID.length; index++) {
                            const playerID = gameState.playersID[index];

                            await message.send(electIntroduceSentences[random(0, electIntroduceSentences.length)], playerID);
                            inputMessageID = (await message.send(inputMessage, playerID)).messageID;

                            gameState.playersInfo[playerID].elect.listen = true;
                            gameState.playersInfo[playerID].elect.listenMessageID = inputMessageID;
                            gameState.playersInfo[playerID].elect.listenThreadID = playerID;
                            gameState.playersInfo[playerID].elect.listenSenderID = playerID;
                            gameState.playersInfo[playerID].elect.selectorArray = inputArray;
                        }

                        gameState.voteStart = true;
                        stop();
                    });
                }
                const processAbilities = (night) => {
                    return new Promise(async stop => {
                        for (let index = 1; index <= 3; index++) {
                            await delay(3000);
                            await message.send(index.toString());
                        }

                        await message.send(startNightSentences(night + 1)[random(0, startNightSentences(night + 1).length)]);

                        for (let index = 0; index < Object.keys(gameState.playersInfo).length; index++) {
                            let inputCount = 1, inputMessageID, inputMessage = "", inputArray = [];
                            const playerIDs = Object.keys(gameState.playersInfo);
                            const playerAbility = gameState.playersAbility;
                            const playersInfo = gameState.playersInfo;

                            playersInfo[playerIDs[index]].life = 1;
                            switch(playersInfo[playerIDs[index]].clan) {
                                case "villager":
                                    gameState.money[playerIDs[index]] += 5000 * (night + 1);
                                break;
                                case "werewolf":
                                    gameState.money[playerIDs[index]] += Math.round((3000 * gameState.villagerTeamCount * (night + 1)) / gameState.werewolfTeamCount);
                                break;
                            }

                            switch(playersInfo[playerIDs[index]].role) {
                                case "werewolf":
                                    await message.send(werewolfAbilitySentences[random(0, werewolfAbilitySentences.length)], playerIDs[index]);

                                    Object.keys(playersInfo).forEach(player => {
                                        if (playersInfo[player].clan != "werewolf") {
                                            inputMessage += `${inputCount} - ${usersInfo[player].fullName}\n`;
                                            inputArray.push(player);
                                            inputCount++;
                                        }
                                    });

                                    inputMessageID = (await message.send(inputMessage, playerIDs[index])).messageID;

                                    playerAbility["werewolf"] = {
                                        listen: true,
                                        listenMessageID: inputMessageID,
                                        listenThreadID: playerIDs[index],
                                        listenSenderID: playerIDs[index],
                                        selectorArray: inputArray,
                                        selectorID: null
                                    }
                                break;
                                case "oldwolf":
                                    await message.send(oldwolfAbilitySentences[random(0, oldwolfAbilitySentences.length)], playerIDs[index]);

                                    Object.keys(playersInfo).forEach(player => {
                                        if (playersInfo[player].clan != "werewolf") {
                                            inputMessage += `${inputCount} - ${usersInfo[player].fullName}\n`;
                                            inputArray.push(player);
                                            inputCount++;
                                        }
                                    });

                                    inputMessageID = (await message.send(inputMessage, playerIDs[index])).messageID;

                                    playerAbility["oldwolf"] = {
                                        listen: true,
                                        listenMessageID: inputMessageID,
                                        listenThreadID: playerIDs[index],
                                        listenSenderID: playerIDs[index],
                                        selectorArray: inputArray,
                                        selectorID: null
                                    }
                                break;
                                case "defender":
                                    await message.send(defenderAbilitySentences[random(0, defenderAbilitySentences.length)], playerIDs[index]);

                                    Object.keys(playersInfo).forEach(player => {
                                        inputMessage += `${inputCount} - ${usersInfo[player].fullName}` + "\n";
                                        inputArray.push(player);
                                        inputCount++;
                                    });

                                    inputMessageID = (await message.send(inputMessage, playerIDs[index])).messageID;

                                    playerAbility["defender"] = {
                                        listen: true,
                                        listenMessageID: inputMessageID,
                                        listenThreadID: playerIDs[index],
                                        listenSenderID: playerIDs[index],
                                        selectorArray: inputArray,
                                        selectorID: null
                                    }
                                break;
                                case "hunter":
                                    await message.send(hunterAbilitySentences[random(0, hunterAbilitySentences.length)], playerIDs[index]);

                                    Object.keys(playersInfo).forEach(player => {
                                        if (player != playerIDs[index]) {
                                            inputMessage += `${inputCount} - ${usersInfo[player].fullName}` + "\n";
                                            inputArray.push(player);
                                            inputCount++;
                                        }
                                    });

                                    inputMessageID = (await message.send(inputMessage, playerIDs[index])).messageID;

                                    playerAbility["hunter"] = {
                                        listen: true,
                                        listenMessageID: inputMessageID,
                                        listenThreadID: playerIDs[index],
                                        listenSenderID: playerIDs[index],
                                        selectorArray: inputArray,
                                        selectorID: null
                                    }
                                break;
                                case "seer":
                                    await message.send(seerAbilitySentences[random(0, seerAbilitySentences.length)], playerIDs[index]);

                                    Object.keys(playersInfo).forEach(player => {
                                        if (player != playerIDs[index]) {
                                            inputMessage += `${inputCount} - ${usersInfo[player].fullName}` + "\n";
                                            inputArray.push(player);
                                            inputCount++;
                                        }
                                    });

                                    inputMessageID = (await message.send(inputMessage, playerIDs[index])).messageID;
                                    
                                    playerAbility["seer"] = {
                                        listen: true,
                                        listenMessageID: inputMessageID,
                                        listenThreadID: playerIDs[index],
                                        listenSenderID: playerIDs[index],
                                        selectorArray: inputArray,
                                        selectorID: null
                                    }
                                break;
                            }
                        }

                        gameState.nightPlay++;
                        stop();
                    });
                }
                const startGame = async () => {
                    let  startTagMessage = "", startTagArray = [], attachmentArray = [
                        fs.createReadStream(resolve(werewolfAssetsPath, "villager.png")),
                        fs.createReadStream(resolve(werewolfAssetsPath, "defender.png")),
                        fs.createReadStream(resolve(werewolfAssetsPath, "seer.png")),
                        fs.createReadStream(resolve(werewolfAssetsPath, "werewolf.png"))
                    ];


                    // --- < CẬP NHẬT THÔNG SỐ GAME > --- //
                    if (gameState.playersCount >= 8) {
                        gameState.roleCount = 6;
                        attachmentArray.push(fs.createReadStream(resolve(werewolfAssetsPath, "hunter.png")));
                        attachmentArray.push(fs.createReadStream(resolve(werewolfAssetsPath, "oldwolf.png")));
                    }
                    else if (gameState.playersCount >= 6) {
                        gameState.roleCount = 5;
                        gameState.roleAvailable["oldwolf"] = false;
                        attachmentArray.push(fs.createReadStream(resolve(werewolfAssetsPath, "hunter.png")));
                    }
                    else {
                        gameState.roleCount = 4;
                        gameState.roleAvailable["hunter"] = false;
                        gameState.roleAvailable["oldwolf"] = false;
                    }

                    gameState.start = true;
                    gameState.werewolfTeamCount = gameState.roleCount == 6 ? 2 : 1;
                    gameState.villagerTeamCount = gameState.playersCount - gameState.werewolfTeamCount;



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
                    const startInfoSource = [
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
                            info: "Số vai trò",
                            content: gameState.roleCount
                        },
                    ];

                    const renderTable = TableRenderer({ paddingHorizontal: 30, paddingVertical: 30, titleSpacing: 20, fontFamily: "Quicksand" }).render;
                    const canvasTable = renderTable({
                        title: "THÔNG TIN GAME MA SÓI",
                        titleStyle: {
                            font: "normal 30px Bungee",
                            fillStyle: "#30343f"
                        },
                        columns: [
                            { width: 200, title: "THÔNG TIN", dataIndex: "info" },
                            { width: 300, title: "NỘI DUNG", dataIndex: "content" }
                        ],
                        dataSource: startInfoSource
                    });
            
                    await saveImage(canvasTable, resolve(cachesPath, "werewolfStartInfo.png"));

                    
                    // --- < GỬI TIN NHẮN KHỞI ĐỘNG GAME > --- //
                    await message.send({
                        body: `- NGƯỜI CHƠI:${startTagMessage}`,
                        mentions: startTagArray,
                        attachment: fs.createReadStream(resolve(cachesPath, "werewolfStartInfo.png"))
                    });

                    await message.send({
                        body: "- LUẬT CHƠI VÀ LƯU Ý:",
                        attachment: fs.createReadStream(resolve(werewolfAssetsPath, "rule.png"))
                    });

                    await message.send({
                        body: "- CÁC VAI TRÒ TRONG GAME:",
                        attachment: attachmentArray
                    });

                    
                    // --- < PHÂN VAI TRÒ TRONG GAME > --- //
                    const rolePosition = {
                        "werewolf": -1,
                        "oldwolf": -1,
        
                        "defender": -1,
                        "hunter": -1,
                        "seer": -1,
                    }
                    
                    for (let index = 0; index < Object.keys(rolePosition).length; index++) {
                        if (!gameState.roleAvailable[Object.keys(rolePosition)[index]]) continue;

                        while (true) {
                            const ranPos = random(0, gameState.playersCount);
                            if (!Object.values(rolePosition).includes(ranPos)) {
                                rolePosition[Object.keys(rolePosition)[index]] = ranPos;
                                break;
                            }
                        }
                    }
                   
                    await message.send(sendRoleNotificateSentences[random(0, sendRoleNotificateSentences.length)]);
                    for (let index = 0; index < gameState.playersID.length; index++) {
                        let roleIntroductionPath, roleName = "villager";

                        for (let i = 0; i < Object.keys(rolePosition).length; i++)
                            if (rolePosition[Object.keys(rolePosition)[i]] == index) roleName = Object.keys(rolePosition)[i];

                        const playerInfo = {
                            role: roleName,
                            clan: (roleName == "werewolf" || roleName == "oldwolf") ? "werewolf" :  "villager",
                            life: 1,
                            elect: {
                                listen: false,
                                listenMessageID: null,
                                listenThreadID: null,
                                listenSenderID: null,
                                selectorID: null,
                                selectorArray: [],
                                elected: 0
                            },
                        }

                        gameState.money[gameState.playersID[index]] = 0;
                        gameState.playersInfo[gameState.playersID[index]] = playerInfo;
                        roleIntroductionPath = resolve(werewolfAssetsPath, `${gameState.playersInfo[gameState.playersID[index]].role}Card.png`);

                        await message.send({
                            body: sendRoleSentences[random(0, sendRoleSentences.length)],
                            attachment: fs.createReadStream(roleIntroductionPath)
                        }, gameState.playersID[index]);
                    }

                    
                    // --- < KHỞI ĐỘNG GAME > --- //
                    await processAbilities(gameState.nightPlay);
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
                    let winnerTagMessage = "", winnerTagArray = [], winnerArray = [];

                    if (gameState.villagerTeamCount <= 0 || gameState.villagerTeamCount == gameState.werewolfTeamCount) {
                        gameState.werewolfTeamState = true;
                        gameState.over = true;

                        for (let index = 0; index < Object.keys(gameState.playersInfo).length; index++)
                            if (gameState.playersInfo[Object.keys(gameState.playersInfo)[index]].clan == "werewolf")
                                winnerArray.push(Object.keys(gameState.playersInfo)[index]);

                        await delay(1500);
                        await message.send(gameOverSentences[random(0, gameOverSentences.length)]);
                        await message.send(werewolfTeamWinSentences[random(0, werewolfTeamWinSentences.length)]);
                    }

                    if (gameState.werewolfTeamCount <= 0) {
                        gameState.villagerTeamState = true;
                        gameState.over = true;

                        for (let index = 0; index < Object.keys(gameState.playersInfo).length; index++)
                            if (gameState.playersInfo[Object.keys(gameState.playersInfo)[index]].clan == "villager")
                                winnerArray.push(Object.keys(gameState.playersInfo)[index]);

                        await delay(1500);
                        await message.send(gameOverSentences[random(0, gameOverSentences.length)]);
                        await message.send(villagerTeamWinSentences[random(0, villagerTeamWinSentences.length)]);
                    }

                    if (winnerArray.length > 0) {
                        winnerArray.forEach((player) => {
                            const playerInfo = usersInfo[player];
                            winnerTagMessage += ` @${playerInfo.fullName}`;
                            winnerTagArray.push({
                                tag: `@${playerInfo.fullName}`,
                                id: player
                            });
                            
                            global.gamesStatistic[player].werewolf.winCount++;
                        });
    
                        await message.send({
                            body: `- NGƯỜI THẮNG CUỘC:${winnerTagMessage}`,
                            mentions: winnerTagArray,
                        });

                        await processGameOverMoney();
                    }
                }
                

                // --- < KIỂM TRA GAME OVER > --- //
                if (gameState.start && !gameState.over) checkGameOver();
                if (gameState.over) {
                    stopPromise();
                    return;
                }


                // --- < KIỂM TRA NHẬP GIÁ TRỊ GAME > --- //
                if (gameState.lastNightPlay < gameState.nightPlay) {
                    let checkAbilitiesUsed = true, checkVoteUsed = true;

                    for (const role in gameState.playersAbility)
                        if (gameState.playersAbility[role].listen) checkAbilitiesUsed = false;
                        
                    if (checkAbilitiesUsed && !gameState.dayPlay && !gameState.over) {
                        gameState.dayPlay = true;
                        
                        await processNotification();
                        await processVote();
                    }

                    for (const playerID in gameState.playersInfo)
                        if (gameState.playersInfo[playerID].elect.listen) checkVoteUsed = false;

                    if (checkVoteUsed && gameState.voteStart) {
                        gameState.voteStart = false;

                        const maxElected = {
                            count: -1,
                            id: null
                        }

                        for (const playerID in gameState.playersInfo) {
                            const elected = gameState.playersInfo[playerID].elect.elected;

                            if (elected > maxElected.count) {
                                maxElected.count = elected;
                                maxElected.id = playerID;
                            }
                        }

                        gameState.playersCount--;
                        if (gameState.playersInfo[maxElected.id].clan == "werewolf") gameState.werewolfTeamCount--;
                        else gameState.villagerTeamCount--;

                        gameState.playersInfo[maxElected.id].life = 0;
                        gameState.playersID = gameState.playersID.filter(playerID => playerID != maxElected.id);
                        delete gameState.playersInfo[maxElected.id];
                        
                        await message.send(deadNotificateSentences[random(0, deadNotificateSentences.length)], maxElected.id);
                        await message.send(executedNotificateSentences(usersInfo[maxElected.id].fullName, maxElected.count)[random(0, executedNotificateSentences(usersInfo[maxElected.id].fullName, maxElected.count).length)]);

                        gameState.lastNightPlay++;
                        gameState.dayPlay = false;

                        if (!gameState.over) {
                            await delay(3000);
                            await processAbilities(gameState.nightPlay);
                        }
                    }
                }

                const inGameMessage = event.body;
                const inGameMessageID = event.messageID;
                const inGameMessageReply = event.messageReply;
                const inGameSenderID = event.senderID;
                const inGameThreadID = event.threadID;

                switch(event.type) {
                    case "message_reply":
                        checkGameCommand();
                        
                        // --- < KIỂM TRA NGƯỜI CHƠI THAM GIA > --- //
                        if (!gameState.start && inGameMessageReply.messageID == confirmMessageID) {
                            if (!gameState.playersID.includes(inGameSenderID)) {
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
                        for (let index = 0; index < Object.keys(gameState.playersAbility).length; index++) {
                            const role = Object.keys(gameState.playersAbility)[index];
                            const roleAbility = gameState.playersAbility[role];
                            const selectorID = parseInt(inGameMessage);

                            if (
                                roleAbility.listen &&
                                inGameMessageReply.messageID == roleAbility.listenMessageID &&
                                inGameThreadID == roleAbility.listenThreadID &&
                                inGameSenderID == roleAbility.listenSenderID
                            ) {
                                if ((!isNaN(selectorID)) && (selectorID > 0) && (selectorID < (role == "defender") ? gameState.playersCount + 1 : gameState.playersCount)) {
                                    roleAbility.selectorID = selectorID - 1;
                                    roleAbility.listen = false;

                                    const selectedPlayerID = roleAbility.selectorArray[roleAbility.selectorID];

                                    switch(role) {
                                        case "werewolf":
                                            gameState.playersInfo[selectedPlayerID].life--;
                                            message.react("🔹", inGameMessageID);
                                            message.send(roleAbilityUsedNotificateSentences(0)[random(0, roleAbilityUsedNotificateSentences(0).length)]);
                                        break;
                                        case "oldwolf":
                                            gameState.playersInfo[selectedPlayerID].life--;
                                            message.react("🔹", inGameMessageID);
                                            message.send(roleAbilityUsedNotificateSentences(1)[random(0, roleAbilityUsedNotificateSentences(1).length)]);
                                        break;
                                        case "defender":
                                            gameState.playersInfo[selectedPlayerID].life++;
                                            message.react("🔹", inGameMessageID);
                                            message.send(roleAbilityUsedNotificateSentences(2)[random(0, roleAbilityUsedNotificateSentences(2).length)]);
                                        break;
                                        case "hunter":
                                            gameState.playersInfo[selectedPlayerID].life--;
                                            message.react("🔹", inGameMessageID);
                                            message.send(roleAbilityUsedNotificateSentences(3)[random(0, roleAbilityUsedNotificateSentences(3).length)]);
                                        break;
                                        case "seer":
                                            const selectorClan = gameState.playersInfo[selectedPlayerID].clan;
                                            message.react("🔹", inGameMessageID);
                                            message.send(selectorClan == "werewolf" ? "Là Ma Sói" : "Không phải Ma Sói", inGameThreadID, inGameMessageID);
                                            message.send(roleAbilityUsedNotificateSentences(4)[random(0, roleAbilityUsedNotificateSentences(4).length)]);
                                        break;
                                    }
                                }
                                else {
                                    message.react("⭕️", inGameMessageID);
                                    message.send(errorInputSentences[random(0, errorInputSentences.length)], inGameThreadID, inGameMessageID);
                                }
                            }
                        }

                        for (let index = 0; index < Object.keys(gameState.playersInfo).length; index++) {
                            const playerElect = gameState.playersInfo[Object.keys(gameState.playersInfo)[index]].elect;
                            const selectorID = parseInt(inGameMessage);

                            if (
                                playerElect.listen &&
                                inGameMessageReply.messageID == playerElect.listenMessageID &&
                                inGameThreadID == playerElect.listenThreadID &&
                                inGameSenderID == playerElect.listenSenderID
                            ) {
                                if ((!isNaN(selectorID)) && (selectorID > 0) && (selectorID < gameState.playersCount + 1)) {
                                    playerElect.selectorID = selectorID - 1;
                                    playerElect.listen = false;

                                    const selectedPlayerID = playerElect.selectorArray[playerElect.selectorID];
                                    gameState.playersInfo[selectedPlayerID].elect.elected++;

                                    message.react("🔹", inGameMessageID);
                                    await message.send(electedNotificateSentences(usersInfo[inGameSenderID].shortName)[random(0, electedNotificateSentences(usersInfo[inGameSenderID].shortName).length)]);
                                }
                                else {
                                    message.react("⭕️");
                                    message.send(errorInputSentences[random(0, errorInputSentences.length)], inGameThreadID, inGameMessageID);
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