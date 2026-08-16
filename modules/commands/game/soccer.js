/* -------------------------------
    < COMMAND > --- < SOCCER >
-------------------------------- */

// ----- < [ KHAI BÁO ] - REQUIRE MODULE CẦN THIẾT > ----- //
const fs = require("fs");
const https = require("https");
const moment = require("moment-timezone");
const { resolve } = require("path");
const { registerFont } = require("canvas");
const { saveImage } = require("table-renderer");
const TableRenderer = require("table-renderer").default;

// ----- < [ CONFIG ] - THÔNG TIN VỀ LỆNH > ----- //
const config = {
    name: "soccer",
    description: "Lệnh mô phỏng cá độ bóng đá.",
    type: "game",
    usage: "/kiki soccer [ COMMAND ]",
    condition: ["soccer", "football", "betsoccer", "betfootball", "bong da", "da bong", "scbet", "fbbet"],
    exception: [],
    permission: 0,
    priority: 2
}

// ----- < [ HÀM ] - XỬ LÍ LỆNH > ----- //
async function onCall({ message, args }) {
    await message.react("⏱");
    
    const { senderID } = message;
    const { usersInfo, cachesPath, gamesStatistic } = global;
    const { random, checkMessage, updateUsersInfo } = global.function;
    const { soccerMatchesOption, soccerMatches } = global.gamesInfo.soccer;
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
    const emptyUserSoccerBet = [
        "Đã cược đéo j đâu mà xem?",
        "Có cược cmj đâu mà đòi xem 🙂",
        "Đ có ccj để m xem 🙂",
        "Xem cl, có cược đéo đâu 🙂",
        "M chưa có cược ccj, xem thế đ nào đc 🙂?"
    ];
    const notEnoughtMoneySentences = [
        "Rách! Đéo đủ tiền cược 🙂",
        "Đỗ nghèo khỉ, m đéo ddu tiền để cá độ 🙂",
        "Rách vcl, đ đủ tiền cược 😏",
        "Nghèo cúc, đ đủ tiền cược 🙂",
        "Đcm nghèo rách còn đua đòi cá độ 🙂🙂?"
    ];
    const notFoundMatchSentences = [
        "Mã trận đéo tồn tại 🙂",
        "Trận lòn j v, ngu à 🙂?",
        "M kiếm mã trận đéo j v 🙂",
        "Lm đéo j có trận này 🙂!",
        "trận cặc j đấy? Lm đ j có?"
    ];
    const notFoundTeamSentences = [
        "Mã đội đéo tồn tại 🙂",
        "Đội lồn nào v, ngu à 🙂?",
        "M kiếm mã đội đéo j thế?",
        "Lm đéo j có đội này? Biết nhìn k?",
        "đội cặc nào đấy? Lm đ j có?"
    ];
    const quantityErrorSentences = [
        "Số lượng đéo j v 🙂",
        "Ngu à, nhập số lượng cặc j đấy 🙂?",
        "M bị occho à, số đ j v 🙂",
        "Não cặc chắc?, số lồn j đâu 🙂!",
        "Số lượng? Bị ngu à 🙂🙂"
    ];
    const betChangeTeamErrorSentences = [
        "Đụ mje cược đội r có cái lồn t cho cược lại 😏",
        "Có cl mà đòi cược lại 🙂",
        "Ngu thì chết cược lại cl?",
        "Dơ ác, nãy cược đội kia xog giờ đòi đổi 🙂?",
        "Đụ má cược r g đòi đổi đội 🙂"
    ];
    const finishedMatchErrorSentences = [
        "Trận đó hết cmnr",
        "Trận dó qua cmnr thg l",
        "Trận đó kết thúc r óc l 🙂",
        "Hết mẹ trận r cá clmm à?",
        "Lm mẹ j còn đá mà đòi cược 🙂?"
    ];
    const loseBetNotificateSentences = [
        "Có thắng cược đ đâu mà đòi 🙂",
        "Thắng đéo đâu mà đòi tiền?",
        "Lm mẹ j thắng cược mà đòi?",
        "Thua cmmr đòi clj?",
        "Đ thắng cược cx dám đi nhận 🙂?"
    ];
    const betNotificateSentences = (match, team, bet) => {
        return [
            `M vừa đặt cược ${bet} vào đội ${team} trong trận ${match}`,
            `M đã đặt cược ${bet} vô team ${team} trog trận ${match}`,
            `Sv này vừa mới đặt cược ${bet} vô đội ${team} trog trận ${match}`,
            `Vừa có một đứa óc lon cược ${bet} cho đội ${team} trobg trận ${match}`,
            `M đã thành công cược ${bet} vào team ${team} trong trận ${match}`,
        ]
    };
    const claimNotificateSentences = (money) => {
        return [
            `M vừa thắng cược ${money}`,
            `M thu ${money} tiền thắng cược thành công!`,
            `M đã nhận ${money} tiền thắng cược`,
            `M đã thắng được ${money} tiền cược`,
            `M vừa ms nhận ${money} tiền cược thành coog!~`
        ]
    };

    try {
        registerFont(resolve(assetsPath, "fonts", "Quicksand-Medium.ttf"), { family: "Quicksand" });
        registerFont(resolve(assetsPath, "fonts", "Bungee-Regular.ttf"), { family: "Bungee" });

        const getMatchData = async (matchID) => {
            return await new Promise(resolve => {
                https.get(Object.assign({...soccerMatchesOption}, { path: `/v4/matches/${matchID}` }), response => {
                    let result = "";
                    response.on("data", chunk => result += chunk);
                    response.on("end", () => resolve(JSON.parse(result)));
                });
            });
        }

        const userSoccerBet =
            usersInfo[senderID].inventory.hasOwnProperty("soccer") ?
            Object.keys(usersInfo[senderID].inventory.soccer)
                .filter(match => usersInfo[senderID].inventory.soccer[match].status)
                .reduce((object, current) => (object[current] = usersInfo[senderID].inventory.soccer[current], object), {})
            : {};

        if (args.length == 0) {
            const dataSource = [ "-" ];

            if (Object.keys(userSoccerBet).length == 0) {
                message.react("⭕️");
                message.reply(emptyUserSoccerBet[random(0, emptyUserSoccerBet.length)]);
                return;
            }

            Object.keys(userSoccerBet).forEach((match, index) => {
                const dataObject = {
                    num: new Intl.NumberFormat("en-US", { minimumIntegerDigits: 2 }).format(index + 1),
                    date: userSoccerBet[match].date,
                    competition: userSoccerBet[match].competition,
                    homeTeam: userSoccerBet[match].homeTeam,
                    awayTeam: userSoccerBet[match].awayTeam,
                    betTeam: userSoccerBet[match].betTeam == 1 ? userSoccerBet[match].homeTeam : userSoccerBet[match].awayTeam,
                    winner: userSoccerBet[match].winner == null ? "-" : userSoccerBet[match].winner == 1 ? userSoccerBet[match].homeTeam : userSoccerBet[match].awayTeam,
                    bet: userSoccerBet[match].bet,
                    earn: userSoccerBet[match].earn == 0 ? "-" : userSoccerBet[match].earn,
                    status: userSoccerBet[match].status
                };

                dataSource.push(dataObject);
            });

            const renderTable = TableRenderer({ paddingHorizontal: 30, paddingVertical: 30, titleSpacing: 20, fontFamily: "Quicksand" }).render;
            const canvasTable = renderTable({
                title: `THÔNG TIN TRẬN CƯỢC - ${usersInfo[senderID].fullName}`,
                titleStyle: {
                    font: "normal 30px Bungee",
                    fillStyle: "#30343f"
                },
                columns: [
                    { width: 75, title: "STT", dataIndex: "num" },
                    { width: 125, title: "NGÀY ĐẤU", dataIndex: "date" },
                    { width: 200, title: "MÙA GIẢI", dataIndex: "competition" },
                    { width: 175, title: "ĐỘI NHÀ", dataIndex: "homeTeam" },
                    { width: 175, title: "ĐỘI KHÁCH", dataIndex: "awayTeam" },
                    { width: 175, title: "ĐỘI CƯỢC", dataIndex: "betTeam" },
                    { width: 175, title: "ĐỘI THẮNG", dataIndex: "winner" },
                    { width: 150, title: "TIỀN CƯỢC", dataIndex: "bet" },
                    { width: 150, title: "TIỀN THẮNG", dataIndex: "earn" },
                    { width: 150, title: "TRẠNG THÁI", dataIndex: "status" },
                ],
                dataSource: dataSource
            });

            await saveImage(canvasTable, resolve(cachesPath, "userSoccerBet.png"));
            message.reply({ attachment: fs.createReadStream(resolve(cachesPath, "userSoccerBet.png")) });
            message.react("🔹");
            return;
        }

        if (checkMessage(args[0], ["list", "menu", "danh sach", "tran", "match", "matches"])) {
            const dataSource = [ "-" ];

            console.log(soccerMatches)
            soccerMatches.filter(match => match.status == "TIMED").forEach((match, index) => {
                const dataObject = {
                    num: new Intl.NumberFormat("en-US", { minimumIntegerDigits: 2 }).format(index + 1),
                    id: match.id,
                    area: match.area.name,
                    competition: match.competition.name,
                    homeTeam: match.homeTeam.shortName,
                    awayTeam: match.awayTeam.shortName
                };

                dataSource.push(dataObject);
            })

            const renderTable = TableRenderer({ paddingHorizontal: 30, paddingVertical: 30, titleSpacing: 20, fontFamily: "Quicksand" }).render;
            const canvasTable = renderTable({
                title: "DANH SÁCH TRẬN ĐẤU ĐÃ LÊN LỊCH",
                titleStyle: {
                    font: "normal 30px Bungee",
                    fillStyle: "#30343f"
                },
                columns: [
                    { width: 75, title: "STT", dataIndex: "num" },
                    { width: 100, title: "MÃ TRẬN", dataIndex: "id" },
                    { width: 125, title: "KHU VỰC", dataIndex: "area" },
                    { width: 200, title: "MÙA GIẢI", dataIndex: "competition" },
                    { width: 175, title: "ĐỘI NHÀ (1)", dataIndex: "homeTeam" },
                    { width: 175, title: "ĐỘI KHÁCH (2)", dataIndex: "awayTeam" },
                ],
                dataSource: dataSource
            });

            await saveImage(canvasTable, resolve(cachesPath, "soccerMatches.png"));
            message.reply({ attachment: fs.createReadStream(resolve(cachesPath, "soccerMatches.png")) });
            message.react("🔹");
            return;
        }

        if (checkMessage(args[0], ["nhan", "lay", "claim", "pick"])) {
            const userMatches = Object.keys(userSoccerBet);
            let totalClaim = 0;
            
            for (const matchID of userMatches) {
                if (userSoccerBet[matchID].status != "UNDEFINED") continue;

                const matchData = await getMatchData(matchID);
                if (matchData.status != "FINISHED") continue;
                
                const score = Object.values(matchData.score.fullTime);
                const winner = matchData.score.winner;
                const winnerTeam = winner == "HOME_TEAM" ? 1 : 2;

                userSoccerBet[matchID].winner = winnerTeam;
                if (userSoccerBet[matchID].betTeam == winnerTeam) {
                    const earn = userSoccerBet[matchID].bet * (Math.abs(score[0] - score[1]) + 1);
                    userSoccerBet[matchID].status = "WIN";
                    userSoccerBet[matchID].earn = earn;
                    totalClaim += earn;
                }
                else userSoccerBet[matchID].status = "LOSE";
            }

            usersInfo[senderID].money += totalClaim;
            updateUsersInfo(usersInfo);

            message.reply(
                (totalClaim > 0) ? 
                claimNotificateSentences(totalClaim)[random(0, claimNotificateSentences(totalClaim).length)] : 
                loseBetNotificateSentences[random(0, loseBetNotificateSentences.length)]
            );
            message.react("🔹");
            return;
        }

        if (checkMessage(args[0], ["dat", "cuoc", "bet"]) && args.length > 2) {
            if (!usersInfo[senderID].inventory.hasOwnProperty("soccer")) usersInfo[senderID].inventory.soccer = {};
            const betMatch = +args[1];
            const betTeam = +args[2];
            const bet = +args[3];

            if (betTeam != 1 && betTeam != 2) {
                message.react("⭕️");
                message.reply(notFoundTeamSentences[random(0, notFoundTeamSentences.length)]);
                return;
            }

            if (!soccerMatches.filter(match => match.status == "TIMED").map(match => match.id).includes(betMatch)) {
                message.react("⭕️");
                message.reply(notFoundMatchSentences[random(0, notFoundMatchSentences.length)]);
                return;
            }

            if (isNaN(bet) || bet <= 0) {
                message.react("⭕️");
                message.reply(quantityErrorSentences[random(0, quantityErrorSentences.length)]);
                return;
            }
            
            if (bet > usersInfo[senderID].money) {
                message.react("⭕️");
                message.reply(notEnoughtMoneySentences[random(0, notEnoughtMoneySentences.length)]);
                return;
            }

            if (userSoccerBet.hasOwnProperty(betMatch) && userSoccerBet[betMatch].betTeam != betTeam) {
                message.react("⭕️");
                message.reply(betChangeTeamErrorSentences[random(0, betChangeTeamErrorSentences.length)]);
                return;
            }

            const betMatchInfo = soccerMatches.filter(match => match.status == "TIMED").find(match => match.id == betMatch);
            
            usersInfo[senderID].money -= +bet;
            usersInfo[senderID].inventory.soccer[betMatch] = {
                date: moment.utc(betMatchInfo.utcData).tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY"),
                competition: betMatchInfo.competition.name,
                homeTeam: betMatchInfo.homeTeam.shortName,
                awayTeam: betMatchInfo.awayTeam.shortName,
                betTeam: betTeam,
                bet: userSoccerBet.hasOwnProperty(betMatch) ? userSoccerBet[betMatch].bet + bet : bet,
                earn: 0,
                winner: null,
                status: "UNDEFINED"
            }
            
            updateUsersInfo(usersInfo);
            message.reply(betNotificateSentences(betMatch, betTeam, bet)[random(0, betNotificateSentences(betMatch, betTeam, bet).length)]);
            message.react("🔹");
            return;
        }

        message.react("⭕️");
        message.reply(notEnoughCommandSentences[random(0, notEnoughCommandSentences.length)]);
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