# LocalStorage 本地存储方案

## 🗃️ LocalStorage 是什么？

LocalStorage 是**浏览器提供的本地存储功能**，可以在用户的电脑上保存数据。

### 💡 简单理解
想象成浏览器给你的一个**小仓库**：
- 📦 可以存放各种数据
- 🔒 只有你的网站能访问
- 💾 关闭浏览器后数据还在
- 🚀 读取速度很快

### 🎯 核心特点
- **简单易用** - 几行代码就能实现
- **无需配置** - 浏览器自带功能
- **离线可用** - 不需要网络连接
- **容量限制** - 通常5-10MB（够用了）
- **持久保存** - 除非手动删除或清理浏览器

## 🔍 LocalStorage vs 其他存储方式

| 存储方式 | 容量 | 持久性 | 复杂度 | 适用场景 |
|----------|------|--------|--------|----------|
| **变量** | 内存限制 | 刷新页面就没了 | 超简单 | 临时数据 |
| **LocalStorage** | 5-10MB | 永久保存 | 简单 | 本地应用数据 |
| **Cookie** | 4KB | 有过期时间 | 中等 | 用户设置 |
| **IndexedDB** | 几百MB | 永久保存 | 复杂 | 大量数据 |

## 📝 基本使用方法

### 🔧 核心API（只有4个方法）

```javascript
// 1. 保存数据
localStorage.setItem('key', 'value');

// 2. 读取数据  
const value = localStorage.getItem('key');

// 3. 删除数据
localStorage.removeItem('key');

// 4. 清空所有数据
localStorage.clear();
```

### 💾 保存不同类型的数据

```javascript
// 保存字符串（最简单）
localStorage.setItem('username', '张三');

// 保存数字（需要转换）
localStorage.setItem('coins', '1000');

// 保存对象（需要JSON格式）
const user = {
    name: '李四',
    level: 5,
    coins: 2000
};
localStorage.setItem('currentUser', JSON.stringify(user));

// 保存数组
const inventory = [
    { name: '稀有卡片', rarity: 'rare' },
    { name: '传说武器', rarity: 'legendary' }
];
localStorage.setItem('userInventory', JSON.stringify(inventory));
```

### 📖 读取不同类型的数据

```javascript
// 读取字符串
const username = localStorage.getItem('username');
console.log(username); // "张三"

// 读取数字（需要转换）
const coins = parseInt(localStorage.getItem('coins'));
console.log(coins); // 1000

// 读取对象（需要解析JSON）
const userStr = localStorage.getItem('currentUser');
if (userStr) {
    const user = JSON.parse(userStr);
    console.log(user.name); // "李四"
}

// 读取数组
const inventoryStr = localStorage.getItem('userInventory');
if (inventoryStr) {
    const inventory = JSON.parse(inventoryStr);
    console.log(inventory[0].name); // "稀有卡片"
}
```

## 🎮 在盲盒系统中的应用

### 🎯 完整的实现示例

#### 1. 用户系统（本地版）
```javascript
// 用户注册
function registerUser(username, password) {
    // 获取现有用户列表
    const usersStr = localStorage.getItem('users') || '[]';
    const users = JSON.parse(usersStr);
    
    // 检查用户名是否已存在
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
        alert('用户名已存在！');
        return false;
    }
    
    // 创建新用户
    const newUser = {
        id: Date.now(), // 简单的ID生成
        username: username,
        password: password, // 实际项目中应该加密
        coins: 1000,
        level: 1,
        createdAt: new Date().toISOString()
    };
    
    // 添加到用户列表
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // 设为当前用户
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    console.log('注册成功！');
    return true;
}

// 用户登录
function loginUser(username, password) {
    const usersStr = localStorage.getItem('users') || '[]';
    const users = JSON.parse(usersStr);
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        console.log('登录成功！');
        return user;
    } else {
        alert('用户名或密码错误！');
        return null;
    }
}

// 获取当前用户
function getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

// 更新用户信息
function updateUser(updatedUser) {
    // 更新用户列表中的信息
    const usersStr = localStorage.getItem('users') || '[]';
    const users = JSON.parse(usersStr);
    
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
        users[index] = updatedUser;
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    // 更新当前用户信息
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
}
```

