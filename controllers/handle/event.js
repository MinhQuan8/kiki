/* -------------------------------------------------------
    < EVENTS MODULE > --- < XỬ LÍ SỰ KIỆN NHẬN ĐƯỢC >
-------------------------------------------------------- */


// ----- < [ KHAI BÁO ] - REQUIRE MODULE CẦN THIẾT > ----- //
const fs = require("fs");
const moment = require("moment-timezone");
const { logger } = require('../build/logger');

// ----- < [ HÀM ] - XỬ LÍ TIN NHẮN > ----- //
function handleMessage(event) {
    const { api, botID } = global;
    const { threadID, messageID, senderID, body, attachments } = event;

    switch(event.senderID) {
        case botID:
            const botMessageCaches = JSON.parse(fs.readFileSync(global.botMessageCachesPath, "utf8"));
            const botMessageCache = {
                "time": moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss - DD/MM/YYYY"),
                "thread": threadID,
                "message": body || attachments[0].url
            }

            botMessageCaches[messageID] = botMessageCache;
            fs.writeFileSync(global.botMessageCachesPath, JSON.stringify(botMessageCaches, null, 4), "utf8");
        break;
        default:
            // api.markAsReadAll();
            global.usersData.lastSenderID = senderID;
            global.usersData.users.set(senderID, {
                "threadID": threadID,
                "messageID": messageID,
                "messageContent": body,
                "onConversation": false,
                "onCommand": false
            });

            const messageLog = `${threadID} - ${global.usersInfo[senderID].fullName} |  ${body || attachments[0].url}`;
            const messageCaches = JSON.parse(fs.readFileSync(global.messageCachesPath, "utf8"));
            const messageCache = {
                "time": moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss - DD/MM/YYYY"),
                "thread": threadID,
                "sender": `${senderID} - ${global.usersInfo[senderID].fullName}`,
                "message": body || attachments[0].url
            };

            messageCaches[messageID] = messageCache;
            fs.writeFileSync(global.messageCachesPath, JSON.stringify(messageCaches, null, 4), "utf8");
            logger.message(messageLog);
    }       
}

// ----- < [ HÀM ] - THÊM CÁC GIÁ TRỊ ( SEND - REPLY - REACT ) CHO BIẾN EVENT > ----- //
function getExtraEventProperties(event) {
    const { threadID, messageID, senderID, body } = event;
    const { removeVietnamese, checkMessage } = global.function;
    const { api } = global;
    const extraEventProperties = {
        send: function (message, targetThreadID = null, targetMessageID = null) {
            return new Promise((resolve, reject) => {
                api.sendMessage(message, targetThreadID || threadID, (err, messageInfo) => {
                    if (err) reject(err)
                    else {
                        messageFunctionCallback();
                        resolve(messageInfo);
                    }
                }, targetMessageID || null);
            });
        },
        reply: function (message, targetThreadID = null) {
            return new Promise((resolve, reject) => {
                api.sendMessage(message, targetThreadID || threadID, (err, messageInfo) => {
                    if (err) reject(err);
                    else {
                        messageFunctionCallback();
                        resolve(messageInfo);
                    }
                }, messageID);
            });
        },
        react: function (emoji, targetMessageID = null) {
            return new Promise((resolve, reject) => {
                api.setMessageReaction(emoji, targetMessageID || messageID, (err, data) => {
                    if (err) reject(err);
                    else resolve(data);
                }, true);
            });
        },
        input: function (message, targetThreadID = null, targetMessageID = null) {
            return new Promise((resolve, reject) => {
                api.sendMessage(message, targetThreadID || threadID, (err, messageInfo) => {
                    if (err) reject(err);
                    else {
                        messageFunctionCallback();
                        const messageID = messageInfo.messageID;
                        api.listenMqtt((err, event) => { 
                            if (err) reject(err);
                            if (event.type == "message_reply" && event.messageReply.messageID == messageID) {
                                api.setMessageReaction("🔹", event.messageID, () => {}, true);
                                return resolve(event);
                            }
                        });
                    }
                }, targetMessageID || null);
            });
        },
    };

    const messageFunctionCallback = () => {
        const userData = global.usersData.users.get(senderID);
        const userRank = global.usersInfo[senderID].rank;
        const threadIsGroup = global.threadsInfo.hasOwnProperty(threadID) ? global.threadsInfo[threadID].isGroup : false;

        if (checkMessage(body.toLowerCase(), ["@" + removeVietnamese(global.botTag).toLowerCase(), ...global.botCall]))
        userData.onCommand = true;
        userData.onConversation = true;

        if (threadIsGroup) global.usersInfo[senderID].money += userRank == "ADMINISTRATOR" ? 1000 : userRank == "MODERATOR" ? 200 : 100;
        global.usersData.users.set(senderID, userData);

        setTimeout(() => {
            if (global.usersData.users.get(senderID).messageID != userData.messageID) return;

            userData.onConversation = false;
            userData.onCommand = false;
            global.usersData.users.set(senderID, userData);
        }, 45000);
    };

    return extraEventProperties;
}

