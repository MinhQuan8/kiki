/* -------------------------------------------
    < COMMUNICATION > --- < SELF DEFENSE >
-------------------------------------------- */

// ----- < [ CONFIG ] - THÔNG TIN VỀ PHÉP GIAO TIẾP > ----- //
const config = {
    name: "selfDenfense",
    description: "Giao tiếp - Tự vệ",
    type: "communication",
    condition: [
        "phanchu", "phan", 
        "mat day", "matday", "much day", "muchday", "mat dai", "matdai", "md", "mdd", 
        "vo hoc", "vohoc", "vo dung", "vodung", "useless", "vo on", "voon", 
        "suc vat", "sucvat", "suc sinh", "sucsinh", "sv", 
        "phe vat", "phevat", "phe thai", "phethai", 
        "that bai", "thatbai", "loser",
        "rac", "racruoi", "trash", 
        "can ba", "canba", 
        "anhai", "an hai",
        "lao", "laoo",
        "cho", "choo",
        "rach", "rachh",
        "nham", "nhamm",
        "hu", "huhong",
    ],
    exception: [
        "lão", "lào",
        "chò", "chỏ", "chọ", "chõ", "chở", "chỡ", "chờ", "chợ", "cho", "choo", "chô",
        "nhầm", "nhầmm", "nhàm", "nhàmm", "nhắm", "nhắmm", "nhăm", "nhăm",
        "hù", "hú", "hụ", "hủ", "hũ", "hừ", "hứ", "hự", "hử", "hữ"
    ],
    permission: 0,
    priority: 1
}

// ----- < [ HÀM ] - XỬ LÍ PHÉP GIAO TIẾP > ----- //
async function onCall({ message }) {
    const { random } = global.function;
    const replySentences = [
        "thì?",
        "thì sao 🙂?",
        "ừ thì 🙂?",
        "kệ mẹ t?",
        "kệ t 🙂?",
        "ừ kệ mẹ t 🙂",
        "liên quan tới m đéo?",
        "liên quan lồn j đến m k 🙂",
        "liên quan j đến m chắc 🙂?",

        "gáy cmm 🙂",
        "sủa?",
        "sủa đi ki 🙂",
        "Sủa dơ 😀",
        "Sủa sủa cc",
        "Sua cai lon 🙂",
        "bớt sủa dơ hộ",
        "ngâm mõm chos m vào?",
        "câm mõm hộ 🙂",

        "Nứng lồn",
        "nứng?",
        "Nhảm lồn",
        "nhảm cawcjc 🙂?",

        "rác rưởi mà tưởng mình có giá trị à?\n Nhìn lại m ddi, có cái lồn j 😏?",
        "Xem lại m đi r ẳng?",
        "Nhân cách như lồn mà bày đặt 😏",
        "Còn m sống đéo ích j cho đời mà con lên mặt 😀?",
        "Đã ăn hại còn lắm mồm? Đ thể hiểu đc 🙂"
    ];
    
    message.reply(replySentences[random(0, replySentences.length)]);
}

// ----- < [ EXPORT ] - XUẤT MODULE > ----- //
module.exports = {
    config,
    onCall
}