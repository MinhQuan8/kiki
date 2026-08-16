/* -----------------------------------------------------------
    < DATABASE > --- < XÂY DỰNG CƠ SỞ DỮ LIỆU NGƯỜI DÙNG >
------------------------------------------------------------- */

// ----- < [ KHAI BÁO ] - REQUIRE MODULE CẦN THIẾT > ----- //
const fs = require("fs");
const { logger } = require("./logger");

// ----- < [ HÀM ] - CẬP NHẬT DỮ LIỆU VÀO CƠ SỞ DỮ LIỆU > ----- //
function updateUsersInfo(usersInfo) {
    logger.system("Updating users information");
    fs.writeFileSync(global.usersInfoPath, JSON.stringify(usersInfo, null, 4), "utf8");
}

// ----- < [ HÀM ] - ĐỌC DỮ LIỆU VÀO CƠ SỞ DỮ LIỆU > ----- //
function readUsersInfo() {
    logger.system("Reading users information");
    const usersData = JSON.parse(fs.readFileSync(global.usersInfoPath, "utf8"));
    if (JSON.stringify(usersData) !== "{}") return usersData;
    else return false;
}

// ----- < [ HÀM ] - GHI DỮ LIỆU VÀO CƠ SỞ DỮ LIỆU > ----- //
function writeUsersInfo(threadList) {
    logger.system("Writing users information");

    const { adminID } = global;
    const { random } = global.function;
    const maleVocative = ["anh", "em trai", "em troai", "anh trai", "anh troai", "thg lồn", "thg mặt căk", "thg ngu"];
    const femaleVocative = ["chị", "chụy", "em gái", "em goái", "chị gái", "chị goái", "con đĩ", "đĩ", "con điếm"];
    const unknowVocative = ["thg gay", "con lé", "thg gay lỏ", "con les", "sv lưỡng tính"];

    const lastUsersInfo = readUsersInfo();
    const lastGamesStatistic = JSON.parse(fs.readFileSync(global.gamesStatisticPath, "utf8"));

    const usersIDArray = [];
    const usersDataArray = [];
    const usersInfo = {};
    const threadsInfo = {};
    const usersGamesStatistic = {};

    threadList.forEach((thread) => {
        const threadInfo = {
            name: thread.name,
            image: thread.imageSrc,
            color: thread.color,
            nicknames: thread.nicknames,
            participants: thread.participants,
            adminIDs: thread.adminIDs,
            isGroup: thread.isGroup,
            status: !thread.adminIDs.includes(adminID) && thread.isGroup ? false : true
        };

        threadsInfo[thread.threadID] = threadInfo;

        thread.participants
            .filter((participant) => participant.accountType == "User")
            .forEach((user) => {
                if (!usersIDArray.includes(user.userID)) {
                    usersIDArray.push(user.userID);
                    usersDataArray.push(user);
                }
            });
    });

    for (let i = 0; i < usersIDArray.length; i++) {
        const userGamesStatistic = {};
        const userInfo = {
            userName: usersDataArray[i].username,
            fullName: usersDataArray[i].name,
            shortName: usersDataArray[i].shortName,

            gender: usersDataArray[i].gender,
            vocative: usersDataArray[i].gender == "MALE" ? maleVocative[random(0, maleVocative.length)] : usersDataArray[i].gender == "FEMALE" ? femaleVocative[random(0, femaleVocative.length)] : unknowVocative[random(0, unknowVocative.length)],

            profileUrl: usersDataArray[i].url,
            profileImage: usersDataArray[i].profilePicture,

            isFriend: usersDataArray[i].isViewerFriend,
            isBlocked: usersDataArray[i].isMessageBlockedByViewer,

            rank: usersIDArray[i] == global.adminID ? "ADMINISTRATOR" : lastUsersInfo.hasOwnProperty(usersIDArray[i]) && lastUsersInfo[usersIDArray[i]].rank == "MODERATOR" ? "MODERATOR" : "USER",
            money: lastUsersInfo.hasOwnProperty(usersIDArray[i]) ? lastUsersInfo[usersIDArray[i]].money : 1000,
            inventory: lastUsersInfo.hasOwnProperty(usersIDArray[i]) ? lastUsersInfo[usersIDArray[i]].inventory : {}
        };

        Object.keys(global.gamesName).forEach((gameName) => {
            lastGamesStatistic.hasOwnProperty(usersIDArray[i]) && lastGamesStatistic[usersIDArray[i]].hasOwnProperty(gameName)
                ? (userGamesStatistic[gameName] = lastGamesStatistic[usersIDArray[i]][gameName])
                : (userGamesStatistic[gameName] = {
                      playTimes: 0,
                      playTime: [],
                      winCount: 0,
                      totalBet: 0,
                      totalEarn: 0,
                      highestBet: 0,
                      highestEarn: 0
                  });
        });

        usersGamesStatistic[usersIDArray[i]] = userGamesStatistic;
        usersInfo[usersIDArray[i]] = userInfo;
    }

    fs.writeFileSync(global.usersInfoPath, JSON.stringify(usersInfo, null, 4), "utf8");
    fs.writeFileSync(global.threadsInfoPath, JSON.stringify(threadsInfo, null, 4), "utf8");
    fs.writeFileSync(global.gamesStatisticPath, JSON.stringify(usersGamesStatistic, null, 4), "utf8");

    global.usersInfo = JSON.parse(fs.readFileSync(global.usersInfoPath, "utf8"));
    global.threadsInfo = JSON.parse(fs.readFileSync(global.threadsInfoPath, "utf8"));
    global.gamesStatistic = JSON.parse(fs.readFileSync(global.gamesStatisticPath, "utf8"));
}

// ----- < [ EXPORT ] - XUẤT MODULE > ----- //
module.exports = {
    updateUsersInfo,
    readUsersInfo,
    writeUsersInfo
};
