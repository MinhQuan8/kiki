/* ------------------------------------------------------------
    < LISTEN MODULE > --- < LẮNG NGHE VÀ XỬ LÍ TIN NHẮN >
------------------------------------------------------------- */

// ----- < [ KHAI BÁO ] - REQUIRE MODULE CẦN THIẾT > ----- //
const { handleMessage, handleCommand, handleCommunication } = require("./event");
const fs = require("fs");

// ----- < [ HÀM ] - LẮNG NGHE TIN NHẮN > ----- //
async function handleListen(event) {
    switch(event.type) {
        case "message" :
        case "message_reply" :
            const blacklist = Object.keys(JSON.parse(fs.readFileSync(global.botBlacklistPath, "utf8")));
            const threadStatus = global.threadsInfo.hasOwnProperty(event.threadID) ? global.threadsInfo[event.threadID].status : true;

            if (event.senderID != global.botID && !blacklist.includes(event.senderID) && threadStatus) handleCommand(event) || handleCommunication(event);
            handleMessage(event);
    }
}

// ----- < [ EXPORT ] - XUẤT MODULE > ----- //
module.exports = { handleListen };