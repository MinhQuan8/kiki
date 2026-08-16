const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");

async function run() {
    const SOURCE_IMAGE = "./phatquan.jpg";

    const getImageHtmlCode = async (sourceImage, size) => {
        const imageHtmlCode = [];
        const a = [];
        const image = await loadImage(sourceImage);
        const canvas = createCanvas(image.width, image.height);
        const ctx = canvas.getContext("2d");
        const ASCII = "`^”,:;Il!i~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";

        ctx.drawImage(image, 0, 0, image.width, image.height);

        for (let y = 1; y <= image.height / size; y++) {
            imageHtmlCode.push("<div>");
            for (let x = 1; x <= image.width / size; x++) {
                const drawY = size * (y - 1);
                const drawX = size * (x - 1);
                const drawWidth = size;
                const drawHeight = size;
                const imageData = ctx.getImageData(drawX, drawY, drawWidth, drawHeight).data;
                const imageColorData = { r: 0, g: 0, b: 0, a: 0 };

                for (let i = 0; i < imageData.length; i += 4) {
                    imageColorData.r += imageData[i];
                    imageColorData.g += imageData[i + 1];
                    imageColorData.b += imageData[i + 2];
                    imageColorData.a += imageData[i + 3];
                }

                imageColorData.r = Math.floor(imageColorData.r / (imageData.length / 4));
                imageColorData.g = Math.floor(imageColorData.g / (imageData.length / 4));
                imageColorData.b = Math.floor(imageColorData.b / (imageData.length / 4));
                imageColorData.a = Math.floor(imageColorData.a / (imageData.length / 4));
                imageColorData.bright = Math.sqrt(0.299 * imageColorData.r ** 2 + 0.587 * imageColorData.g ** 2 + 0.114 * imageColorData.b ** 2);

                imageHtmlCode.push(`<b style="color: rgba(${imageColorData.r}, ${imageColorData.g}, ${imageColorData.b}, ${imageColorData.a})">${ASCII[parseInt((ASCII.length - 1) * (imageColorData.bright / 255.0))]}</b>`);
            }
            imageHtmlCode.push("</div>");
        }

        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ASCII</title>
    <style>
        body { background-color: black; }
        div { display: inline-flex; }
        b { display: inline-block; width: 12px; font-size: 18px; margin: 0 3px; text-align: center; }
    </style>
</head>
<body>
    ${imageHtmlCode.join("")}
</body>
</html>
    `;
    };

    const imageHtmlCode = await getImageHtmlCode(SOURCE_IMAGE, 3);
    fs.writeFileSync(`./ASCII.html`, imageHtmlCode);
}
run();
