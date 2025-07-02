// ===== 工具类文件：utils.js =====
// 这个文件包含一些通用的工具函数

// 1. 数学工具
const MathUtils = {
    // 生成随机数
    randomBetween: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    // 四舍五入到指定小数位
    roundTo: function(number, decimals) {
        return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
    },
    
    // 计算百分比
    percentage: function(part, total) {
        return this.roundTo((part / total) * 100, 2);
    }
};

// 2. 字符串工具
const StringUtils = {
    // 首字母大写
    capitalize: function(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },
    
    // 反转字符串
    reverse: function(str) {
        return str.split('').reverse().join('');
    },
    
    // 统计字符数量
    countCharacters: function(str) {
        return {
            total: str.length,
            letters: str.replace(/[^a-zA-Z\u4e00-\u9fa5]/g, '').length,
            numbers: str.replace(/[^0-9]/g, '').length,
            spaces: str.replace(/[^ ]/g, '').length
        };
    }
};

// 3. 日期工具
const DateUtils = {
    // 格式化日期
    formatDate: function(date, format = 'YYYY-MM-DD') {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day)
            .replace('HH', hours)
            .replace('mm', minutes);
    },
    
    // 计算年龄
    calculateAge: function(birthDate) {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age;
    },
    
    // 获取星期几
    getDayName: function(date) {
        const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        return days[date.getDay()];
    }
};

// 4. 数组工具
const ArrayUtils = {
    // 数组去重
    unique: function(arr) {
        return [...new Set(arr)];
    },
    
    // 打乱数组
    shuffle: function(arr) {
        const newArr = [...arr];
        for (let i = newArr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
        }
        return newArr;
    },
    
    // 查找最大值和最小值
    getMinMax: function(arr) {
        return {
            min: Math.min(...arr),
            max: Math.max(...arr)
        };
    }
};

// 5. DOM工具
const DOMUtils = {
    // 快速获取元素
    get: function(selector) {
        return document.querySelector(selector);
    },
    
    // 获取所有匹配元素
    getAll: function(selector) {
        return document.querySelectorAll(selector);
    },
    
    // 创建元素
    create: function(tag, content = '', attributes = {}) {
        const element = document.createElement(tag);
        if (content) element.textContent = content;
        
        Object.keys(attributes).forEach(key => {
            element.setAttribute(key, attributes[key]);
        });
        
        return element;
    },
    
    // 显示/隐藏元素
    toggle: function(element) {
        if (element.style.display === 'none') {
            element.style.display = '';
        } else {
            element.style.display = 'none';
        }
    }
};

// 6. 验证工具
const ValidationUtils = {
    // 验证邮箱
    isEmail: function(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    // 验证手机号
    isPhone: function(phone) {
        const phoneRegex = /^1[3-9]\d{9}$/;
        return phoneRegex.test(phone);
    },
    
    // 验证身份证号
    isIdCard: function(idCard) {
        const idCardRegex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        return idCardRegex.test(idCard);
    },
    
    // 检查字符串长度
    checkLength: function(str, min, max) {
        const length = str.length;
        return length >= min && length <= max;
    }
};

console.log('工具类文件 utils.js 已加载完成！');
