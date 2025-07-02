// ===== JavaScript 基础语法学习 =====

// 1. 变量声明
console.log("=== 1. 变量声明 ===");
let name = "张三";  // let 用于声明可变变量
const age = 25;     // const 用于声明常量
var city = "北京";   // var 是旧式声明方式（不推荐）

console.log("姓名:", name);
console.log("年龄:", age);
console.log("城市:", city);

// 2. 数据类型
console.log("\n=== 2. 数据类型 ===");
let number = 42;           // 数字
let text = "Hello World";  // 字符串
let isTrue = true;         // 布尔值
let nothing = null;        // 空值
let notDefined = undefined; // 未定义

console.log("数字:", number, typeof number);
console.log("字符串:", text, typeof text);
console.log("布尔值:", isTrue, typeof isTrue);

// 3. 数组（列表）
console.log("\n=== 3. 数组 ===");
let fruits = ["苹果", "香蕉", "橙子"];
console.log("水果列表:", fruits);
console.log("第一个水果:", fruits[0]);
console.log("数组长度:", fruits.length);

// 添加元素
fruits.push("葡萄");
console.log("添加后的数组:", fruits);

// 4. 对象
console.log("\n=== 4. 对象 ===");
let person = {
    name: "李四",
    age: 30,
    hobby: "编程"
};
console.log("人员信息:", person);
console.log("姓名:", person.name);
console.log("年龄:", person.age);

// 5. 函数
console.log("\n=== 5. 函数 ===");
function greet(name) {
    return "你好, " + name + "!";
}

// 箭头函数（现代写法）
const add = (a, b) => {
    return a + b;
};

console.log(greet("王五"));
console.log("5 + 3 =", add(5, 3));

// 6. 条件语句
console.log("\n=== 6. 条件语句 ===");
let score = 85;
if (score >= 90) {
    console.log("优秀");
} else if (score >= 80) {
    console.log("良好");
} else if (score >= 60) {
    console.log("及格");
} else {
    console.log("不及格");
}

// 7. 循环
console.log("\n=== 7. 循环 ===");
// for 循环
console.log("for 循环:");
for (let i = 1; i <= 5; i++) {
    console.log("第" + i + "次循环");
}

// 遍历数组
console.log("遍历数组:");
for (let fruit of fruits) {
    console.log("我喜欢" + fruit);
}

// 8. 事件处理函数示例（为网页互动准备）
console.log("\n=== 8. 事件处理函数 ===");
function handleClick() {
    console.log("按钮被点击了！");
}

function handleInput(value) {
    console.log("输入的内容:", value);
}

console.log("基础语法学习完成！接下来我们将学习网页互动...");
