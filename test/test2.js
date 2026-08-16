const getAverageColor = require("fast-average-color-node").getAverageColor;
const { createCanvas, loadImage } = require("canvas");
const { resolve } = require("path");
const fs = require("fs");

async function run() {
const TILES = 150;
const SIZE = 1.5;
const SOURCE_IMAGE = "./1.jpg";
const SOURCE_DIR = resolve("./a");

const getColorsLibrary = async (sourceDir) => {
    const colorsLibrary = [];
    const images = fs.readdirSync(sourceDir);
    const imagesPath = images.map(image => resolve(sourceDir, image));

    for (let index = 0; index < imagesPath.length; index++)
        await getAverageColor(imagesPath[index]).then(color => colorsLibrary.push({ path: imagesPath[index], color: color.value }));

    return colorsLibrary;
}

const getImageColorsTile = async (sourceImage, tiles) => {
    const imageColorsTile = [];
    const image = await loadImage(sourceImage);
    const tileWidth = image.width * SIZE / tiles;
    const tileHeight = image.height * SIZE / tiles;
    const canvas = createCanvas(image.width * SIZE, image.height * SIZE);
    const ctx = canvas.getContext("2d");
    
    ctx.drawImage(image, 0, 0, image.width * SIZE, image.height * SIZE);

    for (let x = 1; x <= tiles; x++)
        for (let y = 1; y <= tiles; y++) {
            const drawX = tileWidth * (x - 1);
            const drawY = tileHeight * (y - 1);
            const drawWidth = tileWidth;
            const drawHeight = tileHeight;
            const imageData = ctx.getImageData(drawX, drawY, drawWidth, drawHeight).data;
            const imageColorData = { r: 0, g: 0, b: 0, a: 0 }
            
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
            
            imageColorsTile.push({
                color: [imageColorData.r, imageColorData.g, imageColorData.b, imageColorData.a],
                x: drawX,
                y: drawY,
                width: drawWidth,
                height: drawHeight
            })
        }
    
    return imageColorsTile;
}

const findMatchColorImage = (color, colorsLibrary) => {
    let minDifference = Infinity;
    let matchColorPath = null;

    colorsLibrary.forEach(colorLibrary => {
        const difference = Math.sqrt((color[0] - colorLibrary.color[0]) ** 2 + (color[1] - colorLibrary.color[1]) ** 2 + (color[2] - colorLibrary.color[2]) ** 2 + (color[3] - colorLibrary.color[3]) ** 2);

        if (difference < minDifference) {
            minDifference = difference;
            matchColorPath = colorLibrary.path;
        }
    })

    return matchColorPath;
}

const colorsLibrary = await getColorsLibrary(SOURCE_DIR);
const imageColorsTile = await getImageColorsTile(SOURCE_IMAGE, TILES);

const image = await loadImage(SOURCE_IMAGE);
const canvas = createCanvas(image.width * SIZE, image.height * SIZE);
const ctx = canvas.getContext("2d");

for (const [index, colorTile] of imageColorsTile.entries()) {
    const matchColorPath = findMatchColorImage(colorTile.color, colorsLibrary);
    const mathColorImage = await loadImage(matchColorPath);
    ctx.drawImage(mathColorImage, colorTile.x, colorTile.y, colorTile.width, colorTile.height);

    console.log(`> PROGRESS:\t${index + 1}/${imageColorsTile.length}\t-\t${((index + 1) / imageColorsTile.length * 100).toFixed(2)}%`);
}

canvas.createPNGStream().pipe(fs.createWriteStream("a.png"));

}
run();