// ----- < [ HÀM ] - KIỂM TRA QUYỀN HẠN CỦA NGƯỜI DÙNG > ----- //
function checkPermission(userID) {
    if (!global.usersInfo.hasOwnProperty(userID)) throw new Error("ID Đéo tồn tại?");
    
    const rankPermission = {
        "ADMINISTRATOR": 5,
        "MODERATOR": 1,
        "USER": 0
    }
    const permission = rankPermission[global.usersInfo[userID].rank];
    return permission;
}

// ----- < [ HÀM ] - TÌM KIẾM LỆNH PHÙ HỢP > ----- //
function findCommand(event) {
    const { senderID, body, args, isGroup } = event;
    const { removeVietnamese, checkMessage } = global.function;
    const { onCommand } = global.usersData.users.get(senderID) || false;
    const messageContent = body.toLowerCase();

    for (const item of global.modules.commandsConfig) {
        const commandName = item[0];
        const commandCondition = item[1].condition;
        const commandException = item[1].exception;
        switch (isGroup) {
            case true :
                if ((checkMessage(messageContent, ["@" + removeVietnamese(global.botTag).toLowerCase(), ...global.botCall]) || onCommand || (event.hasOwnProperty("messageReply") && event.messageReply.senderID == botID)) &&
                    checkMessage(args.filter(element => !global.botCall.includes(element.toLowerCase()) && !("@" + global.botTag.toLowerCase()).split(" ").includes(element.toLowerCase()) ).join(" ").toLowerCase(), commandCondition, commandException))
                    return commandName;
                break;
            case false :
                if (checkMessage(args.filter(element => !global.botCall.includes(element.toLowerCase()) && !("@" + global.botTag.toLowerCase()).split(" ").includes(element.toLowerCase()) ).join(" ").toLowerCase(), commandCondition, commandException)) return commandName;
                break;
        }
    }
}

