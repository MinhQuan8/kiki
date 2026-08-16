/* -------------------------------------------
    < COMMAND > --- < TOGGLE UP TIME BOT >
-------------------------------------------- */

// ----- < [ KHAI BÁO ] - REQUIRE MODULE CẦN THIẾT > ----- //
const request = require("request");

// ----- < [ CONFIG ] - THÔNG TIN VỀ LỆNH > ----- //
const config = {
    name: "toggleUpTime",
    description: "Lệnh bật / tắt uptime cho bot.",
    type: "admin",
    usage: "/kiki toggleUpTime [ OFF / ON ]",
    condition: ["toggleuptime", "uptime", "tup"],
    exception: [],
    permission: 3,
    priority: 3
}

// ----- < [ HÀM ] - XỬ LÍ LỆNH > ----- //
async function onCall({ message, args }) {
    await message.react("⏱");

    const { setConfig, readConfig, random, checkMessage } = global.function;
    const { botUrl } = global;
    const createOptions = {
        method: "POST",
        url: "https://api.uptimerobot.com/v2/newMonitor",
        headers:
        {
            "content-type": "application/x-www-form-urlencoded",
            "cache-control": "no-cache"
        },
        form: {
            api_key: "u1559692-2f4f5ff4be1679d573d9b701",
            format: "json",
    
            friendly_name: "SuaBot-V2.0",
            type: "1",
            url: botUrl,
        }
    };
    const deleteOptions = {
        method: "POST",
        url: "https://api.uptimerobot.com/v2/deleteMonitor",
        headers:
        {
            "content-type": "application/x-www-form-urlencoded",
            "cache-control": "no-cache"
        },
        form: {
            api_key: "u1559692-2f4f5ff4be1679d573d9b701",
            format: "json",
        }
    };
    const errorSentences = [
        "Đéo đc đại ka ơi :) lỗi cmnr",
        "Anh ơi em lam déo dc, bị con kac j r",
        "Loi cmnr 🙂 Ad ngu",
        "Loi roi thg ngu 🙂",
        "Anh Quan oi loi cmnr 🙂"
    ];
    const notFoundSentences = [
        "Tắt hay mở thg lon này? 🙂",
        "Đụ má có cái lệnh cx đéo bt dùng?? Tắt hay mở??",
        "Ngu lồn, r m tắt hay mở 🙂?",
        "Cmm ngu thé cơ à? Tat hay mở 🙂?",
        "Dốt vãi căc, lệnh cx đ bt dùng? Giờ m tắt hay mở? 🙂",
    ];
    const onSuccessfullySentences = [
        "Ok em mo roi do 😏",
        "Bo m mở r do 😏",
        "Mở cho tụi m r đáy 😏",
        "Rồi, mở xog r : )"
    ];
    const offSuccessfullySentences = [
        "Ok em tắt cho r 😏",
        "Roi tao tắt r : )",
        "Tắt r, cái mẹ j cx tới tay",
        "Xog r, ch thấy thg chủ nào phế như m",
        "Bố tắt hộ r, biết ơn đi 😏"
    ];

    try {
        const toggle = args.join(" ");
        
        const upTimeData = readConfig("upTimeBot");
        const createMonitor = () => {
            request(createOptions, (error, response, body) => {
                if (error) throw(error);

                setConfig("upTimeBot", JSON.parse(body));
                
                message.reply(onSuccessfullySentences[random(0, onSuccessfullySentences.length)]);
                message.react("🔹");
            });
        };
        const deleteMonitor = () => {
            deleteOptions.form.id = upTimeData.monitor.id;
            request(deleteOptions, (error) => {
                if (error) throw(error);

                setConfig("upTimeBot", {});

                message.reply(offSuccessfullySentences[random(0, offSuccessfullySentences.length)]);
                message.react("🔹");
            });
        };

        if (!toggle) {
            message.react("⭕️");
            message.reply(notFoundSentences[random(0, notFoundSentences.length)]);
            return;
        }
        if (JSON.stringify(upTimeData) == "{}") {
            if (checkMessage(toggle, ["on", "bat", "mo"])) createMonitor();
            else if (checkMessage(toggle, ["off", "tat", "dong"])) {
                message.reply(offSuccessfullySentences[random(0, offSuccessfullySentences.length)]);
                message.react("🔹");
            }
            return;
        }

        switch(upTimeData.stat) {
            case "ok":
                if (checkMessage(toggle, ["on", "bat", "mo"])) {
                    deleteOptions.form.id = upTimeData.monitor.id;
                    request(deleteOptions, (error) => {
                        if (error) throw(error);
                        createMonitor();
                    });
                }
                else if (checkMessage(toggle, ["off", "tat", "dong"])) deleteMonitor();
                else throw(error);
            break;
            case "fail":
                if (upTimeData.error.type == "already_exists") return;
                else if (checkMessage(toggle, ["on", "bat", "mo"])) {
                    message.reply(onSuccessfullySentences[random(0, onSuccessfullySentences.length)]);
                    message.react("🔹");
                }
                else if (checkMessage(toggle, ["off", "tat", "dong"])) deleteMonitor();
                else throw(error);
            break;
        }
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