#### 2. 抽盲盒功能
```javascript
// 商品数据（可以存在LocalStorage中）
const products = [
    { id: 1, name: '普通宝石', rarity: 'common', probability: 50, price: 100 },
    { id: 2, name: '稀有卡片', rarity: 'rare', probability: 30, price: 100 },
    { id: 3, name: '史诗装备', rarity: 'epic', probability: 15, price: 100 },
    { id: 4, name: '传说武器', rarity: 'legendary', probability: 4, price: 100 },
    { id: 5, name: '神话宠物', rarity: 'mythic', probability: 1, price: 100 }
];

// 初始化商品数据
function initProducts() {
    localStorage.setItem('products', JSON.stringify(products));
}

// 抽盲盒核心逻辑
function openBlindBox() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        alert('请先登录！');
        return null;
    }
    
    if (currentUser.coins < 100) {
        alert('金币不足！');
        return null;
    }
    
    // 获取商品列表
    const productsStr = localStorage.getItem('products');
    const products = JSON.parse(productsStr);
    
    // 概率计算
    const randomNum = Math.random() * 100;
    let cumulativeProbability = 0;
    let selectedProduct = null;
    
    for (const product of products) {
        cumulativeProbability += product.probability;
        if (randomNum <= cumulativeProbability) {
            selectedProduct = product;
            break;
        }
    }
    
    if (selectedProduct) {
        // 扣除金币
        currentUser.coins -= 100;
        updateUser(currentUser);
        
        // 添加到背包
        addToInventory(currentUser.id, selectedProduct);
        
        console.log(`恭喜获得：${selectedProduct.name} (${selectedProduct.rarity})`);
        return selectedProduct;
    }
    
    return null;
}

// 添加物品到背包
function addToInventory(userId, product) {
    const inventoryKey = `inventory_${userId}`;
    const inventoryStr = localStorage.getItem(inventoryKey) || '[]';
    const inventory = JSON.parse(inventoryStr);
    
    // 检查是否已有该物品
    const existingItem = inventory.find(item => item.productId === product.id);
    
    if (existingItem) {
        // 增加数量
        existingItem.quantity += 1;
    } else {
        // 添加新物品
        inventory.push({
            productId: product.id,
            name: product.name,
            rarity: product.rarity,
            quantity: 1,
            obtainedAt: new Date().toISOString()
        });
    }
    
    localStorage.setItem(inventoryKey, JSON.stringify(inventory));
}

// 获取用户背包
function getUserInventory(userId) {
    const inventoryKey = `inventory_${userId}`;
    const inventoryStr = localStorage.getItem(inventoryKey) || '[]';
    return JSON.parse(inventoryStr);
}
```

#### 3. 好友系统（模拟版）
```javascript
// 添加好友
function addFriend(currentUserId, friendUsername) {
    // 查找要添加的用户
    const usersStr = localStorage.getItem('users') || '[]';
    const users = JSON.parse(usersStr);
    const friendUser = users.find(u => u.username === friendUsername);
    
    if (!friendUser) {
        alert('用户不存在！');
        return false;
    }
    
    if (friendUser.id === currentUserId) {
        alert('不能添加自己为好友！');
        return false;
    }
    
    // 获取当前好友列表
    const friendsKey = `friends_${currentUserId}`;
    const friendsStr = localStorage.getItem(friendsKey) || '[]';
    const friends = JSON.parse(friendsStr);
    
    // 检查是否已是好友
    const isAlreadyFriend = friends.some(f => f.id === friendUser.id);
    if (isAlreadyFriend) {
        alert('已经是好友了！');
        return false;
    }
    
    // 添加好友
    friends.push({
        id: friendUser.id,
        username: friendUser.username,
        addedAt: new Date().toISOString()
    });
    
    localStorage.setItem(friendsKey, JSON.stringify(friends));
    
    console.log(`成功添加好友：${friendUsername}`);
    return true;
}

// 获取好友列表
function getFriendsList(userId) {
    const friendsKey = `friends_${userId}`;
    const friendsStr = localStorage.getItem(friendsKey) || '[]';
    return JSON.parse(friendsStr);
}

// 赠送物品给好友
function giftItemToFriend(fromUserId, toUserId, productId) {
    // 检查发送者是否有该物品
    const fromInventory = getUserInventory(fromUserId);
    const itemIndex = fromInventory.findIndex(item => item.productId === productId);
    
    if (itemIndex === -1 || fromInventory[itemIndex].quantity < 1) {
        alert('你没有该物品！');
        return false;
    }
    
    // 从发送者背包中减少
    if (fromInventory[itemIndex].quantity === 1) {
        fromInventory.splice(itemIndex, 1);
    } else {
        fromInventory[itemIndex].quantity -= 1;
    }
    
    // 保存发送者背包
    const fromInventoryKey = `inventory_${fromUserId}`;
    localStorage.setItem(fromInventoryKey, JSON.stringify(fromInventory));
    
    // 获取商品信息
    const productsStr = localStorage.getItem('products');
    const products = JSON.parse(productsStr);
    const product = products.find(p => p.id === productId);
    
    // 添加到接收者背包
    addToInventory(toUserId, product);
    
    // 记录赠送历史（可选）
    const giftHistoryKey = `gifts_${fromUserId}`;
    const giftHistoryStr = localStorage.getItem(giftHistoryKey) || '[]';
    const giftHistory = JSON.parse(giftHistoryStr);
    
    giftHistory.push({
        toUserId: toUserId,
        productId: productId,
        productName: product.name,
        giftedAt: new Date().toISOString()
    });
    
    localStorage.setItem(giftHistoryKey, JSON.stringify(giftHistory));
    
    console.log(`成功赠送 ${product.name}！`);
    return true;
}
```

