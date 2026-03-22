let text = 'He earns 4000 euro from salary per month, 10000 euro annual bonus, 5500 euro online courses per month.';
let numbers = text.match(/\d+/g).map(Number);
console.log(numbers);

let salary = numbers[0] * 12;
let bonus = numbers[1];
let online = numbers[2] * 12;

let total = salary + bonus + online;
console.log(total);

let points = ['-1', '2', '-4', '-3', '-1', '0', '4', '8'];

let nums = points.map(Number).sort((a, b) => a - b);

let distance = nums[nums.length - 1] - nums[0];

console.log(nums);
console.log(distance);

function isValidVariable(str) {
    return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(str);
}

console.log(isValidVariable('first_name'));
console.log(isValidVariable('first-name'));
console.log(isValidVariable('1first_name'));
console.log(isValidVariable('firstname'));

// level 2
let paragraph = `I love teaching. If you do not love teaching what else can you love. I love Python if you do not love something which can give you all the capabilities to develop an application what else can you love.`;
function tenMostFrequentWords(paragraph, n = 10) {
    let words = text.replace(/[.,]/g, "").split(" ");

    let count = {};

    words.forEach(w => {
        count[w] = (count[w] || 0) + 1;
    });

    return Object.entries(count).map(([word, count]) => ({ word, count })).sort((a, b) => b.count - a.count).slice(0, n);
}

console.log(tenMostFrequentWords(paragraph));

let sentence = `%I $am@% a %tea@cher%, &and& I lo%#ve %tea@ching%;. There $is nothing; &as& mo@re rewarding as educa@ting &and& @emp%o@wering peo@ple. ;I found tea@ching m%o@re interesting tha@n any other %jo@bs. %Do@es thi%s mo@tivate yo@u to be a tea@cher!?`

let text1 = "";
function cleanText(sentence){
    return text1 = sentence.replace(/[^a-zA-Z\s]/g,"");
}
console.log(cleanText(sentence));

function mostFrequentWords(text,n=3)
{
    let words = text.split(" ");

    let count = {};
    words.forEach(w=>{
        count[w] = (count[w] || 0) + 1;
    });

    return Object.entries(count).map(([word,count])=>({word,count})).sort((a,b) => b.count - a.count)
    .slice(0,n);
}

console.log(mostFrequentWords(text1));