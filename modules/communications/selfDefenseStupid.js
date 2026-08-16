/* ---------------------------------------------------
    < COMMUNICATION > --- < SELF DEFENSE STUPID >
---------------------------------------------------- */

// ----- < [ CONFIG ] - THÔNG TIN VỀ PHÉP GIAO TIẾP > ----- //
const config = {
    name: "selfDenfenseStupid",
    description: "Giao tiếp - Tự vệ (ngu)",
    type: "communication",
    condition: [
        "ngu", "nguu", "nguuu",
        "ngao", "ngaoo", "ngaooo", "ngaoda", "buda", "bu da",
        "oclon", "oc lon", "occac", "oc cac",
        "occho", "oc cho", "ocheo", "oc heo",
        "naolon", "nao lon", "naocac", "nao cac",
        "stupid"
    ],
    exception: [],
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

        "rác rưởi mà tưởng mình có gia trị à?\n Nhìn lại m ddi, có cái lồn j 😏?",
        "Xem lại m đi r ẳng?",
        "Nhân cách như lồn mà bày đặt 😏",
        "Còn m sống đéo ích j cho đời mà con lên mặt 😀?",

        "Ngu kệ mẹ tao?",
        "Chắc m thông minh hơn t à?",
        "Ngu lồn được mỗi cái sủa dơ là giỏi 🙂",
        "óc lợn mà còn suốt ngày chatsex cx dám sủa dơ 😀"
    ];
    
    message.reply(replySentences[random(0, replySentences.length)]);
}

// ----- < [ EXPORT ] - XUẤT MODULE > ----- //
module.exports = {
    config,
    onCall
}