/* ---------------------------------------
    < COMMUNICATION > --- < SWEARING >
----------------------------------------- */

// ----- < [ CONFIG ] - THÔNG TIN VỀ PHÉP GIAO TIẾP > ----- //
const config = {
    name: "greeting",
    description: "Giao tiếp - Chửi thề",
    type: "communication",
    condition: [
        "cac", "cacc", "caccc", "concac", "cack", "cak", "concak", "cec", "cecc", "ceccc", "concec", "cek", "concek", "cc", "ccc", "ccmm", "cmm",
        "lon", "cailon", "loz", "cailoz", "lol", "cailol", "l", "lmm", "cl", "clm", "clmm", "clmn",
        "caidit", "ditme", "ditma", "ditmemay", "ditmem", "djt", "caidjt", "djtme", "djtma", "djtmemay", "djtmem", "caidic", "dicme", "dicma", "dicmemay", "dicmem", "caidech", "dechme", "dechmemay", "dechmem", "dume", "duma", "dumam", "dm", "dmm", "dcm", "dcmm",
        "sua", "suaa", "suaaa", "suar", "suado", "ang", "angg", "ngu", "nguu", "nguuu", "ngul", "ngulon", "nguloz",
        "cut", "cutt", "cutdi", "cuc", "cucc",
        "bien", "bienn",
        "xeo", "xeoo"
    ],
    exception: [
        "các",
        "lộn", "lọn", "lợn", "lơn", "lớn", "lởn", "lỏn", "lờn",
        "ngủ",
        "cứt", "cưt", "cụt", "cực", "cưc", "cửc", "cức", "cục",
        "biển", "biên", "biền", "biên", "biện", "biênn", "biểnn", "biềnn", "biệnn",
        "xẻo", "xèo", "xẹo", "xẽo", "xẻoo", "xèoo", "xẹoo", "xẽoo"
    ],
    permission: 0,
    priority: 0
}

