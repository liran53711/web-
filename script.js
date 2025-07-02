// ===== 外部JavaScript文件：script.js =====

// 1. 基础变量和常量
const APP_NAME = "我的网页应用";
const VERSION = "1.0.0";
let userCount = 0;

// 2. 工具函数
function getCurrentTime() {
    const now = new Date();
    return now.toLocaleString('zh-CN');
}

function generateRandomColor() {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// 3. 页面初始化函数
function initializePage() {
    console.log(`${APP_NAME} v${VERSION} 已加载`);
    console.log(`页面加载时间: ${getCurrentTime()}`);
    
    // 显示欢迎信息
    const welcomeElement = document.getElementById('welcome-message');
    if (welcomeElement) {
        welcomeElement.textContent = `欢迎来到 ${APP_NAME}！`;
        welcomeElement.style.color = generateRandomColor();
    }
    
    // 更新时间显示
    updateTimeDisplay();
    // 每秒更新一次时间
    setInterval(updateTimeDisplay, 1000);
}

// 4. 用户交互函数
function handleUserLogin() {
    const nameInput = document.getElementById('user-name');
    const name = nameInput.value.trim();
    
    if (name === '') {
        showMessage('请输入您的姓名！', 'error');
        return;
    }
    
    userCount++;
    const message = `你好，${name}！您是第 ${userCount} 位客人。`;
    showMessage(message, 'success');
    
    // 清空输入框
    nameInput.value = '';
    
    // 更新用户统计
    updateUserStats();
}

function changeTheme() {
    const body = document.body;
    const isDark = body.classList.contains('dark-theme');
    
    if (isDark) {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        showMessage('已切换到浅色主题', 'info');
    } else {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        showMessage('已切换到深色主题', 'info');
    }
}

function showRandomQuote() {
    const quotes = [
        "编程不仅仅是编写代码，更是解决问题的艺术。",
        "每一个专家都曾经是初学者。",
        "代码如诗，简洁而优雅。",
        "学习编程就像学习一门新语言。",
        "最好的代码是不需要注释的代码。"
    ];
    
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const quoteElement = document.getElementById('quote-display');
    
    if (quoteElement) {
        quoteElement.textContent = `"${randomQuote}"`;
        quoteElement.style.fontStyle = 'italic';
        quoteElement.style.color = generateRandomColor();
    }
}

// 5. 辅助函数
function showMessage(message, type = 'info') {
    const messageElement = document.getElementById('message-display');
    if (!messageElement) return;
    
    messageElement.textContent = message;
    messageElement.className = `message ${type}`;
    
    // 3秒后清除消息
    setTimeout(() => {
        messageElement.textContent = '';
        messageElement.className = 'message';
    }, 3000);
}

function updateTimeDisplay() {
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        timeElement.textContent = `当前时间: ${getCurrentTime()}`;
    }
}

function updateUserStats() {
    const statsElement = document.getElementById('user-stats');
    if (statsElement) {
        statsElement.textContent = `总访问人数: ${userCount}`;
    }
}

// 6. 计算器功能
const Calculator = {
    add: (a, b) => a + b,
    subtract: (a, b) => a - b,
    multiply: (a, b) => a * b,
    divide: (a, b) => b !== 0 ? a / b : '不能除以零',
    
    calculate: function() {
        const num1 = parseFloat(document.getElementById('calc-num1').value);
        const num2 = parseFloat(document.getElementById('calc-num2').value);
        const operation = document.getElementById('calc-operation').value;
        const resultElement = document.getElementById('calc-result');
        
        if (isNaN(num1) || isNaN(num2)) {
            resultElement.textContent = 'So dumn！';
            resultElement.style.color = 'red';
            return;
        }
        
        let result;
        switch (operation) {
            case 'add':
                result = this.add(num1, num2);
                break;
            case 'subtract':
                result = this.subtract(num1, num2);
                break;
            case 'multiply':
                result = this.multiply(num1, num2);
                break;
            case 'divide':
                result = this.divide(num1, num2);
                break;
            default:
                result = '未知操作';
        }
        
        resultElement.textContent = `结果: ${result}`;
        resultElement.style.color = 'green';
    }
};

// 7. 当DOM加载完成时初始化页面
document.addEventListener('DOMContentLoaded', initializePage);

// 8. 导出一些函数供其他文件使用（如果需要）
console.log('外部JavaScript文件 script.js 已加载完成！');
