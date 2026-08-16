/* -------------------------------------------------------------------
    < GLOBAL MODULE > --- < KHAI BÁO CÁC GIÁ TRỊ CỦA BIẾN GLOBAL >
--------------------------------------------------------------------- */

// ----- < [ KHAI BÁO ] - REQUIRE MODULE CẦN THIẾT > ----- //
const fs = require("fs");
const https = require("https");
const express = require("express");
const yahooFinance = require("yahoo-finance2").default;
const { resolve } = require("path");
const { updateUsersInfo, readUsersInfo, writeUsersInfo } = require("./database");
const { logger } = require("./logger");

// ----- < [ CONST ] - KHAI BÁO CÁC GIÁ TRỊ TRONG BIẾN GLOBAL > ----- //
const setGlobal = {
    mainPath: resolve(process.cwd()),
    controllersPath: resolve(process.cwd(), "controllers"),
    assetsPath: resolve(process.cwd(), "assets"),
    dataPath: resolve(process.cwd(), "controllers", "data"),
    cachesPath: resolve(process.cwd(), "controllers", "data", "caches"),
    messageCachesPath: resolve(process.cwd(), "controllers", "data", "messageCaches.json"),
    botMessageCachesPath: resolve(process.cwd(), "controllers", "data", "botMessageCaches.json"),
    botConfigsPath: resolve(process.cwd(), "controllers", "data", "botConfigs.json"),
    botBlacklistPath: resolve(process.cwd(), "controllers", "data", "botBlacklist.json"),
    giftCodesPath: resolve(process.cwd(), "controllers", "data", "giftCodes.json"),

    modulesPath: resolve(process.cwd(), "modules"),
    modules: new Object({
        commands: new Map(),
        commandsConfig: new Map(),

        communications: new Map(),
        communicationsConfig: new Map()
    }),

    usersInfoPath: resolve(process.cwd(), "controllers", "data", "usersInfo.json"),
    usersInfo: new Object(),
    usersData: new Object({
        lastSenderID: null,
        users: new Map()
    }),

    threadsInfoPath: resolve(process.cwd(), "controllers", "data", "threadsInfo.json"),
    threadsInfo: new Object(),

    gamesInfoPath: resolve(process.cwd(), "controllers", "data", "gamesInfo.json"),
    gamesStatisticPath: resolve(process.cwd(), "controllers", "data", "gamesStatistic.json"),

    adminID: "100070234073634",
    adminTag: "Quân",
    botID: null,
    botTag: null,
    botCall: ["kiki", "kikii", "kki", "/kiki", "bot", "chatbot", "thayoi", "havanthanh"],
    botUrl: null,

    api: null,
    listen: null,
    logger: logger,

    function: new Object({
        delay: function (time) {
            return new Promise((stop) => {
                setTimeout(() => {
                    stop();
                }, time);
            });
        },
        createServer: function () {
            const server = express();
            server.get("/", (req, res) => {
                res.sendFile(resolve(process.cwd(), "index.html"));
                const serverUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
                global.botUrl = serverUrl;
            });
            server.listen(3030, () => {
                logger.info("SuaBot server has been created !");
            });
        },
        setConfig: function (config, value) {
            const botConfigsPath = resolve(process.cwd(), "controllers", "data", "botConfigs.json");
            const botConfigs = JSON.parse(fs.readFileSync(botConfigsPath, "utf8"));
            botConfigs[config] = value;
            fs.writeFileSync(botConfigsPath, JSON.stringify(botConfigs, null, 4), "utf8");
        },
        readConfig: function (config) {
            const botConfigsPath = resolve(process.cwd(), "controllers", "data", "botConfigs.json");
            const botConfigs = JSON.parse(fs.readFileSync(botConfigsPath, "utf8"));
            return botConfigs[config];
        },
        updateGamesStatistic: function (gamesStatistic) {
            fs.writeFileSync(resolve(process.cwd(), "controllers", "data", "gamesStatistic.json"), JSON.stringify(gamesStatistic, null, 4));
        },
        setGamesInfo: function (game, value) {
            const gamesInfoPath = resolve(process.cwd(), "controllers", "data", "gamesInfo.json");
            const gamesInfo = JSON.parse(fs.readFileSync(gamesInfoPath, "utf8"));
            gamesInfo[game] = value;
            fs.writeFileSync(gamesInfoPath, JSON.stringify(gamesInfo, null, 4), "utf8");
        },
        readGamesInfo: function (game) {
            const gamesInfoPath = resolve(process.cwd(), "controllers", "data", "gamesInfo.json");
            const gamesInfo = JSON.parse(fs.readFileSync(gamesInfoPath, "utf8"));
            return gamesInfo[game];
        },
        updateGamesInfo: async function () {
            const financeDate = new Date();
            financeDate.setDate(new Date().getDate() - 3);
            global.gamesInfo.finance.stocksInfo = {};
            for (stock of global.gamesInfo.finance.stocksCode) global.gamesInfo.finance.stocksInfo[stock] = await yahooFinance.chart(stock, { period1: financeDate.toUTCString() });

            https.get(global.gamesInfo.soccer.soccerMatchesOption, (response) => {
                let result = "";
                response.on("data", (chunk) => (result += chunk));
                response.on("end", () => {
                    global.gamesInfo.soccer.soccerMatches = JSON.parse(result).matches;
                });
            });
        },
        updateUsersInfo: function (userInfo) {
            updateUsersInfo(userInfo);
        },
        readUsersInfo: function () {
            return readUsersInfo();
        },
        writeUsersInfo: function (threadList) {
            writeUsersInfo(threadList);
        },
        random: function (min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        },
        removeVietnamese: function (str) {
            str = str.toString();
            str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
            str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
            str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
            str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
            str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
            str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
            str = str.replace(/đ/g, "d");
            str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
            str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
            str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
            str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
            str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
            str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
            str = str.replace(/Đ/g, "D");
            str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, "");
            str = str.replace(/\u02C6|\u0306|\u031B/g, "");
            str = str.replace(/ + /g, " ");
            str = str.trim();
            return str;
        },
        checkMessage: function (message, conditionsArray, exceptionsArray) {
            const { removeVietnamese } = global.function;
            const messageRV = removeVietnamese(message);
            const messageArrayRV = removeVietnamese(message).split(" ");
            const messageArray = message.split(" ");
            const multiConditionsArray = [];
            const phraseConditionsArray = [];
            const phraseExceptionsArray = [];
            let output = false;

            if (exceptionsArray)
                exceptionsArray
                    .filter((exception) => exception.split(" ").length != 1)
                    .forEach((phraseException) => {
                        phraseExceptionsArray.push(phraseException);
                    });

            if (!conditionsArray) return;
            conditionsArray
                .filter((condition) => condition.split(" & ").length != 1)
                .forEach((multiCondition) => {
                    multiConditionsArray.push(multiCondition.split(" & "));
                });
            conditionsArray
                .filter((condition) => condition.split(" ").length != 1)
                .forEach((phraseCondition) => {
                    phraseConditionsArray.push(phraseCondition);
                });

            messageArray.forEach((word) => {
                if (exceptionsArray && exceptionsArray.includes(word)) return (output = false);
                if (conditionsArray.includes(removeVietnamese(word))) return (output = true);
            });

            if (message == "" && conditionsArray.includes("-")) return (output = true);

            if (phraseConditionsArray.length && output == false)
                phraseConditionsArray.forEach((phraseCondition) => {
                    if (phraseExceptionsArray.length)
                        phraseExceptionsArray.forEach((phraseException) => {
                            if (message.includes(phraseException)) return (output = false);
                            if (messageRV.includes(phraseCondition)) return (output = true);
                        });

                    if (messageRV.includes(phraseCondition)) return (output = true);
                });

            if (multiConditionsArray.length && output == false)
                multiConditionsArray.forEach((multiCondition) => {
                    let conditionsCount = 0;
                    multiCondition.forEach((condition) => {
                        if (messageArrayRV.includes(condition)) conditionsCount++;
                    });
                    if (conditionsCount == multiCondition.length) output = true;
                });

            return output;
        },
        stringToArrayInArray: function (array) {
            let newArray = [];
            array.forEach((element) => {
                element.split(" ").forEach((string) => {
                    newArray.push(string);
                });
            });
            return newArray;
        },
        countArrayElement: function (array, element) {
            let count = 0;
            array.forEach((value) => {
                if (value == element) count++;
            });
            return count;
        },
        moneyFormat: function (number, digits) {
            const symbols = [
                { value: 1, symbol: "" },
                { value: 1e3, symbol: "k" },
                { value: 1e6, symbol: "M" },
                { value: 1e9, symbol: "B" },
                { value: 1e12, symbol: "T" },
                { value: 1e15, symbol: "P" },
                { value: 1e18, symbol: "E" }
            ];
            const regexp = /\.0+$|(?<=\.[0-9]*[1-9])0+$/;
            const item = symbols.findLast((item) => number >= item.value);
            return item ? (number / item.value).toFixed(digits).replace(regexp, "").concat(item.symbol) : "0";
        }
    }),

    pornMode: JSON.parse(fs.readFileSync(resolve(process.cwd(), "controllers", "data", "botConfigs.json"), "utf8")).pornMode,

    gamesStatistic: null,
    gamesName: {
        werewolf: "Ma Sói",
        blackjack: "Xì Dách",
        beast: "Bầu Cua",
        finance: "Chứng Khoán",
        lottery: "Vé Số",
        pet: "Đá Gà",
        soccer: "Cá Độ Bóng Đá"
    },
    gamesInfo: new Promise(async (resolve) => {
        const financeDate = new Date();
        financeDate.setDate(new Date().getDate() - 3);

        resolve({
            finance: {
                stocksCode: ["AAPL", "AMZN", "META", "TSLA", "GOOG", "MSFT", "NFLX", "SHOP", "INTC", "MCD"],
                stocksInfo: (async () => {
                    const stocksCode = ["AAPL", "AMZN", "META", "TSLA", "GOOG", "MSFT", "NFLX", "SHOP", "INTC", "MCD"];
                    const stocksObject = {};
                    for (const stock of stocksCode) {
                        try {
                            stocksObject[stock] = await yahooFinance.chart(stock, {
                                period1: financeDate.toUTCString()
                            });
                        } catch (err) {
                            console.error(`Yahoo error (${stock}):`, err.message);
                            stocksObject[stock] = null;
                        }
                    }

                    return stocksObject;
                })()
            },
            soccer: {
                soccerMatchesOption: {
                    hostname: "api.football-data.org",
                    path: "/v4/matches/",
                    headers: {
                        "X-Auth-Token": "a089a5fcfc4e45eda6edb9beabcc7165"
                    }
                },
                soccerMatches: await new Promise((resolve) => {
                    https.get(
                        {
                            hostname: "api.football-data.org",
                            path: "/v4/matches/",
                            headers: {
                                "X-Auth-Token": "a089a5fcfc4e45eda6edb9beabcc7165"
                            }
                        },
                        (response) => {
                            let result = "";
                            response.on("data", (chunk) => (result += chunk));
                            response.on("end", () => resolve(JSON.parse(result).matches));
                        }
                    );
                })
            }
        });
    })
};

