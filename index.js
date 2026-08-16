/* -------------------------------------
    < INDEX > --- < KHỞI CHẠY BOT >
-------------------------------------- */

// ----- < [ KHAI BÁO ] - REQUIRE MODULE CẦN THIẾT > ----- //
const { spawn } = require("child_process");
const { logger } = require("./controllers/build/logger");
let restartCount = 0;

// ----- < [ HÀM ] - KHỞI CHẠY CODE > ----- //
function start() {
    const processBot = spawn("node", ["--trace-warnings", "--experimental-import-meta-resolve", "--expose-gc", "controllers/build/build.js"], {
        cwd: process.cwd(),
        stdio: "inherit"
    });
    processBot.on("close", async (code) => {
        handleRestartCount();
        if (code !== 0 && restartCount < 2) {
            logger.error(`An error occurred with exit code ${code}`);
            logger.warn(`Restarting SuaBot [${restartCount}]`);
            await new Promise((resolve) => setTimeout(resolve, 2000));
            console.log();
            start();
        } else {
            logger.error("Suabot has been closed !");
        }
    });
}

// ----- < [ HÀM ] - XỬ LÍ KHỞI ĐỘNG LẠI > ----- //
function handleRestartCount() {
    restartCount++;
    setTimeout(() => {
        restartCount--;
    }, 60000);
}

start();