// ----- < [ HÀM ] - XỬ LÍ PHÉP GIAO TIẾP > ----- //
async function onCall({ message }) {
    const { body } = message;
    const { random, checkMessage } = global.function;
    const replySentences = {
        penis: [
            "cặc 🙂?",
            "cặk? 🙂",
            "cc 🙂?",
            "Con cặc 🙂?",
            "Cặc con mẹ m",
            "cặk bà già nhà m 🙂",
            "cặc ba m 🙂?",
            "cặc ông cố nội m",
            "cặc thằng cha m 🙂",
            "Cặc con đĩ mẹ m à 🙂?",
            "Cac cai lon 🙂"
        ],
        pussy: [
            "clmm",
            "clmn",
            "lồn 🙂?",
            "loz? 🙂",
            "cl?",
            "cái lồn m à? 🙂",
            "lồn mẹ m",
            "lồn ba m 🙂",
            "loz bà già nhà m 🙂",
            "loz ông cố nội m",
            "loz thg cha m 🙂",
            "lon con di me m a 🙂?",
            "lồn cái con cặc?"
        ],
        fuck: [
            "đụ cc? 🙂",
            "đụ cl 🙂?",
            "Đụ cái lòn mè m?",
            "đụ mẹ mày 🙂",
            "đụ cặc m 🙂",
            "duj con cac cha m",
            "du lòn bà gia m 🙂",
            "đụ ông cố nội m 🙂",
            "Đụ bà co nội m",
            "Đụ cả họ nhà m 🙂",
            "Đụ cả nhà m 😀",
            "đụ đĩ mẹ m 🙂",
            "Đu đĩ cha m 🙂"
        ],
        mother: [
            "mẹ ccj? 🙂",
            "mẹ clj 🙂",
            "ừ mẹ đây 😀",
            "mẹ m nè 😀",
            "t đụ mẹ m nhá 😀",
            "t đụ mẹ m r 🙂",
            "ừ để t đụ mẹ m 😀",
            "ok t đụ mẹ m nha 😀"
        ],
        bark: [
            "gáy?",
            "gáy hộ 🙂",
            "gáy cmm 🙂",
            "sủa?",
            "sủa đi ki 🙂",
            "Sủa dơ 😀",
            "Sủa sủa cc",
            "Sủa sủa cl",
            "Sủa cái đụ đĩ mẹ m 🙂",
            "sủa cmm à 🙂",
            "sủa cc à 🙂",
            "sủa ccc 🙂",
            "Sủa clm m",
            "Sủa loz me m 😀",
            "Sủa cl",
            "Sua cai lon 🙂",
            "sua con cac? 😀",
            "sủa nx t cắt dái m 🙂",
            "bớt sủa dơ hộ",
            "ngâm mõm chos m vào?",
            "ngậm mõm?",
            "nín mõm 🙂",
            "câm mõm hộ 🙂",
        ],
        ignore: [
            "thì?",
            "thì sao 🙂?",
            "ừ thì 🙂?",
            "ừ thì sao 🙂?",
            "kệ mẹ t?",
            "kệ t 🙂?",
            "kệ mẹ t đi? 🙂",
            "ừ kệ mẹ t 🙂",
            "liên quan tới m đéo?",
            "liên quan lồn j đến m k 🙂",
            "liên quan j đến m à 🙂?",
        ],
        horny: [
            "nứng",
            "nung?",
            "nungg 😀",
            "nứng cặc 🙂",
            "nungcac",
            "nung cak",
            "nứng lồn 🙂",
            "nứngloz 😀",
            "nungloz 🙂",
            "nung lon",
            "nứng hả 😀?",
            "nũng hã 🙂",
        ],
        free: [
            "rãnh 🙂?",
            "rãnhh 🙂",
            "rãnh cặc",
            "rãnh cak 🙂",
            "rãnh cac",
            "rãnh l 🙂",
            "rãnh lồn",
            "rãnh loz 🙂",
            "rãnh à 😀?",
            "rãnh hả 😀",
            "rãnh l à 🙂??"
        ],
        childish: [
            "trẻ trâu 😀",
            "tre trau",
            "trẻ trauu 😀",
            "trẻ trâuu 🙂",
            "tretrau 😀",
            "chẻ châu 🙂",
            "trẻ trau cayy 🌶",
            "tretrau cay 🌶🌶",
        ]
    };

    const { penis, pussy, fuck, mother, bark, ignore, horny, free, childish } = replySentences;
    const search = body.replace(/[\.,?!]/g, "");

    if (checkMessage(search, ["cac", "cacc", "caccc", "concac", "cack", "cak", "concak", "cec", "cecc", "ceccc", "concec", "cek", "concek", "cc", "ccc", "ccmm", "cmm"])) {
        const replySentencesArray = [ penis, fuck, bark ][random(0, [ penis, fuck, bark ].length)];
        message.reply(replySentencesArray[random(0, replySentencesArray.length)]);
    }
    else if (checkMessage(search, ["lon", "cailon", "loz", "cailoz", "lol", "cailol", "l", "lmm", "cl", "clm", "clmm", "clmn"])) {
        const replySentencesArray = [ pussy, fuck, bark ][random(0, [ pussy, fuck, bark ].length)];
        message.reply(replySentencesArray[random(0, replySentencesArray.length)]);
    }
    else if (checkMessage(search, ["dit", "caidit", "ditme", "ditma", "ditmemay", "ditmem", "djt", "caidjt", "djtme", "djtma", "djtmemay", "djtmem", "dic", "caidic", "dicme", "dicma", "dicmemay", "dicmem", "dech", "caidech", "dechme", "dechmemay", "dechmem", "du", "caidu", "dume", "duma", "dumam", "dm", "dmm", "dcm", "dcmm"])) {
        const replySentencesArray = [ mother, fuck, bark ][random(0, [ mother, fuck, bark ].length)];
        message.reply(replySentencesArray[random(0, replySentencesArray.length)]);
    }
    else if (checkMessage(search, ["ma", "maa", "maaa", "moa", "moaa", "moaaa", "moe", "moee", "moeee", "mm"])) {
        const replySentencesArray = [ mother, ignore, bark, fuck ][random(0, [ mother, ignore, bark, fuck ].length)];
        message.reply(replySentencesArray[random(0, replySentencesArray.length)]);
    }
    else if (checkMessage(search, ["sua", "suaa", "suaaa", "suar", "suado", "ang", "angg", "ngu", "nguu", "nguuu", "ngul", "ngulon", "nguloz"])) {
        const replySentencesArray = [ fuck, bark, penis, pussy ][random(0, [ fuck, bark, penis, pussy ].length)];
        message.reply(replySentencesArray[random(0, replySentencesArray.length)]);
    }
    else if (checkMessage(search, ["cut", "cutt", "cutdi", "cuc", "cucc", "bien", "bienn", "xeo", "xeoo"])) {
        const replySentencesArray = [ bark, horny, free, childish ][random(0, [ bark, horny, free, childish ].length)];
        message.reply(replySentencesArray[random(0, replySentencesArray.length)]);
    }
}

// ----- < [ EXPORT ] - XUẤT MODULE > ----- //
module.exports = {
    config,
    onCall
}