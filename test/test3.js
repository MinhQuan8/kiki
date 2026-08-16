const fs = require("fs");
const { resolve } = require("path");
const { createCanvas, loadImage, registerFont } = require("canvas");

registerFont("./assets/fonts/Hatton-Bold.otf", { family: "Hatton" });
registerFont("./assets/fonts/Quicksand-Bold.otf", { family: "Quicksand-Bold" });
registerFont("./assets/fonts/Quicksand-Medium.ttf", { family: "Quicksand" });

(async function() {
    const canvas = createCanvas(1200, 600);
    const ctx = canvas.getContext("2d");
    
    const background = await loadImage("assets/lottery/lotteryBackground.png")
    
    ctx.drawImage(background, 0, 0);

    ctx.fillStyle = "#FFFAEF";
    ctx.font = "normal 130px Hatton";
    ctx.fillText("218328", 130, 480);

    ctx.font = "bold 30px Quicksand-Bold";
    ctx.fillText("18:00:00", 875, 420);
    
    ctx.font = "normal 30px Quicksand";
    ctx.fillText("09/16/2024", 875, 460);
    
    canvas.createPNGStream().pipe(fs.createWriteStream("couple.png"));
})();