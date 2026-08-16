function shuffleArray(array1) {
    for (let i = array1.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array1[i], array1[j]] = [array1[j], array1[i]];
    }
}

async function a() {
const parseXlsx = require("excel").default;

let trainData;
const trainHistory = []
await parseXlsx("./Sonar Data.xlsx").then(data => trainData = data);


class MachineLearning {
    constructor (inputNumber, learningRate) {
        this.inputNumber = inputNumber;
        this.learningRate = learningRate;
        this.bias = 1;
        this.weights = [];

        for (let i = 0; i <= inputNumber; i++) this.weights[i] = Math.random() * 2 - 1;
    }

    active(inputs) {
        let result = 0;

        inputs.forEach((input, index) => {
            result += +input * this.weights[index];
        });

        return result > 0 ? 0 : 1;
    }

    train(inputs, desire) {
        inputs.push(this.bias);
        const result = this.active(inputs);
        const error = result - desire;

        if (error != 0) {
            this.weights.forEach((weight, index) => {
                this.weights[index] += error * +inputs[index] * this.learningRate;
            });
        }

        trainHistory.push({
            input: inputs,
            guess: result,
            result: desire,
            weight: this.weights.slice(0, 3)
        })
        
    }
}

const ML = new MachineLearning(trainData[0].length - 1, 0.1);

for (let i = 0; i < 1000; i++) {
    shuffleArray(trainData)
    trainData.forEach((data) => {
        ML.train(data.slice(0, -1), data[data.length - 1] == "M" ? 1 : 0);
    })
}

console.table(trainHistory)
console.log(ML.active(trainData[0].slice(0, -1)));
}

a()