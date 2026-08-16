const fs = require("fs");
const { resolve } = require("path");
const filesLibrary = [];
const answer = [];
const question = [];
const regex = /câu\s\d+\s*:?\s*/gi;
let content = "";

const readAllFiles = (dir) => {
    const files = fs.readdirSync(dir, { withFileTypes: true });

    for (const file of files) {
        filesLibrary.push(resolve(dir, file.name));
    }
};

const processFile = async (file) => {
    const data = fs.readFileSync(file, { encoding: "utf8" });
    return data.replace(regex, "");
};

readAllFiles(resolve(process.cwd(), "ktck"));

(async function () {
    for (let i = 0; i < filesLibrary.length; i++) {
        content += (await processFile(filesLibrary[i])) + "\n\n\n";
    }

    let count = 1;
    const contents = content.split("\n");
    for (let i = 0; i < contents.length; i++) {
        const line = contents[i];

        if (line.startsWith("ANSWER:")) {
            answer.push(count + " - " + line.replace("ANSWER: ", "").replace("\r", ""));
            question.push("\nCÂU " + ++count + ": ");
        } else if (line != "\r") {
            // if (question.includes(line) && question[question.length - 1].match(regex)) {
            //     console.log(line);
            //     let temp = 0;
            //     for (let j = i; j < contents.length; j++) {
            //         temp++;
            //         if (contents[j].startsWith("ANSWER:")) break;
            //     }
            //     i += temp;
            // } else
            question.push(line);
        }
    }

    fs.writeFileSync(resolve(process.cwd(), "tin/content.txt"), content);
    fs.writeFileSync(resolve(process.cwd(), "tin/question.txt"), question.join(""));
    fs.writeFileSync(resolve(process.cwd(), "tin/answer.txt"), answer.join("\n"));
})();
