const line = (x) => {
    return x + 10;
};

class MachineLearning {
    constructor(inputNumber, learningRate) {
        this.inputNumber = inputNumber;
        this.learningRate = learningRate;
        this.bias = 1;
        this.weights = [];

        for (let i = 0; i <= inputNumber; i++) this.weights[i] = Math.random() * 2 - 1;
    }

    active(inputs) {
        let result = 0;

        inputs.forEach((input, index) => {
            result += input * this.weights[index];
        });

        return result > 0 ? 0 : 1;
    }

    train(inputs, desire) {
        inputs.push(this.bias);
        const result = this.active(inputs);
        const error = result - desire;

        if (error != 0)
            this.weights.forEach((weight, index) => {
                this.weights[index] = weight + error * inputs[index] * this.learningRate;
            });

        trainHistory.push({
            x: inputs[0],
            y: inputs[1],
            guess: result,
            result: desire,
            weight: this.weights
        });
    }
}

const trainHistory = [];
const ML = new MachineLearning(2, 0.00001);

for (let i = 0; i < 10; i++) {
    const trainX = Math.random() * 1000;
    const trainY = Math.random() * 1000;
    const trainResult = trainY > line(trainX) ? 1 : 0;

    ML.train([trainX, trainY], trainResult);
}

console.table(trainHistory);
console.log(275 > line(100) ? 1 : 0);
console.log(ML.active([100, 275]));
