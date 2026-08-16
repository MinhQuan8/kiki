/* ----------------------------
    < COMMAND > --- < WORD >
----------------------------- */

// ----- < [ KHAI BÁO ] - REQUIRE MODULE CẦN THIẾT > ----- //
const fs = require("fs");
const wordnet = require("wordnet");
const { resolve } = require("path");
const { registerFont } = require("canvas");
const { saveImage } = require("table-renderer");
const TableRenderer = require("table-renderer").default;

// ----- < [ CONFIG ] - THÔNG TIN VỀ LỆNH > ----- //
const config = {
    name: "word",
    description: "Lệnh trả về thông tin chữ trong tiếng Anh.",
    type: "tool",
    usage: "/kiki word [ SEARCH CONTENT ]",
    condition: ["word", "wordstat"],
    exception: [],
    permission: 0,
    priority: 2
}

// ----- < [ HÀM ] - XỬ LÍ LỆNH > ----- //
async function onCall({ message, args }) {
    await message.react("⏱");
    
    const { assetsPath, cachesPath } = global;
    const { random } = global.function;
    const errorSentences = [
        "Lỗi r, thg admin đâu lo đi fix đi 🙂",
        "Lỗi cmnr thử lại đi 🙂",
        "Lỗi r tại m đó, thử lại đi",
        "Ăn ở cak j mà lỗi r, thử lại đi 🙂",
        "Thử lại đi lỗi cmnr 🙂",
        "Djt cụ m lỗi r, thử lại xem",
        "Lỗi r , có cái lệnh cx k xog 🙂"
    ];
    const notFoundSentences = [
        "Mọe m đ ghi nội dung t biết kiếm lồn mẹ mày à?",
        "Đéo ghi nội dung kiếm con cặc bà m chắc ? 🙂",
        "Có cái lệnh cx đ bt dùng 🙂 chịu",
        "Mẹ nó đã dùng lệnh thì thêm cái từ cần tìm vô dùm 🙂",
        "Tìm cái lồn mã cha nhà m hả?"
    ];

    try {
        registerFont(resolve(assetsPath, "fonts", "Quicksand-Medium.ttf"), { family: "Quicksand" });
        registerFont(resolve(assetsPath, "fonts", "Bungee-Regular.ttf"), { family: "Bungee" });

        const search = args[0];
        const dictionaryPath = resolve(assetsPath, "dictionary", "en_US.txt");
        const dictionary = fs.readFileSync(dictionaryPath, "utf8").split("\n");
        const wordDataSource = ["-"];
        const wordStat = {
            word: null,
            pronounce: null,
            definitions: [],
        };
        const storeWordStat = (definition, includePointers) => {
            const type = definition.meta.synsetType;
            const synonyms = definition.meta.words.map(word => word.word);
            const glossary = definition.glossary;
        
            if (includePointers) {
                definition.meta.pointers.forEach(pointer => {
                    if (!pointer.data.meta) return;

                    let checkRelated = false;
                    pointer.data.meta.words.forEach((word) => {
                        if (word.word.indexOf(search) === 0) return checkRelated = true;
                    });
        
                    if (checkRelated || ["*", "="].includes(pointer.pointerSymbol)) storeWordStat(pointer.data, false);
                });
            }
        
            wordStat.definitions.push({
                type: type,
                synonyms: synonyms,
                glossary: glossary.replaceAll("; ", "\n")
            });
        }

        for (let index = 0; index < dictionary.length; index++) {
            const word = dictionary[index].split("\t");
        
            if (word[0] == search) {
                const pronounce = word[1].split(", ");
                const wordData = async () => {
                    await wordnet.init();
        
                    await wordnet.lookup(search).then(async (definitions) => {
                        for (let i = 0; i < definitions.length; i++) storeWordStat(definitions[i], true);
                    });
                }
        
                wordStat.word = search;
                wordStat.pronounce = pronounce;
                await wordData();
                break;
            }
        }

        wordStat.definitions = wordStat.definitions.reduce((unique, definition) => unique.map(def => def.glossary).includes(definition.glossary) ? unique : [...unique, definition], []);
        wordStat.definitions.forEach((definition, index) => {
            wordDataSource.push({
                num: index + 1,
                type: definition.type.toUpperCase(),
                synonyms: definition.synonyms.length > 3 ? definition.synonyms.slice(1, 4).join(", ") : definition.synonyms.join(", "),
                glossary: definition.glossary
            })
        });

        const renderTable = TableRenderer({ paddingHorizontal: 30, paddingVertical: 30, titleSpacing: 20, fontFamily: "Quicksand" }).render;
        const canvasTable = renderTable({
            title: "ĐỊNH NGHĨA",
            titleStyle: {
                font: "normal 30px Bungee",
                fillStyle: "#30343f"
            },
            columns: [
                { width: 50, title: "STT", dataIndex: "num" },
                { width: 200, title: "LOẠI TỪ", dataIndex: "type" },
                { width: 500, title: "TỪ ĐỒNG NGHĨA", dataIndex: "synonyms" },
                { width: 850, title: "CHÚ GIẢI", dataIndex: "glossary" },
            ],
            dataSource: wordDataSource
        });

        await saveImage(canvasTable, resolve(cachesPath, "wordStatTable.png"));

        if (!wordStat.word || !wordStat.pronounce || args.length == 0) {
            message.react("⭕️");
            message.reply(notFoundSentences[random(0, notFoundSentences.length)]);
            return;
        }

        message.reply({
            body: `- TỪ VỰNG :  ${wordStat.word}` + "\n" + `- PHIÊN ÂM :  ${wordStat.pronounce.join(", ")}`,
            attachment: fs.createReadStream(resolve(cachesPath, "wordStatTable.png"))
        });
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