// ----- < [ HÀM ] - XÂY DỰNG BIẾN GLOBAL TỪ CÁC KHAI BÁO TRÊN > ----- //
async function buildGlobal() {
    logger.system("Initializing global values");

    global.mainPath = setGlobal.mainPath;
    global.controllersPath = setGlobal.controllersPath;
    global.assetsPath = setGlobal.assetsPath;
    global.dataPath = setGlobal.dataPath;
    global.cachesPath = setGlobal.cachesPath;
    global.messageCachesPath = setGlobal.messageCachesPath;
    global.botMessageCachesPath = setGlobal.botMessageCachesPath;
    global.botConfigsPath = setGlobal.botConfigsPath;
    global.botBlacklistPath = setGlobal.botBlacklistPath;
    global.giftCodesPath = setGlobal.giftCodesPath;

    global.modulesPath = setGlobal.modulesPath;
    global.modules = setGlobal.modules;

    global.usersInfoPath = setGlobal.usersInfoPath;
    global.usersInfo = setGlobal.usersInfo;
    global.usersData = setGlobal.usersData;

    global.threadsInfoPath = setGlobal.threadsInfoPath;
    global.threadsInfo = setGlobal.threadsInfo;

    global.gamesInfoPath = setGlobal.gamesInfoPath;
    global.gamesStatisticPath = setGlobal.gamesStatisticPath;

    global.adminID = setGlobal.adminID;
    global.adminTag = setGlobal.adminTag;
    global.botID = setGlobal.botID;
    global.botTag = setGlobal.botTag;
    global.botCall = setGlobal.botCall;
    global.botUrl = setGlobal.botUrl;

    global.api = setGlobal.api;
    global.listen = setGlobal.listen;
    global.logger = setGlobal.logger;
    global.time = setGlobal.time;

    global.function = setGlobal.function;

    global.pornMode = setGlobal.pornMode;

    global.gamesStatistic = setGlobal.gamesStatistic;
    global.gamesName = setGlobal.gamesName;
    global.gamesInfo = await setGlobal.gamesInfo;
}

// ----- < [ EXPORT ] - XUẤT MODULE > ----- //
module.exports = { buildGlobal };
