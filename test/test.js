const food = { corn: '🌽', bacon: '🥓' };

const cloneFood = Object.assign(food, {});

cloneFood.bacon = "a"

console.log(cloneFood); 
console.log(food); 
// { corn: '🌽', bacon: '🥓' }
