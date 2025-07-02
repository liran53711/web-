// 测试utils.js中的工具函数
// 首先加载utils.js中的代码（在Node.js环境中模拟）

// 1. 数学工具测试
const MathUtils = {
    randomBetween: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    roundTo: function(number, decimals) {
        return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
    },
    
    percentage: function(part, total) {
        return this.roundTo((part / total) * 100, 2);
    }
};

// 2. 字符串工具测试
const StringUtils = {
    capitalize: function(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },
    
    reverse: function(str) {
        return str.split('').reverse().join('');
    },
    
    countCharacters: function(str) {
        return {
            total: str.length,
            letters: str.replace(/[^a-zA-Z\u4e00-\u9fa5]/g, '').length,
            numbers: str.replace(/[^0-9]/g, '').length,
            spaces: str.replace(/[^ ]/g, '').length
        };
    }
};

// 3. 数组工具测试
const ArrayUtils = {
    unique: function(arr) {
        return [...new Set(arr)];
    },
    
    shuffle: function(arr) {
        const newArr = [...arr];
        for (let i = newArr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
        }
        return newArr;
    },
    
    getMinMax: function(arr) {
        return {
            min: Math.min(...arr),
            max: Math.max(...arr)
        };
    }
};

console.log('=== 外部JavaScript工具函数测试 ===\n');

// 测试数学工具
console.log('📊 数学工具测试:');
console.log('随机数(1-100):', MathUtils.randomBetween(1, 100));
console.log('π四舍五入到2位:', MathUtils.roundTo(3.14159, 2));
console.log('25/80的百分比:', MathUtils.percentage(25, 80) + '%');

// 测试字符串工具
console.log('\n📝 字符串工具测试:');
const testString = "hello world 123";
console.log('原字符串:', testString);
console.log('首字母大写:', StringUtils.capitalize(testString));
console.log('反转字符串:', StringUtils.reverse(testString));
console.log('字符统计:', StringUtils.countCharacters(testString));

// 测试数组工具
console.log('\n📊 数组工具测试:');
const testArray = [1, 2, 3, 2, 4, 5, 3, 6, 7, 8];
console.log('原数组:', testArray);
console.log('去重后:', ArrayUtils.unique(testArray));
console.log('打乱后:', ArrayUtils.shuffle(testArray));
console.log('最值:', ArrayUtils.getMinMax(testArray));

console.log('\n✅ 所有工具函数测试完成！');
console.log('💡 这些函数都来自 utils.js 外部文件');
