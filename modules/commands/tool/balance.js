/* -----------------------------------------------
    < COMMAND > --- < ELECTRON CONFIGURATION >
------------------------------------------------ */

// ----- < [ CONFIG ] - THÔNG TIN VỀ LỆNH > ----- //
const config = {
    name: "balance",
    description: "Lệnh cân bằng phương trình hóa học.",
    type: "tool",
    usage: "/kiki balance [ PTHH ]",
    condition: ["can bang", "cb", "balance"],
    exception: [],
    permission: 0,
    priority: 2
}

// ----- < [ HÀM ] - XỬ LÍ LỆNH > ----- //
async function onCall({ message, args }) {
    await message.react("⏱");
    
    const { random } = global.function;
    const errorSentences = [
        "Lỗi r, thg ad đâu lo đi fix đi 🙂",
        "Lỗi cmnr thử lại đi 🙂",
        "Lỗi r tại m đó, thử lại đi",
        "Ăn ở cak j mà lỗi r, thử lại đi 🙂",
        "Thử lại đi lỗi cmnr 🙂",
        "Djt cụ m lỗi r, thử lại xem",
        "Lỗi r , có cái lệnh cx k xog 🙂"
    ];
    const outElectronSentences = [
        "Nhập số ngu vl",
        "Nguu đéo chịu được",
        "Nhập nguu đ thể tả đc 🙂",
        "Nguu như này khỏi cứu 🙂",
        "Óc lồn 🙂",
        "Não cặc à, nhập đéo j v 🙂",
        "Đ bt dùng lệnh thì cút hộ"
    ];

    try {
        const PTHH = args.join("").replace("->", "=") + "+";
        const elementsArray = [];
        const factorArray = [];
        const elementsFactor = [];
        const resultFactor = [];
        const matrix = [];
        let tempMap = new Map(), temp = 0, n = 0, result = "";
        
        const UCLN = (x, y) => {
            if (x == 0 && y == 0) return 0;
            if (x * y == 0) return (x == 0) ? x : y;
        
            while (x % y != 0) {
                let temp =  x % y;
                x = y;
                y = temp;
            }
        
            return y;
        }
        const multiple = (x, y) => {
            for (let i = 0; i < n; i++) matrix[x][i] *= y;
        }
        const subtract = (x, y) => {
            for (let i = 0; i < n; i++) matrix[x][i] -= matrix[y][i];
        }
        const simplize = () => {
            let temp;
            for (let i = 0; i < temp; i++) {
                for (let j = 0; j < n; j++)
                    if (matrix[i][j] != 0) {
                        temp = matrix[i][j];
                        break;
                    }
        
                for (let j = 0; j < n; j++)
                    if (matrix[i][j] != 0) temp = UCLN(temp, matrix[i][j]);
        
                for (let j = 0; j < n; j++) matrix[i][j] /= temp;
            }
        }
        
        
        let tempElement = "", count = 0, leftRight = 1;
        PTHH.split("").filter(char => char != " ").forEach(char => {
            if (char == "+") {
                elementsArray.push(tempElement);
                factorArray.push(leftRight);
        
                count++;
                tempElement = "";
            }
            else if (char == "=" || char == "→") {
                elementsArray.push(tempElement);
                factorArray.push(leftRight);
        
                count++;
                tempElement = "";
                leftRight = -1;
            }
            else tempElement += char;
        });
        
        
        
        n = elementsArray.length;
        elementsArray.forEach((element, index) => {
            elementsFactor.push(new Map());
            const elementArray = element.split("");
            let outerFactor = 1, elementName = "";
        
            for (let i = elementArray.length - 1; i >= 0; i--) {
                if (!isNaN(parseInt(elementArray[i]))) {
                    if (outerFactor == 1 && element.includes("(")) outerFactor = parseInt(elementArray[i]);
                    else {
                        let factor = 0, temp = 1;
        
                        while(!isNaN(parseInt(elementArray[i]))) {
                            factor = parseInt(elementArray[i]) * temp;
                            temp *= 10;
                            i--;
                        }
        
                        while(elementArray[i] >= "a" && elementArray[i] <= "z") {
                            elementName += elementArray[i];
                            i--;
                        }
        
                        elementName += elementArray[i];
                        elementsFactor[index].set(elementName, factor * outerFactor * factorArray[index]);
                        elementName = "";
                    }
                }
                
                else if (elementArray[i] >= "a" && elementArray[i] <= "z") {
                    while(elementArray[i] >= "a" && elementArray[i] <= "z") {
                        elementName += elementArray[i];
                        i--;
                    }
        
                    elementName += elementArray[i];
                    elementsFactor[index].set(elementName, outerFactor * factorArray[index]);
                    elementName = "";
                }
        
                else if (elementArray[i] >= "A" && elementArray[i] <= "Z") {
                    elementName += elementArray[i];
                    elementsFactor[index].set(elementName, outerFactor * factorArray[index]);
                    elementName = "";
                }
        
                else if (elementArray[i] == "(") outerFactor = 1;
            }
        });
        
        
        
        for (let i = 0; i < n; i++) matrix.push([]);
        elementsFactor.forEach(elementFactor => {
            elementFactor.forEach((factor, element) => {
                if (tempMap.get(element) != 369) {
                    for (let i = 0; i < n; i++) matrix[temp][i] = elementsFactor[i].get(element) || 0;
                    temp++;
                    tempMap.set(element, 369);
                }
            });
        });
        
        
        
        for (let i = 0; i < n - 1; i++) {
            let tempIndex = temp - 1;
        
            while(matrix[tempIndex][i] == 0) tempIndex--;
        
            for (let j = tempIndex - 1; j >= i; j--)
                if (matrix[j][i] == 0) {
                    [matrix[j], matrix[tempIndex]] = [matrix[tempIndex], matrix[j]];
                    temp--;
                }
        
            for (let j = temp - 1; j >= i + 1; j--)
                if (matrix[j][i] != 0) {
                    let tempMul = matrix[i][i];
                    multiple(i, matrix[j][i]);
                    multiple(j, tempMul);
                    subtract(j, i);
                }
            
            simplize();
        }
        
        temp = n - 1;
        
        for (let i = n - 2; i >= 1; i--){
            for (let j = 0; j < i; j++)
                if (matrix[j][i] != 0){
                    let temp = matrix[i][i];
                    multiple(i, matrix[j][i]);
                    multiple(j, temp);
                    subtract(j, i);
                }
        
            simplize();
        }
        
        resultFactor[n - 1] = 1;
        for (let i = 0; i < n - 1; i++) resultFactor[n - 1] *= matrix[i][i];
        for (let i = 0; i < n - 1; i++) resultFactor[i] = -resultFactor[n - 1] * matrix[i][n - 1] / matrix[i][i];
        for (let i = 0; i < n; i++)
            if (resultFactor[i] < 0) resultFactor[i] = -resultFactor[i];
        
        let orginFactor = resultFactor[0];
        for (let i = 1; i < n; i++) orginFactor = UCLN(orginFactor, resultFactor[i]);
        for (let i = 0; i < n; i++) resultFactor[i] /= orginFactor;
        
        
        
        elementsArray.forEach((element, index) => {
            if (resultFactor[index] > 1) result += resultFactor[index];
            result += element;
        
            if (factorArray[index] > 0 && factorArray[index + 1] < 0) result += " → ";
            else if (index != n - 1) result += " + ";
        });
        
        message.reply(result);
        message.react("🔹");

    } catch(error) {
        console.log(error);
        message.react("⭕️");
        message.reply(errorSentences[random(0, errorSentences.length)]);
    }
}

// ----- < [ EXPORT ] - XUẤT MODULE > ----- //
module.exports = {
    config,
    onCall
}