const fs = require("fs");
const { resolve } = require("path");
const filesLibrary = [];

const readAllFiles = (dir) => {
    const files = fs.readdirSync(dir, { withFileTypes: true });

    for (const file of files) {
        if (file.isDirectory() && file.name != "node_modules") readAllFiles(resolve(dir, file.name));
        else if (file.name.endsWith("js")) filesLibrary.push(resolve(dir, file.name));
    }
};

const countChars = async (file) => {
    const data = fs.readFileSync(file, { encoding: "utf8" });
    return data.length;
};

readAllFiles(process.cwd());

(async function () {
    let count = 0;
    for (let i = 0; i < filesLibrary.length; i++) {
        const fileChars = await countChars(filesLibrary[i]);
        count += fileChars;
    }

    console.log(count);
})();
