/* -----------------------------------------------
    < COMMAND > --- < ELECTRON CONFIGURATION >
------------------------------------------------ */

// ----- < [ CONFIG ] - THÔNG TIN VỀ LỆNH > ----- //
const config = {
    name: "eConfiguration",
    description: "Lệnh trả về cấu hình electron dự vào số Z.",
    type: "tool",
    usage: "/kiki cấu hình e [ Z ]",
    condition: ["cau hinh e", "cau hinh electron", "cauhinhe", "cauhinh e", "cauhinhelectron", "cauhinh electron", "econfig"],
    exception: [],
    permission: 0,
    priority: 2
}

// ----- < [ HÀM ] - XỬ LÍ LỆNH > ----- //
async function onCall({ message, args }) {
    await message.react("⏱");
    
    const { random } = global.function;
    const errorSentences = [
        "Lỗi r, thg ad đâu lo đi fix đi 🙂",
        "Lỗi cmnr thử lại đi 🙂",
        "Lỗi r tại m đó, thử lại đi",
        "Ăn ở cak j mà lỗi r, thử lại đi 🙂",
        "Thử lại đi lỗi cmnr 🙂",
        "Djt cụ m lỗi r, thử lại xem",
        "Lỗi r , có cái lệnh cx k xog 🙂"
    ];
    const outElectronSentences = [
        "Nhập số ngu vl",
        "Nguu đéo chịu được",
        "Nhập nguu đ thể tả đc 🙂",
        "Nguu như này khỏi cứu 🙂",
        "Óc lồn 🙂",
        "Não cặc à, nhập đéo j v 🙂",
        "Đ bt dùng lệnh thì cút hộ"
    ];

    try {
        let Z = parseInt(args.join("")), shell = 0, subShell = 0, result = "", temp = Array.from(Array(8), () => new Array(5));
        const subShellNumberSymbol = {
            1: "¹",
            2: "²",
            3: "³",
            4: "⁴",
            5: "⁵",
            6: "⁶",
            7: "⁷",
            8: "⁸",
            9: "⁹",
            10: "¹⁰",
            11: "¹¹",
            12: "¹²",
            13: "¹³",
            14: "¹⁴"
        }
        const subShellNameSymbol = {
            0: "s",
            1: "p",
            2: "d",
            3: "f"
        }

        if (isNaN(Z)|| Z > 118 || Z < 1) {
            message.react("⭕️");
            message.reply(outElectronSentences[random(0, outElectronSentences.length)]);
            return;
        }
        
        while (Z > 0) {
            temp[shell][subShell] = Math.min(Z, subShell * 4 + 2);
            Z -= Math.min(Z, subShell * 4 + 2);
            subShell++;
        
            if ((subShell == 1 && shell < 1) || (subShell == 2 && shell < 7)) {
                subShell = 0;
                shell++;
            }
        
            if (Z > 0 && shell > 4 && subShell > 0) {
                temp[shell - 2][subShell + 2] = Math.min(Z, 14);
                Z -= Math.min(Z, 14);
        
                temp[shell - 1][subShell + 1] = Math.min(Z, 10);
                Z -= Math.min(Z, 10);
            }
            else if (Z > 0 && shell > 2 && subShell > 0) {
                temp[shell - 1][subShell + 1] = Math.min(Z, 10);
                Z -= Math.min(Z, 10);
                
                if (Z == 0 && (temp[shell - 1][subShell + 1] == 4 || temp[shell - 1][subShell + 1] == 9)) {
                    temp[shell - 1][subShell + 1]++;
                    temp[shell][subShell - 1]--;
                }
            }
        }
        
        for (let i = 0; i <= shell; i++) {
            let tempSubShell = 0;
            
            while (temp[i][tempSubShell] > 0) {
                let namesubShell = subShellNameSymbol[tempSubShell];
        
                result += `${i + 1}${namesubShell}${subShellNumberSymbol[temp[i][tempSubShell]]} `;
                tempSubShell++;
            }
        }
        
        message.reply(result);
        message.react("🔹");

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