#### 4. 数据管理工具
```javascript
// 导出游戏数据（备份）
function exportGameData() {
    const gameData = {
        users: localStorage.getItem('users'),
        products: localStorage.getItem('products'),
        currentUser: localStorage.getItem('currentUser')
    };
    
    // 导出所有背包数据
    const inventories = {};
    const friends = {};
    const gifts = {};
    
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('inventory_')) {
            inventories[key] = localStorage.getItem(key);
        } else if (key.startsWith('friends_')) {
            friends[key] = localStorage.getItem(key);
        } else if (key.startsWith('gifts_')) {
            gifts[key] = localStorage.getItem(key);
        }
    }
    
    gameData.inventories = inventories;
    gameData.friends = friends;
    gameData.gifts = gifts;
    
    // 下载为JSON文件
    const dataStr = JSON.stringify(gameData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'blindbox_game_backup.json';
    a.click();
    
    URL.revokeObjectURL(url);
}

// 导入游戏数据（恢复）
function importGameData(jsonData) {
    try {
        const gameData = JSON.parse(jsonData);
        
        // 恢复基础数据
        if (gameData.users) localStorage.setItem('users', gameData.users);
        if (gameData.products) localStorage.setItem('products', gameData.products);
        if (gameData.currentUser) localStorage.setItem('currentUser', gameData.currentUser);
        
        // 恢复背包数据
        if (gameData.inventories) {
            for (const [key, value] of Object.entries(gameData.inventories)) {
                localStorage.setItem(key, value);
            }
        }
        
        // 恢复好友数据
        if (gameData.friends) {
            for (const [key, value] of Object.entries(gameData.friends)) {
                localStorage.setItem(key, value);
            }
        }
        
        // 恢复赠送数据
        if (gameData.gifts) {
            for (const [key, value] of Object.entries(gameData.gifts)) {
                localStorage.setItem(key, value);
            }
        }
        
        console.log('游戏数据导入成功！');
        return true;
    } catch (error) {
        console.error('导入失败：', error);
        return false;
    }
}

// 清理游戏数据
function clearAllGameData() {
    if (confirm('确定要清除所有游戏数据吗？此操作不可恢复！')) {
        // 获取所有相关的key
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key === 'users' || key === 'products' || key === 'currentUser' ||
                key.startsWith('inventory_') || key.startsWith('friends_') || key.startsWith('gifts_')) {
                keysToRemove.push(key);
            }
        }
        
        // 删除所有相关数据
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        console.log('所有游戏数据已清除');
    }
}
```

## 🚀 LocalStorage 的优势

### ✅ 对于您的盲盒项目：
- **超级简单** - 几行代码就能保存数据
- **即学即用** - 不需要配置任何服务器
- **离线工作** - 没有网络也能玩
- **数据持久** - 关闭浏览器数据还在
- **调试方便** - 浏览器开发者工具可以直接查看

### 🎯 适合的功能：
- 用户注册登录（本地版）
- 背包物品存储
- 游戏设置保存
- 抽盲盒历史记录
- 简单的好友系统

## ⚠️ 注意事项

### 🔄 数据格式限制
```javascript
// ❌ 错误：直接保存对象
localStorage.setItem('user', { name: '张三' }); // 会变成 "[object Object]"

// ✅ 正确：转换为JSON
localStorage.setItem('user', JSON.stringify({ name: '张三' }));
```

### 🛡️ 错误处理
```javascript
// 安全的读取方式
function safeGetItem(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error('读取数据失败：', error);
        return null;
    }
}

// 安全的保存方式
function safeSetItem(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error('保存数据失败：', error);
        return false;
    }
}
```

## 💡 总结

**LocalStorage 是最好的入门选择**：

- 🎯 **学习成本低** - 4个API就够了
- 🚀 **立即见效** - 今天学今天就能用
- 💪 **功能够用** - 个人项目完全满足
- 🔄 **升级简单** - 以后可以无痛升级到数据库

**对于您的盲盒项目，LocalStorage 是完美的起点！**

---

**您想从 LocalStorage 开始实现您的盲盒系统吗？我可以帮您创建第一个HTML文件！** 📦 