// ----- < [ HÀM ] - XỬ LÍ LỆNH > ----- //
function handleCommand(event) {
    const { threadID, messageID, senderID, args } = event;
    const { random, stringToArrayInArray, removeVietnamese } = global.function;
    const { api } = global;
    const commandName = findCommand(event);
    const commandConfig = global.modules.commandsConfig.get(commandName);
    const command = global.modules.commands.get(commandName) || null;

    if (command == null) return false;
    
    const permission = commandConfig.permission;
    const userPermission = checkPermission(senderID);
    if (permission > userPermission) {
        const outPermissionSentences = [
            "M đ co quyền dùng lệnh 😏",
            "Tuổi cặc dùng lệnh này 😏",
            "M đéo p anh Quân, cúc 😏",
            "Kêu cmm a\nTuoi lon dug lệnh này",
            "Tuoi lon sai tao\nM đ có quyền dùng lenh này 😏",
            "Tủi cawk sai t làm lệnh này 😏",
            "Tuổi lồn dùng lệnh? Cút hộ"
        ];
        api.setMessageReaction("🚫", messageID, () => {}, true);
        api.sendMessage(outPermissionSentences[random(0, outPermissionSentences.length)], threadID, messageID);
        return;
    }

    const pornMode = global.pornMode;
    const commandType = commandConfig.type;
    if (!pornMode && commandType == "porn" && userPermission < 5) {
        const pornModeOffSentences = [
            "Porn con đĩ mẹ mày à?\nbớt dâm duc lại đi",
            "Anh t khóa lệnh pỏn r, đừng dâm nx",
            "Suýt ngày cứ sex, cúc 😏",
            "pỏn cc?",
            "Dâm dục, cúc hộ t cái 😏",
            "Sex ít thôi 😞",
            "Cút ngay hộ t, anh t tắt pỏn r con",
            "Thứ sv dâm loạn 😏"
        ];
        api.setMessageReaction("🔞", messageID, () => {}, true);
        api.sendMessage(pornModeOffSentences[random(0, pornModeOffSentences.length)], threadID, messageID);
        return;
    }

    const extraEventProperties = getExtraEventProperties(event);
    Object.assign(event, extraEventProperties);

    try {
        command({
            message: event,
            args: args.filter(element => 
                !stringToArrayInArray(commandConfig.condition).includes(removeVietnamese(element.toLowerCase())) &&
                !global.botCall.includes(element.toLowerCase()) &&
                !("@" + global.botTag).split(" ").includes(element.toLowerCase())
            )
        });
        
        return true;
    } catch (err) {
        console.log(err);
    }
}

// ----- < [ HÀM ] - TÌM KIẾM PHÉP GIAO TIẾP PHÙ HỢP > ----- //
function findCommunication(event) {
    const { senderID, body, args, isGroup } = event;
    const { removeVietnamese, checkMessage } = global.function;
    const { onConversation } = global.usersData.users.get(senderID) || false;
    const messageContent = body.toLowerCase();

    for (const item of global.modules.communicationsConfig) {
        const communicationName = item[0];
        const communicationCondition = item[1].condition;
        const communicationException = item[1].exception;
        switch (isGroup) {
            case true :
                if ((checkMessage(messageContent, ["@" + removeVietnamese(global.botTag).toLowerCase(), ...global.botCall]) || onConversation || (event.hasOwnProperty("messageReply") && event.messageReply.senderID == botID)) &&
                    checkMessage(args.filter(element => !global.botCall.includes(element.toLowerCase()) && !("@" + global.botTag.toLowerCase()).split(" ").includes(element.toLowerCase()) ).join(" ").toLowerCase().replace(/[\.,?!]/g, ""), communicationCondition, communicationException))
                    return communicationName;
                break;
            case false :
                if (checkMessage(args.filter(element => !global.botCall.includes(element.toLowerCase()) && !("@" + global.botTag.toLowerCase()).split(" ").includes(element.toLowerCase()) ).join(" ").toLowerCase().replace(/[\.,?!]/g, ""), communicationCondition, communicationException)) return communicationName;
                break;
        }
    }
}

// ----- < [ HÀM ] - XỬ LÍ GIAO TIẾP > ----- //
function handleCommunication(event) {
    const { senderID, args } = event;
    const communicationName = findCommunication(event);
    const { stringToArrayInArray, removeVietnamese } = global.function;
    const communicationConfig = global.modules.communicationsConfig.get(communicationName);
    const communication = global.modules.communications.get(communicationName) || null;

    if (communication == null) return false;
    
    const permission = communicationConfig.permission;
    const userPermission = checkPermission(senderID);
    if (permission > userPermission) return false;

    const extraEventProperties = getExtraEventProperties(event);
    Object.assign(event, extraEventProperties);

    try {
        communication({
            message: event,
            args: args.filter(element => 
                !stringToArrayInArray(communicationConfig.condition).includes(removeVietnamese(element.toLowerCase())) &&
                !global.botCall.includes(element.toLowerCase()) &&
                !("@" + global.botTag).split(" ").includes(element.toLowerCase())
            )
        });

        return true;
    } catch (err) {
        console.log(err);
    }
}

// ----- < [ EXPORT ] - XUẤT MODULE > ----- //
module.exports = {
    handleMessage,
    handleCommand,
    handleCommunication
}