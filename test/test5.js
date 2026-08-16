const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");

async function run() {
    const SOURCE_IMAGE = "";
    const PHRASE = "";

    const getImageHtmlCode = async (sourceImage, size, phrase) => {
        const imageHtmlCode = [];
        const image = await loadImage(sourceImage);
        const canvas = createCanvas(image.width, image.height);
        const ctx = canvas.getContext("2d");
        const processedPhrase = phrase.replaceAll(" ", "");
        let phraseCount = 0;

        ctx.drawImage(image, 0, 0, image.width, image.height);

        for (let y = 1; y <= image.height / size; y++) {
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

                imageHtmlCode.push(`<b style="color: rgba(${imageColorData.r}, ${imageColorData.g}, ${imageColorData.b}, ${imageColorData.a})">${processedPhrase[phraseCount++]}</b>`);
                if (phraseCount >= processedPhrase.length) phraseCount = 0;
            }
            imageHtmlCode.push("<br>");
        }

        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${phrase}</title>
    <style>
        body { background-color: black; width: 100vw; height: 100vh; }
        b {font-size: 18px; margin: 0 3px; }
    </style>
</head>
<body>
    ${imageHtmlCode.join("")}
</body>
</html>
    `;
    };

    const imageHtmlCode = await getImageHtmlCode(SOURCE_IMAGE, 3, PHRASE);
    fs.writeFileSync(`./${PHRASE.replaceAll(" ", "_")}.html`, imageHtmlCode);
}
run();
