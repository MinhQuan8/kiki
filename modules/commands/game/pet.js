/* ----------------------------
    < COMMAND > --- < PET >
----------------------------- */

// ----- < [ KHAI BÁO ] - REQUIRE MODULE CẦN THIẾT > ----- //
const fs = require("fs");
const { resolve } = require("path");
const { registerFont } = require("canvas");
const { saveImage } = require("table-renderer");
const TableRenderer = require("table-renderer").default;
const moment = require("moment-timezone");

// ----- < [ CONFIG ] - THÔNG TIN VỀ LỆNH > ----- //
const config = {
    name: "pet",
    description: "Lệnh nuôi thú ảo.",
    type: "game",
    usage: "/kiki pet [ COMMAND ]",
    condition: ["pet", "pets", "thu"],
    exception: [],
    permission: 0,
    priority: 2
}

// ----- < [ HÀM ] - XỬ LÍ LỆNH > ----- //
async function onCall({ message, args }) {
    await message.react("⏱");
    
    const { senderID, messageID } = message;
    const { usersInfo, assetsPath, cachesPath } = global;
    const { random, delay, checkMessage, updateUsersInfo } = global.function;
    const errorSentences = [
        "Lỗi r, thg ad đâu lo đi fix đi 🙂",
        "Lỗi cmnr thử lại đi 🙂",
        "Lỗi r tại m đó, thử lại đi",
        "Ăn ở cak j mà lỗi r, thử lại đi 🙂",
        "Thử lại đi lỗi cmnr 🙂",
        "Djt cụ m lỗi r, thử lại xem",
        "Lỗi r , có cái lệnh cx k xog 🙂"
    ];
    const notEnoughCommandSentences = [
        "Cú pháp cặc j đấy?",
        "M làm con mẹ j v 🙂",
        "Đ biết dùng lệnh à?",
        "Oclon này dùng lệnh kiểu cặc j v 🙂",
        "M xài lệnh đ j đấy 🙂?"
    ];
    const emptyPetsSentences = [
        "Chả có mẹ j đâu khỏi xem, đúng đói nghèo rách!!",
        "Đ có con cặc j đâu mà đòi xem 🙂",
        "Ăn j rách dữ v, chả có mẹ j để xem 🙂",
        "Đúng đỗ nghèo khỉ, đ có con thú nào đâu 🙂",
        "Chả có cặc j mà tìm, rách!"
    ];
    const emptyWarPetsSentences = [
        "đuma đ có ccj cx đòi đánh nhau!!",
        "Đ có con cặc j cx đòi đá gà 🙂",
        "Ăn j rách dữ v, chả có mẹ j cx đòi đánh 🙂",
        "Đúng đỗ nghèo khỉ, đ có con thú còn đòi solo 🙂",
        "Chả có cặc j mà đấu, rách!"
    ];
    const notEnoughtMoneySentences = [
        "Rách! Đéo đủ tiền mua 🙂",
        "Đỗ nghèo khỉ, m đéo ddu tiền để muaa 🙂",
        "Rách vcl, đ đủ tiền mua 😏",
        "Nghèo cúc, đ đủ tiền mua 🙂",
        "Đcm mua cái lon, m đ đủ mua 🙂🙂"
    ];
    const notFoundProductsSentences = [
        "Sản phẩm đéo tồn tại 🙂",
        "Mã lồn j v, ngu à 🙂?",
        "M kiếm sản phẩm đéo j v 🙂",
        "Lm đéo j có mã mua này 🙂!",
        "Mã mua cặc j đấy? Lm đ j có 🙂🙂"
    ];
    const alreadyHasProductsSentences = [
        "Con này m mua r, đ mua thêm đc đâu 🙂",
        "Có r còn đòi mua thêm, đ hiểu ddc?",
        "Con này m có r, mua cl à 🙂",
        "Mua đ j, này m có lâu r 🙂",
        "M có con này r, mua cl à?"
    ];
    const notHasPetsOrItemsSentences = [
        "M lm mẹ j có mà dùng ?",
        "Có đéo đâu, dùng cho đầu cu m à",
        "Nghèo rách như m có cái đếch j mà dùng?",
        "Đúng đói nghèo hèn luôn, đ có còn đòi sử dụng 🙂",
        "Rách vl, có đ đâu mà dùng 🙂"
    ];
    const notEnoughKeySentences = [
        "M đ đủ key để quay gacha, mua thêm đi 🙂",
        "Rách vl, đ có key cx đòi quay 🙂",
        "Đ có key quay cái lồn mẹ m à?",
        "Quay cl, đ có key 🙂",
        "M đ đủ key quay cmm à ?"
    ];
    const overQuantityItemsSentences = [
        "Lafm đ j đủ mà dùng ?",
        "Sử dụng condime m hay j, có đủ đ đâu 🙂",
        "Đ còn đủ cho m dùng 🙂",
        "Sử dụng mẹ j nhiều v, còn đéo 🙂",
        "Còn đủ cho m dùng nhiêu đó đéo ?"
    ];
    const quantityErrorSentences = [
        "Số lượng đéo j v 🙂",
        "Ngu à, nhập số lượng cặc j đấy 🙂?",
        "M bị occho à, số đ j v 🙂",
        "Não cặc chắc?, số lồn j đâu 🙂!",
        "Số lượng? Bị ngu à 🙂🙂"
    ];
    const selfWarSentences = [
        "Đụ mẹ tự thủ dâm à?",
        "Tự chơi chính mình hay j 🙂",
        "Núng lồn 🙂",
        "Vã lắm hay s v 🙂?",
        "DDUuma tự solo vs bản thân hã 🙂"
    ];
    const buyNotificateSentences = (products, quantity, price) => {
        return [
            `M đã thu mua ${quantity} : ${products.join(", ")}\n- Tổng giá trị: ${price}`,
            `M đã mua vafo ${quantity} : ${products.join(", ")}\n- Tổng giá trị: ${price}`,
            `M vừa mới mua ${quantity}: ${products.join(", ")}\n- Tổng giá trị: ${price}`,
            `Sv này vừa ms mua vô ${quantity}: ${products.join(", ")}\n- Tổng giá trị: ${price}`,
            `Occho này vừa mua thành công ${quantity}: ${products.join(", ")}\n- Tổng giá trị: ${price}`
        ]
    };
    const useNotificateSentences = (items, quantity, pet) => {
        return [
            `M đã dùng ${quantity}: ${items.join(", ")} cho con "${pet}"`,
            `M đã sử dụng ${quantity} vật phẩm: ${items.join(", ")} cho con "${pet}"`,
            `M vừa dùng ${quantity} món: ${items.join(", ")} cho "${pet}"`,
            `Sv này vừa ms sử dụng ${quantity}: ${items.join(", ")} cho con sv "${pet}"`,
            `Occho này đã dùng ${quantity} vật phẩm: ${items.join(", ")} cho "${pet}"`
        ]
    };
    const gachaNotificateSentences = (prizes) => {
        return [
            `Con vừa quay trúng :${prizes.join(", ")}`,
            `M vừa quay trúng giải thưởng: ${prizes.join(", ")}`,
            `M vừa trúng giải: ${prizes.join(", ")}`,
            `M vừa nhận duoc: ${prizes.join(", ")}`,
            `Sv này vừa nhân đc: ${prizes.join(", ")}`
        ];
    };
    const warNotificateSentences = (winner, loser) => {
        return [
            `Gaf của ${loser} đã bị gà của ${winner} đá cho xịt máu lồn !!`,
            `Con gà của ${loser} đã quỳ xuống bú dái gà ${winner} xin tha mạng!`,
            `Suýt nx thì ${winner} đã làm gỏi con gà ${loser} ~`,
            `Gà nhà ${winner} đã sút bay lồn ${loser} !~`,
            `Gà của ${loser} đã bú dái xin hàng ${winner} !!`
        ]
    }

    try {
        registerFont(resolve(assetsPath, "fonts", "Quicksand-Medium.ttf"), { family: "Quicksand" });
        registerFont(resolve(assetsPath, "fonts", "Bungee-Regular.ttf"), { family: "Bungee" });
        const petAssetsPath = resolve(assetsPath, "pet");

        const pets = {
            gallus: {
                id: "P01",
                name: "Gà Gallus",
                health: 100,
                endurance: 10,
                damage: 10,
                speed: 1,
                price: 10000,
                imagePath: resolve(petAssetsPath, "gallus.png")
            },
            asil: {
                id: "P02",
                name: "Gà Asil",
                health: 150,
                endurance: 15,
                damage: 12,
                speed: 1.2,
                price: 15000,
                imagePath: resolve(petAssetsPath, "asil.png")
            },
            sumatra: {
                id: "P03",
                name: "Gà Sumatra",
                health: 125,
                endurance: 10,
                damage: 20,
                speed: 1.5,
                price: 20000,
                imagePath: resolve(petAssetsPath, "sumatra.png")
            }
        }
        const items = {
            chicken: {
                id: "F01",
                type: "food",
                name: "Thịt Gà",
                health: +30,
                endurance: +1,
                damage: +3,
                speed: +0.1,
                exp: +50,
                effect: null,
                consump: true,
                price: 3000,
                imagePath: resolve(petAssetsPath, "chicken.png")
            },
            seed: {
                id: "F02",
                type: "food",
                name: "Thóc",
                health: +5,
                endurance: 0,
                damage: +0.5,
                speed: 0,
                exp: +10,
                effect: null,
                consump: true,
                price: 300,
                imagePath: resolve(petAssetsPath, "seed.png")
            },
            goldenSeed: {
                id: "F03",
                type: "food",
                name: "Thóc Vàng",
                health: +50,
                endurance: +3,
                damage: +5,
                speed: +0.3,
                exp: +100,
                effect: null,
                consump: true,
                price: 5000,
                imagePath: resolve(petAssetsPath, "goldenSeed.png")
            },

            scale: {
                id: "E01",
                type: "equipment",
                name: "Vảy Gà",
                health: +50,
                endurance: +10,
                damage: 0,
                speed: -0.5,
                exp: 0,
                effect: null,
                consump: false,
                price: 7500,
                imagePath: null //resolve(petAssetsPath, "scale.png")
            },
            spur: {
                id: "E02",
                type: "equipment",
                name: "Cựa Gà",
                health: 0,
                endurance: 0,
                damage: +10,
                speed: 0,
                exp: 0,
                effect: null,
                consump: false,
                price: 5000,
                imagePath: resolve(petAssetsPath, "spur.png")
            },

            dumbKey: {
                id: "K01",
                type: "key",
                name: "Dumb Key",
                health: null,
                endurance: null,
                damage: null,
                speed: null,
                exp: null,
                effect: null,
                consump: true,
                price: 5000,
                imagePath: resolve(petAssetsPath, "dumbKey.png")
            }
        }
        
        const userPets = usersInfo[senderID].inventory.hasOwnProperty("pets") ?
            Object.keys(usersInfo[senderID].inventory.pets)
                .filter(pet => usersInfo[senderID].inventory.pets[pet].alive)
                .reduce((object, current) => (object[current] = usersInfo[senderID].inventory.pets[current], object), {})
            : {};
        
        const userPetItems = usersInfo[senderID].inventory.hasOwnProperty("petItems") ?
            Object.keys(usersInfo[senderID].inventory.petItems)
                .filter(item => usersInfo[senderID].inventory.petItems[item].quantity > 0)
                .reduce((object, current) => (object[current] = usersInfo[senderID].inventory.petItems[current], object), {})
            : {};


        if (args.length == 0) {
            const petsDataSource = [ "-" ];
            const itemsDataSource = [ "-" ];

            if (Object.keys(userPets).length <= 0 && Object.keys(userPetItems).length <= 0) {
                message.react("⭕️");
                message.reply(emptyPetsSentences[random(0, emptyPetsSentences.length)]);
                return;
            }

            Object.keys(userPets).forEach(pet => {
                const dataObject = {
                    id: pets[pet].id,
                    type: userPets[pet].type,
                    name: userPets[pet].name,
                    health: userPets[pet].health,
                    endurance: userPets[pet].endurance,
                    damage: userPets[pet].damage,
                    speed: userPets[pet].speed,
                    exp: userPets[pet].exp,
                    equipment: userPets[pet].equipment.map(item => items[item].name).join(", ") || "-",
                };

                petsDataSource.push(dataObject);
            });

            Object.keys(userPetItems).forEach(item => {
                const dataObject = {
                    id: items[item].id,
                    type: userPetItems[item].type.toUpperCase(),
                    name: userPetItems[item].name,
                    quantity: userPetItems[item].quantity,
                };

                itemsDataSource.push(dataObject);
            });

            const renderTable = TableRenderer({ paddingHorizontal: 30, paddingVertical: 30, titleSpacing: 20, fontFamily: "Quicksand" }).render;
            const petsCanvasTable = renderTable({
                title: `THÚ NUÔI - ${usersInfo[senderID].fullName}`,
                titleStyle: {
                    font: "normal 30px Bungee",
                    fillStyle: "#30343f"
                },
                columns: [
                    { width: 125, title: "MÃ DÙNG", dataIndex: "id" },
                    { width: 150, title: "CHỦNG LOẠI", dataIndex: "type" },
                    { width: 200, title: "TÊN GỌI", dataIndex: "name" },
                    { width: 125, title: "LƯỢNG MÁU", dataIndex: "health" },
                    { width: 125, title: "SỨC BỀN", dataIndex: "endurance" },
                    { width: 125, title: "SÁT THƯƠNG", dataIndex: "damage" },
                    { width: 125, title: "TỐC ĐỘ", dataIndex: "speed" },
                    { width: 150, title: "KINH NGHIỆM", dataIndex: "exp" },
                    { width: 250, title: "TRANG BỊ", dataIndex: "equipment" },
                ],
                dataSource: petsDataSource
            });
            const itemsCanvasTable = renderTable({
                title: `VẬT PHẨM - ${usersInfo[senderID].fullName}`,
                titleStyle: {
                    font: "normal 30px Bungee",
                    fillStyle: "#30343f"
                },
                columns: [
                    { width: 125, title: "MÃ DÙNG", dataIndex: "id" },
                    { width: 150, title: "LOẠI HÀNG", dataIndex: "type" },
                    { width: 200, title: "TÊN HÀNG", dataIndex: "name" },
                    { width: 150, title: "SỐ LƯỢNG", dataIndex: "quantity" },
                ],
                dataSource: itemsDataSource
            });

            await saveImage(petsCanvasTable, resolve(cachesPath, "userPets.png"));
            await saveImage(itemsCanvasTable, resolve(cachesPath, "userPetItems.png"));
            message.reply({ attachment: [fs.createReadStream(resolve(cachesPath, "userPets.png")), fs.createReadStream(resolve(cachesPath, "userPetItems.png"))] });
            message.react("🔹");
            return;
        }


        const command = args.shift();
        if (checkMessage(command, ["shop", "store", "cua hang"])) {
            const petsDataSource = [ "-" ];
            const itemsDataSource = [ "-" ];

            Object.keys(pets).forEach(pet => {
                const dataObject = {
                    id: pets[pet].id,
                    type: pets[pet].name,
                    health: pets[pet].health,
                    endurance: pets[pet].endurance,
                    damage: pets[pet].damage,
                    speed: pets[pet].speed,
                    price: pets[pet].price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                };

                petsDataSource.push(dataObject);
            });

            Object.keys(items).forEach(item => {
                const dataObject = {
                    id: items[item].id,
                    type: items[item].type.toUpperCase(),
                    name: items[item].name,
                    health: !items[item].health ? "-" : items[item].health > 0 ? "+ " + items[item].health : items[item].health.toString().replace("-", "- "),
                    endurance: !items[item].endurance ? "-" : items[item].endurance > 0 ? "+ " + items[item].endurance : items[item].endurance.toString().replace("-", "- "),
                    damage: !items[item].damage ? "-" : items[item].damage > 0 ? "+ " + items[item].damage : items[item].damage.toString().replace("-", "- "),
                    speed: !items[item].speed ? "-" : items[item].speed > 0 ? "+ " + items[item].speed: items[item].speed.toString().replace("-", "- "),
                    exp: !items[item].exp ? "-" : items[item].exp > 0 ? "+ " + items[item].exp: items[item].exp.toString().replace("-", "- "),
                    effect: items[item].effect || "-",
                    consump: items[item].consump ? "CÓ" : "KHÔNG",
                    price: items[item].price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                };

                itemsDataSource.push(dataObject);
            });

            const renderTable = TableRenderer({ paddingHorizontal: 30, paddingVertical: 30, titleSpacing: 10, fontFamily: "Quicksand" }).render;
            const petsCanvasTable = renderTable({
                title: "CỬA HÀNG THÚ NUÔI",
                titleStyle: {
                    font: "normal 30px Bungee",
                    fillStyle: "#30343f"
                },
                columns: [
                    { width: 100, title: "MÃ MUA", dataIndex: "id" },
                    { width: 150, title: "CHỦNG LOẠI", dataIndex: "type" },
                    { width: 150, title: "LƯỢNG MÁU", dataIndex: "health" },
                    { width: 150, title: "SỨC BỀN", dataIndex: "endurance" },
                    { width: 150, title: "SÁT THƯƠNG", dataIndex: "damage" },
                    { width: 150, title: "TỐC ĐỘ", dataIndex: "speed" },
                    { width: 200, title: "GIÁ THÀNH", dataIndex: "price" },
                ],
                dataSource: petsDataSource
            });
            const itemsCanvasTable = renderTable({
                title: "CỬA HÀNG VẬT PHẨM",
                titleStyle: {
                    font: "normal 30px Bungee",
                    fillStyle: "#30343f"
                },
                columns: [
                    { width: 100, title: "MÃ MUA", dataIndex: "id" },
                    { width: 150, title: "LOẠI HÀNG", dataIndex: "type" },
                    { width: 200, title: "TÊN HÀNG", dataIndex: "name" },
                    { width: 125, title: "LƯỢNG MÁU", dataIndex: "health" },
                    { width: 125, title: "SỨC BỀN", dataIndex: "endurance" },
                    { width: 125, title: "SÁT THƯƠNG", dataIndex: "damage" },
                    { width: 125, title: "TỐC ĐỘ", dataIndex: "speed" },
                    { width: 125, title: "KINH NGHIỆM", dataIndex: "exp" },
                    { width: 125, title: "HIỆU ỨNG", dataIndex: "effect" },
                    { width: 125, title: "TIÊU HAO", dataIndex: "consump" },
                    { width: 150, title: "GIÁ THÀNH", dataIndex: "price" },
                ],
                dataSource: itemsDataSource
            });

            await saveImage(petsCanvasTable, resolve(cachesPath, "petsStore.png"));
            await saveImage(itemsCanvasTable, resolve(cachesPath, "petItemsStore.png"));
            message.reply({ attachment: [fs.createReadStream(resolve(cachesPath, "petsStore.png")), fs.createReadStream(resolve(cachesPath, "petItemsStore.png"))] });
            message.react("🔹");
            return;
            return;
        }

        if (checkMessage(command, ["mua", "muaa", "buy", "buyy", "get"])) {
            const quantity = args.length > 1 ? parseInt(args.pop()) : 1;
            const requireProductIDs = args.map(element => element.toUpperCase());

            if (requireProductIDs.map(productID => Object.values(pets).map(pet => pet.id).includes(productID) || Object.values(items).map(item => item.id).includes(productID)).includes(false)) {
                message.react("⭕️");
                message.reply(notFoundProductsSentences[random(0, notFoundProductsSentences.length)]);
                return;
            }

            if (requireProductIDs.map(productID => productID.startsWith("P") ? Object.keys(userPets).includes(Object.keys(pets).find(pet => pets[pet].id == productID)) : false).includes(true)) {
                message.react("⭕️");
                message.reply(alreadyHasProductsSentences[random(0, alreadyHasProductsSentences.length)]);
                return;
            }

            if (isNaN(quantity) || quantity <= 0) {
                message.react("⭕️");
                message.reply(quantityErrorSentences[random(0, quantityErrorSentences.length)]);
                return;
            }


            const totalPrice = requireProductIDs.reduce(
                (total, current) => total += [...Object.values(pets), ...Object.values(items)].find(product => product.id == current).price * quantity,
            0);

            if (totalPrice > usersInfo[senderID].money) {
                message.react("⭕️");
                message.reply(notEnoughtMoneySentences[random(0, notEnoughtMoneySentences.length)]);
                return;
            }
            
            if (!usersInfo[senderID].inventory.hasOwnProperty("pets")) usersInfo[senderID].inventory.pets = {};
            if (!usersInfo[senderID].inventory.hasOwnProperty("petItems")) usersInfo[senderID].inventory.petItems = {};

            const productImages = [];
            usersInfo[senderID].money -= parseInt(totalPrice);

            for (let index = 0; index < requireProductIDs.length; index++) {
                const productID = requireProductIDs[index];

                if (productID.startsWith("P")) {
                    const petName = (await message.input(`┌──── ∘°❉°∘ ────┐\n\n  🐾〡 ĐẶT TÊN ${productID}\n\n══════════════\n  [ - 𝘙𝘦𝘱𝘭𝘺 𝘔𝘦𝘴𝘴𝘢𝘨𝘦 - ]\n\n└──── °∘❉∘° ────┘`, null, messageID)).body;
                    const petType = Object.keys(pets).find(pet => pets[pet].id == productID);
                    const petParameters = Object.values(pets).find(pet => pet.id == productID);

                    if (petParameters.imagePath) productImages.push(fs.createReadStream(petParameters.imagePath));
                    usersInfo[senderID].inventory.pets[petType] = {
                        time: moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss - DD/MM/YYYY"),
                        name: petName,
                        alive: true,
                        type: petParameters.name,
                        health: petParameters.health,
                        endurance: petParameters.endurance,
                        damage: petParameters.damage,
                        speed: petParameters.speed,
                        exp: 0,
                        equipment: []
                    }
                }
                else {
                    const itemName = Object.keys(items).find(item => items[item].id == productID);
                    const itemParameters = Object.values(items).find(item => item.id == productID);
                    
                    if (itemParameters.imagePath) productImages.push(fs.createReadStream(itemParameters.imagePath));
                    usersInfo[senderID].inventory.petItems[itemName] = {
                        type: itemParameters.type,
                        name: itemParameters.name,
                        quantity: userPetItems.hasOwnProperty(itemName) ? userPetItems[itemName].quantity + quantity : quantity
                    }
                }
            }
            
            updateUsersInfo(global.usersInfo);
            message.reply({
                body: buyNotificateSentences(requireProductIDs.map(productID => Object.keys(pets).find(pet => pets[pet].id == productID) || Object.keys(items).find(item => items[item].id == productID)).map(name => pets.hasOwnProperty(name) ? pets[name].name : items[name].name), quantity, totalPrice)[random(0, buyNotificateSentences(requireProductIDs, quantity, totalPrice).length)],
                attachment: productImages
            });
            message.react("🔹");
            return;
        }

        if (checkMessage(command, ["dung", "dungg", "mac", "trang bi", "use", "usee", "feed", "equip"])) {
            const quantity = args.length > 2 ? parseInt(args.pop()) : 1;
            const requirePetID = args.pop().toUpperCase();
            const requirePetType = Object.keys(pets).find(pet => pets[pet].id == requirePetID);
            const requireItemIDs = args.map(element => element.toUpperCase());

            if (requireItemIDs.join("") != "ALL" && !Object.keys(userPets).map(pet => pets[pet].id).includes(requirePetID) || requireItemIDs.join("") != "ALL" && requireItemIDs.map(itemID => userPetItems.hasOwnProperty(Object.keys(items).find(item => items[item].id == itemID))).includes(false) || Object.keys(userPetItems).length <= 0) {
                message.react("⭕️");
                message.reply(notHasPetsOrItemsSentences[random(0, notHasPetsOrItemsSentences.length)]);
                return;
            }

            if (requireItemIDs.join("") != "ALL" && requireItemIDs.map(itemID => Object.keys(userPetItems).map(item => items[item].id).includes(itemID)).includes(false)) {
                message.react("⭕️");
                message.reply(notFoundProductsSentences[random(0, notFoundProductsSentences.length)]);
                return;
            }

            if (requireItemIDs.join("") == "ALL") {
                requireItemIDs.length = 0;
                Object.keys(userPetItems).forEach(item => {
                    requireItemIDs.push(items[item].id);
                })
            }

            if (isNaN(quantity) || quantity <= 0) {
                message.react("⭕️");
                message.reply(quantityErrorSentences[random(0, quantityErrorSentences.length)]);
                return;
            }

            if (requireItemIDs.map(itemID => userPetItems[Object.keys(items).find(item => items[item].id == itemID)].quantity >= quantity).includes(false)) {
                message.react("⭕️");
                message.reply(overQuantityItemsSentences[random(0, overQuantityItemsSentences.length)]);
                return;
            }

            requireItemIDs.filter(itemID => !itemID.startsWith("K")).forEach(itemID => {
                const requireItemName = Object.keys(items).find(item => items[item].id == itemID);
                const userPetParameters = usersInfo[senderID].inventory.pets[requirePetType];

                if (itemID.startsWith("E") && userPets[requirePetType].equipment.includes(requireItemName)) return;
                else if (itemID.startsWith("E")) usersInfo[senderID].inventory.pets[requirePetType].equipment.push(requireItemName);

                usersInfo[senderID].inventory.pets[requirePetType].health = +(userPetParameters.health + items[requireItemName].health * quantity).toFixed(2);
                usersInfo[senderID].inventory.pets[requirePetType].endurance = +(userPetParameters.endurance + items[requireItemName].endurance * quantity).toFixed(2);
                usersInfo[senderID].inventory.pets[requirePetType].damage = +(userPetParameters.damage + items[requireItemName].damage * quantity).toFixed(2);
                usersInfo[senderID].inventory.pets[requirePetType].speed = +(userPetParameters.speed + items[requireItemName].speed * quantity).toFixed(2);
                usersInfo[senderID].inventory.pets[requirePetType].exp = +(userPetParameters.exp + items[requireItemName].exp * quantity).toFixed(2);
                usersInfo[senderID].inventory.petItems[requireItemName].quantity -= items[requireItemName].consump ? quantity : 0;
            });
            
            updateUsersInfo(global.usersInfo);
            message.reply(useNotificateSentences(requireItemIDs.map(itemID => items[Object.keys(items).find(item => items[item].id == itemID)].name), quantity, userPets[Object.keys(pets).find(pet => pets[pet].id == requirePetID)].name)[random(0, useNotificateSentences(requireItemIDs, quantity, requirePetID).length)]);
            message.react("🔹");
            return;
        }

        if (checkMessage(command, ["gacha", "random", "vong quay may man"])) {
            const quantity = args.length > 0 ? parseInt(args.pop()) : 1;
            const prizes = [
                { name: "dumbKey", quantity: 1 },
                { name: "dumbKey", quantity: 1 },
                { name: "dumbKey", quantity: 1 },
                { name: "dumbKey", quantity: 2 },
                { name: "dumbKey", quantity: 3 },

                { name: "chicken", quantity: 1 },
                { name: "chicken", quantity: 1 },
                { name: "chicken", quantity: 1 },
                { name: "chicken", quantity: 3 },
                { name: "chicken", quantity: 3 },
                { name: "chicken", quantity: 5 },
                { name: "seed", quantity: 5 },
                { name: "seed", quantity: 5 },
                { name: "seed", quantity: 5 },
                { name: "seed", quantity: 15 },
                { name: "seed", quantity: 15 },
                { name: "seed", quantity: 30 },
                { name: "goldenSeed", quantity: 1 },
                { name: "goldenSeed", quantity: 1 },
                { name: "goldenSeed", quantity: 1 },
                { name: "goldenSeed", quantity: 3 },
                { name: "goldenSeed", quantity: 3 },
                { name: "goldenSeed", quantity: 5 },
                
                { name: "scale", quantity: 1 },
                { name: "spur", quantity: 1 },

                { name: "coin", quantity: 1 },
            ];

            if (isNaN(quantity) || quantity <= 0) {
                message.react("⭕️");
                message.reply(quantityErrorSentences[random(0, quantityErrorSentences.length)]);
                return;
            }

            if (!userPetItems.hasOwnProperty("dumbKey") || userPetItems.dumbKey.quantity < quantity) {
                message.react("⭕️");
                message.reply(notEnoughKeySentences[random(0, notEnoughKeySentences.length)]);
                return;
            }

            const userPrizes = [];
            const prizeImages = [];
            const prizesNotificateMessage = [];

            for (let index = 0; index < quantity; index++) userPrizes.push(prizes[random(0, prizes.length)]);
            userPrizes.forEach(prize => {
                const { name, quantity } = prize;
                const coinValue = 10000;

                prizesNotificateMessage.push(`\n   • ${name == "coin" ? coinValue * quantity + " Kiki Coins" : quantity + " " + items[name].name}`);

                if (name == "coin") return usersInfo[senderID].money += coinValue * quantity;
                if (items[name].imagePath) prizeImages.push(fs.createReadStream(items[name].imagePath));

                usersInfo[senderID].inventory.petItems[name] = {
                    type: items[name].type,
                    name: items[name].name,
                    quantity: userPetItems.hasOwnProperty(name) ? userPetItems[name].quantity + quantity : quantity
                }
            });

            usersInfo[senderID].inventory.petItems.dumbKey.quantity -= quantity;

            updateUsersInfo(global.usersInfo);
            message.reply({
                body: gachaNotificateSentences(prizesNotificateMessage)[random(0, gachaNotificateSentences(prizesNotificateMessage).length)],
                attachment: prizeImages
            });
            message.react("🔹");
            return;
        }

        if (checkMessage(command, ["war", "colosseum", "chien dau", "solo", "solokill", "da ga", "danh nhau"])) {
            const participantID = (await message.input(`┌──── ∘°❉°∘ ────┐\n\n 🥊〡 ĐẤU TRƯỜNG\n\n══════════════\n  [ - 𝘙𝘦𝘱𝘭𝘺 𝘔𝘦𝘴𝘴𝘢𝘨𝘦 - ]\n\n└──── °∘❉∘° ────┘`, null, messageID)).senderID;
            const participantPets = usersInfo[participantID].inventory.hasOwnProperty("pets") ?
                Object.keys(usersInfo[participantID].inventory.pets)
                    .filter(pet => usersInfo[participantID].inventory.pets[pet].alive)
                    .reduce((object, current) => (object[current] = usersInfo[participantID].inventory.pets[current], object), {})
                : {};

            if (senderID == participantID) {
                message.react("⭕️");
                message.reply(selfWarSentences[random(0, selfWarSentences.length)]);
                return;
            }

            if (Object.keys(participantPets).length <= 0 || Object.keys(userPets).length <= 0) {
                message.react("⭕️");
                message.reply(emptyWarPetsSentences[random(0, emptyWarPetsSentences.length)]);
                return;
            }

            const userPetsLuckStat = random(85, 115 + 1) / 100;
            const participantPetsLuckStat = random(85, 115 + 1) / 100;
            let userPetsATK = 0, userPetsDEF = 0, participantPetsATK = 0, participantPetsDEF = 0;

            Object.values(userPets).forEach(pet => {
                const petLevel = +(pet.exp / 1000).toFixed(0);
                const petLevelBuff = Math.max(petLevel * 1, 1);
                const equipmentBuff = {
                    health: 0,
                    endurance: 0,
                    damage: 0,
                    speed: 0
                }

                pet.equipment.forEach(equipment => {
                    equipmentBuff.health = Math.max(equipmentBuff.health + items[equipment].health, 1);
                    equipmentBuff.endurance = Math.max(equipmentBuff.health + items[equipment].endurance, 1);
                    equipmentBuff.damage = Math.max(equipmentBuff.health + items[equipment].damage, 1);
                    equipmentBuff.speed = Math.max(equipmentBuff.health + items[equipment].speed, 0.1);
                })

                userPetsDEF += +((pet.health + equipmentBuff.health) * (pet.endurance + equipmentBuff.endurance) * petLevelBuff).toFixed(2);
                userPetsATK += +((pet.damage + equipmentBuff.damage) * (pet.speed + equipmentBuff.speed) * petLevelBuff).toFixed(2);
            });

            Object.values(participantPets).forEach(pet => {
                const petLevel = +(pet.exp / 1000).toFixed(0);
                const petLevelBuff = Math.max(petLevel * 1, 1);
                const equipmentBuff = {
                    health: 0,
                    endurance: 0,
                    damage: 0,
                    speed: 0
                }

                pet.equipment.forEach(equipment => {
                    equipmentBuff.health = Math.max(equipmentBuff.health + items[equipment].health, 1);
                    equipmentBuff.endurance = Math.max(equipmentBuff.health + items[equipment].endurance, 1);
                    equipmentBuff.damage = Math.max(equipmentBuff.health + items[equipment].damage, 1);
                    equipmentBuff.speed = Math.max(equipmentBuff.health + items[equipment].speed, 0.1);
                })

                participantPetsDEF += +((pet.health + equipmentBuff.health) * (pet.endurance + equipmentBuff.endurance) * petLevelBuff).toFixed(2);
                participantPetsATK += +((pet.damage + equipmentBuff.damage) * (pet.speed + equipmentBuff.speed) * petLevelBuff).toFixed(2);
            });

            const userPoint = userPetsATK * (100 / (100 + participantPetsDEF)) * userPetsLuckStat;
            const participantPoint = participantPetsATK * (100 / (100 + userPetsDEF)) * participantPetsLuckStat
            const disparity = userPoint - participantPoint;
            const winner = [], loser = [];
            let winnerPoint = 0, loserPoint = 0;

            if (disparity == 0) {
                winnerPoint = userPoint;
                loserPoint = userPoint;
                winner.push(senderID, participantID);
                loser.push(senderID, participantID);
            }

            if (disparity > 0) {
                winnerPoint = userPoint;
                loserPoint = participantPoint;
                winner.push(senderID);
                loser.push(participantID);
            }

            if (disparity < 0) {
                winnerPoint = participantPoint;
                loserPoint = userPoint;
                winner.push(participantID);
                loser.push(senderID);
            }
        
            const winnerStat = {
                health: winnerPoint / Math.abs(disparity) * 0.75 / 100,
                endurance: winnerPoint / Math.abs(disparity) * 0.75 / 100,
                damage: winnerPoint / Math.abs(disparity) * 0.75 / 100,
                speed: winnerPoint / Math.abs(disparity) * 0.75 / 100,
                exp: Math.min(Math.abs(disparity) * 5, 5000),
                money: Math.min(Math.abs(disparity) * 100, 15000),
                item: [
                    { name: "dumbKey", quantity: 1 }
                ]
            }
            const loserStat = {
                health: Math.abs(disparity) / loserPoint * 3 / 100,
                endurance: Math.abs(disparity) / loserPoint * 3 / 100,
                damage: Math.abs(disparity) / loserPoint * 3 / 100,
                speed: Math.abs(disparity) / loserPoint * 3 / 100,
                exp: Math.min(Math.abs(disparity) * 1.25, 5000),
                money: Math.max(Math.abs(disparity) * -100, -15000),
                item: []
            }

            winner.forEach(winnerID => {
                usersInfo[winnerID].money += +winnerStat.money.toFixed(0);
                winnerStat.item.forEach(item => {
                    const { name, quantity } = item;
                    usersInfo[winnerID].inventory.petItems[name] = {
                        type: items[name].type,
                        name: items[name].name,
                        quantity: userPetItems.hasOwnProperty(name) ? userPetItems[name].quantity + quantity : quantity
                    }
                });

                Object.keys(usersInfo[winnerID].inventory.pets).forEach(pet => {
                    const userPetParameters = usersInfo[winnerID].inventory.pets[pet];

                    usersInfo[winnerID].inventory.pets[pet].health = +userPetParameters.health * (1 - winnerStat.health) > 0 ? +(userPetParameters.health * (1 - winnerStat.health)).toFixed(2) : 0;
                    usersInfo[winnerID].inventory.pets[pet].endurance = +userPetParameters.endurance * (1 - winnerStat.endurance) > 0 ? +(userPetParameters.endurance * (1 - winnerStat.endurance)).toFixed(2) : 0;
                    usersInfo[winnerID].inventory.pets[pet].damage = +userPetParameters.damage * (1 - winnerStat.damage) > 0 ? +(userPetParameters.damage * (1 - winnerStat.damage)).toFixed(2): 0;
                    usersInfo[winnerID].inventory.pets[pet].speed = +userPetParameters.speed * (1 - winnerStat.speed) > 0.1 ? +(userPetParameters.speed * (1 - winnerStat.speed)).toFixed(2): 0.1;
                    usersInfo[winnerID].inventory.pets[pet].exp = +userPetParameters.exp + winnerStat.exp > 0 ? +(userPetParameters.exp + winnerStat.exp).toFixed(2) : 0;
                });
            });

            loser.forEach(loserID => {
                usersInfo[loserID].money += +loserStat.money.toFixed(0);
                loserStat.item.forEach(item => {
                    const { name, quantity } = item;
                    usersInfo[loserID].inventory.petItems[name] = {
                        type: items[name].type,
                        name: items[name].name,
                        quantity: userPetItems.hasOwnProperty(name) ? userPetItems[name].quantity + quantity : quantity
                    }
                });

                Object.keys(usersInfo[loserID].inventory.pets).forEach(pet => {
                    const userPetParameters = usersInfo[loserID].inventory.pets[pet];

                    usersInfo[loserID].inventory.pets[pet].health = +userPetParameters.health * (1 - loserStat.health) > 0 ? +(userPetParameters.health * (1 - loserStat.health)).toFixed(2) : 0;
                    usersInfo[loserID].inventory.pets[pet].endurance = +userPetParameters.endurance * (1 - loserStat.endurance) > 0 ? +(userPetParameters.endurance * (1 - loserStat.endurance)).toFixed(2) : 0;
                    usersInfo[loserID].inventory.pets[pet].damage = +userPetParameters.damage * (1 - loserStat.damage) > 0 ? +(userPetParameters.damage * (1 - loserStat.damage)).toFixed(2): 0;
                    usersInfo[loserID].inventory.pets[pet].speed = +userPetParameters.speed * (1 - loserStat.speed) > 0.1 ? +(userPetParameters.speed * (1 - loserStat.speed)).toFixed(2): 0.1;
                    usersInfo[loserID].inventory.pets[pet].exp = +userPetParameters.exp + loserStat.exp > 0 ? +(userPetParameters.exp + loserStat.exp).toFixed(2) : 0;
                });
            });


            const renderTable = TableRenderer({ paddingHorizontal: 30, paddingVertical: 30, titleSpacing: 10, fontFamily: "Quicksand" }).render;
            const canvasTable = renderTable({
                title: "KẾT QUẢ VÁN ĐẤU",
                titleStyle: {
                    font: "normal 30px Bungee",
                    fillStyle: "#30343f"
                },
                columns: [
                    { width: 150, title: "TÌNH TRẠNG", dataIndex: "status" },
                    { width: 250, title: "NGƯỜI CHƠI", dataIndex: "user" },
                    { width: 150, title: "LƯỢNG MÁU", dataIndex: "health" },
                    { width: 150, title: "SỨC BỀN", dataIndex: "endurance" },
                    { width: 150, title: "SÁT THƯƠNG", dataIndex: "damage" },
                    { width: 150, title: "TỐC ĐỘ", dataIndex: "speed" },
                    { width: 150, title: "KINH NGHIỆM", dataIndex: "exp" },
                    { width: 200, title: "VẬT PHẨM", dataIndex: "item" },
                    { width: 200, title: "TIỀN THƯỞNG", dataIndex: "money" },
                ],
                dataSource: [
                    "-",
                    {
                        status: "THẮNG",
                        user: winner.map(winnerID => usersInfo[winnerID].fullName).join(", "),
                        health: `- ${(winnerStat.health * 100).toFixed(0)}%`,
                        endurance: `- ${(winnerStat.endurance * 100).toFixed(0)}%`,
                        damage: `- ${(winnerStat.damage * 100).toFixed(0)}%`,
                        speed: `- ${(winnerStat.speed * 100).toFixed(0)}%`,
                        exp: winnerStat.exp > 0 ? "+ " + winnerStat.exp.toFixed(0) : winnerStat.exp.toFixed(0).toString().replace("-", "- "),
                        item: winnerStat.item.map(item => items[item.name].name).join(", ") || "-",
                        money: winnerStat.money > 0 ? "+ " + winnerStat.money.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") : winnerStat.money.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ").replace("-", "- "),
                    },
                    {
                        status: "THUA",
                        user: loser.map(loserID => usersInfo[loserID].fullName).join(", "),
                        health: `- ${(loserStat.health * 100).toFixed(0)}%`,
                        endurance: `- ${(loserStat.endurance * 100).toFixed(0)}%`,
                        damage: `- ${(loserStat.damage * 100).toFixed(0)}%`,
                        speed: `- ${(loserStat.speed * 100).toFixed(0)}%`,
                        exp: loserStat.exp > 0 ? "+ " + loserStat.exp.toFixed(0) : loserStat.exp.toFixed(0).toString().replace("-", "- "),
                        item: loserStat.item.map(item => items[item].name).join(", ") || "-",
                        money: loserStat.money > 0 ? "+ " + loserStat.money.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") : loserStat.money.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ").replace("-", "- "),
                    }
                ]
            });

            await saveImage(canvasTable, resolve(cachesPath, "petsWarStat.png"));
            await message.reply({ attachment: fs.createReadStream(resolve(petAssetsPath, "cockFighting.png")) });
            await delay(1500);
            await message.reply(warNotificateSentences(usersInfo[winner[0]].fullName, usersInfo[loser[0]].fullName)[random(0, warNotificateSentences(usersInfo[winner[0]].fullName, usersInfo[loser[0]].fullName).length)]);

            updateUsersInfo(global.usersInfo);
            message.reply({
                body: `- NGƯỜI THẮNG CUỘC: ${winner.map(winnerID => "@" + usersInfo[winnerID].fullName).join(" ")}\n- SỨC MẠNH CHÊNH LỆCH: ${Math.abs(disparity.toFixed(0))}`,
                mentions: winner.map(winnerID => {
                    return { tag: "@" + usersInfo[winnerID].fullName, id: winnerID }
                }),
                attachment: fs.createReadStream(resolve(cachesPath, "petsWarStat.png"))
            });
            message.react("🔹");
            return;
        }

        message.react("⭕️");
        message.reply(notEnoughCommandSentences[random(0, notEnoughCommandSentences.length)]);
    } catch(error) {
        console.log(error)
        message.react("⭕️");
        message.reply(errorSentences[random(0, errorSentences.length)]);
    }
}

// ----- < [ EXPORT ] - XUẤT MODULE > ----- //
module.exports = {
    config,
    onCall
}