/* -----------------------------------------------
    < BUILD > --- < ĐĂNG NHẬP - XÂY DỰNG BOT >
-------------------------------------------------- */

// ----- < [ KHAI BÁO ] - REQUIRE MODULE CẦN THIẾT > ----- //
const login = require("@xaviabot/fca-unofficial");
const fs = require("fs");
const { resolve } = require("path");
const { logger } = require("./logger");
const { buildInit } = require("./init");
const { updateUsersInfo } = require("./database");
const { handleListen } = require("./../handle/listen");

// ----- < [ HÀM ] - CHẠY BOT > ----- //
async function start() {
    logger.system("Starting SuaBot");
    try {
        await buildInit();
        await botLogin();
        await global.function.createServer();
        logger.info("SuaBot launched successfully !");
    } catch (err) {
        logger.error(err);
    }
}

// ----- < [ HÀM ] - XỬ LÍ SAU KHI ĐĂNG NHẬP > ----- //
function botLogin() {
    logger.system("Handling API");
    return new Promise((resolve, reject) => {
        loginState()
            .then(async (api) => {
                api.getThreadList(10, null, [], (err, threadList) => {
                    console.log(threadList);
                    if (err) logger.error(err);
                    global.function.writeUsersInfo(threadList);
                });

                global.api = api;
                global.botID = await api.getCurrentUserID();
                global.botTag = (await api.getUserInfo(global.botID))[global.botID].name;
                global.listen = api.listenMqtt((err, event) => {
                    if (err) logger.error(err);
                    handleListen(event);
                });

                setInterval(() => {
                    updateUsersInfo(global.usersInfo);
                    global.function.updateGamesInfo();
                }, 60000);

                resolve();
            })
            .catch((err) => {
                logger.error(err);
                reject(err);
            });
    });
}

// ----- < [ HÀM ] - ĐĂNG NHẬP > ----- //
function loginState() {
    logger.system("Logging in Facebook");
    const credential = { appState: JSON.parse(fs.readFileSync(resolve(process.cwd(), "appstate.json"), "utf-8")) };
    const option = {
        selfListen: true,
        // logLevel: "silent",
        forceLogin: true,
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 OPR/133.0.0.0",
        listenEvents: true
    };

    return new Promise((resolve, reject) => {
        try {
            login(credential, option, async (err, api) => {
                if (err) return reject(err);
                resolve(api);
            });
        } catch (err) {
            logger.error(err);
            reject(err);
        }
    });
}

start();
