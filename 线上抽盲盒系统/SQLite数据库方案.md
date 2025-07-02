# SQLite 数据库方案

## 🗄️ SQLite 是什么？

SQLite 是一个**轻量级的关系型数据库**，特别适合本地开发和小型应用。

### 🎯 核心特点
- **无需安装服务器** - 就是一个文件
- **零配置** - 开箱即用
- **跨平台** - Windows/Mac/Linux都支持
- **SQL标准** - 使用标准SQL语法
- **体积小** - 整个数据库就是一个文件

### 💡 简单理解
想象成一个**智能的Excel文件**：
- 可以存储多张表
- 可以建立表之间的关系
- 可以用SQL语句查询数据
- 但比Excel更强大、更安全

## 🔍 SQLite vs 其他方案对比

| 方案 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| **LocalStorage** | 超简单 | 容量小，数据简单 | 学习阶段 |
| **SQLite** | 本地数据库，支持复杂查询 | 无法多人共享 | 本地开发 |
| **Firebase** | 云端，实时同步 | 需要网络，学习成本 | 线上应用 |
| **MySQL** | 功能强大 | 需要服务器，配置复杂 | 大型项目 |

## 🎮 在盲盒项目中的应用

### 📊 数据库设计
```sql
-- 用户表
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    coins INTEGER DEFAULT 1000,
    level INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 商品表
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    rarity TEXT CHECK(rarity IN ('common', 'rare', 'epic', 'legendary', 'mythic')),
    probability REAL,
    image_url TEXT,
    can_gift BOOLEAN DEFAULT 1
);

-- 用户背包表
CREATE TABLE user_inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    product_id INTEGER,
    quantity INTEGER DEFAULT 1,
    obtained_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- 好友关系表
CREATE TABLE friendships (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    friend_id INTEGER,
    status TEXT DEFAULT 'accepted',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (friend_id) REFERENCES users(id)
);

-- 赠予记录表
CREATE TABLE gifts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    from_user_id INTEGER,
    to_user_id INTEGER,
    product_id INTEGER,
    quantity INTEGER DEFAULT 1,
    message TEXT,
    status TEXT DEFAULT 'pending',
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (from_user_id) REFERENCES users(id),
    FOREIGN KEY (to_user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);
```

### 💻 JavaScript 中使用 SQLite

#### 1. 在浏览器中使用（sql.js）
```html
<!-- 引入 sql.js -->
<script src="https://sql.js.org/dist/sql-wasm.js"></script>
```

```javascript
// 初始化数据库
let db;

async function initDatabase() {
    const sqlPromise = initSqlJs({
        locateFile: file => `https://sql.js.org/dist/${file}`
    });
    
    const SQL = await sqlPromise;
    db = new SQL.Database();
    
    // 创建表
    db.run(`
        CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            coins INTEGER DEFAULT 1000,
            level INTEGER DEFAULT 1
        );
    `);
    
    console.log('数据库初始化完成');
}

// 用户注册
function registerUser(username, password) {
    try {
        const stmt = db.prepare(`
            INSERT INTO users (username, password_hash, coins) 
            VALUES (?, ?, ?)
        `);
        
        const result = stmt.run([username, hashPassword(password), 1000]);
        
        console.log('用户注册成功，ID：', result.lastInsertRowid);
        return result.lastInsertRowid;
    } catch (error) {
        console.error('注册失败：', error.message);
        return null;
    }
}

// 用户登录
function loginUser(username, password) {
    const stmt = db.prepare(`
        SELECT id, username, coins, level 
        FROM users 
        WHERE username = ? AND password_hash = ?
    `);
    
    const result = stmt.get([username, hashPassword(password)]);
    
    if (result) {
        console.log('登录成功：', result);
        return result;
    } else {
        console.log('用户名或密码错误');
        return null;
    }
}

// 保存抽盲盒结果
function saveBlindBoxResult(userId, productId, quantity = 1) {
    try {
        // 添加到背包
        const stmt = db.prepare(`
            INSERT INTO user_inventory (user_id, product_id, quantity) 
            VALUES (?, ?, ?)
        `);
        stmt.run([userId, productId, quantity]);
        
        // 扣除金币
        const updateCoins = db.prepare(`
            UPDATE users 
            SET coins = coins - 100 
            WHERE id = ?
        `);
        updateCoins.run([userId]);
        
        console.log('抽盲盒结果已保存');
    } catch (error) {
        console.error('保存失败：', error.message);
    }
}

// 获取用户背包
function getUserInventory(userId) {
    const stmt = db.prepare(`
        SELECT 
            ui.quantity,
            p.name,
            p.rarity,
            p.image_url,
            ui.obtained_at
        FROM user_inventory ui
        JOIN products p ON ui.product_id = p.id
        WHERE ui.user_id = ?
        ORDER BY ui.obtained_at DESC
    `);
    
    const inventory = stmt.all([userId]);
    return inventory;
}

// 发送礼物
function sendGift(fromUserId, toUserId, productId, message) {
    try {
        // 检查是否有该物品
        const checkItem = db.prepare(`
            SELECT quantity FROM user_inventory 
            WHERE user_id = ? AND product_id = ?
        `);
        const item = checkItem.get([fromUserId, productId]);
        
        if (!item || item.quantity < 1) {
            throw new Error('没有该物品可以赠送');
        }
        
        // 开始事务
        db.run('BEGIN TRANSACTION');
        
        // 从发送者背包中减少
        const removeItem = db.prepare(`
            UPDATE user_inventory 
            SET quantity = quantity - 1 
            WHERE user_id = ? AND product_id = ?
        `);
        removeItem.run([fromUserId, productId]);
        
        // 记录赠予
        const recordGift = db.prepare(`
            INSERT INTO gifts (from_user_id, to_user_id, product_id, message, status) 
            VALUES (?, ?, ?, ?, 'pending')
        `);
        recordGift.run([fromUserId, toUserId, productId, message]);
        
        // 提交事务
        db.run('COMMIT');
        
        console.log('礼物发送成功');
    } catch (error) {
        db.run('ROLLBACK');
        console.error('发送礼物失败：', error.message);
    }
}

// 接收礼物
function receiveGift(giftId, userId) {
    try {
        // 获取礼物信息
        const getGift = db.prepare(`
            SELECT * FROM gifts 
            WHERE id = ? AND to_user_id = ? AND status = 'pending'
        `);
        const gift = getGift.get([giftId, userId]);
        
        if (!gift) {
            throw new Error('礼物不存在或已接收');
        }
        
        db.run('BEGIN TRANSACTION');
        
        // 添加到接收者背包
        const addToInventory = db.prepare(`
            INSERT INTO user_inventory (user_id, product_id, quantity) 
            VALUES (?, ?, ?)
            ON CONFLICT(user_id, product_id) 
            DO UPDATE SET quantity = quantity + ?
        `);
        addToInventory.run([userId, gift.product_id, gift.quantity, gift.quantity]);
        
        // 更新礼物状态
        const updateGift = db.prepare(`
            UPDATE gifts 
            SET status = 'received', received_at = CURRENT_TIMESTAMP 
            WHERE id = ?
        `);
        updateGift.run([giftId]);
        
        db.run('COMMIT');
        
        console.log('礼物接收成功');
    } catch (error) {
        db.run('ROLLBACK');
        console.error('接收礼物失败：', error.message);
    }
}

// 保存数据库到本地文件
function saveDatabase() {
    const data = db.export();
    const blob = new Blob([data], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'blindbox_game.db';
    a.click();
    
    URL.revokeObjectURL(url);
}

// 从本地文件加载数据库
function loadDatabase(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const arrayBuffer = e.target.result;
        const uInt8Array = new Uint8Array(arrayBuffer);
        db = new SQL.Database(uInt8Array);
        console.log('数据库加载成功');
    };
    reader.readAsArrayBuffer(file);
}
```

## 🚀 SQLite 的优势

### 对于您的盲盒项目：
✅ **比 LocalStorage 强大** - 支持复杂查询和关系  
✅ **比 Firebase 简单** - 无需网络，无需学习云服务  
✅ **真正的数据库** - 支持事务、外键约束  
✅ **数据安全** - 可以备份和恢复  
✅ **查询灵活** - 可以写复杂的SQL语句  

### 实际应用场景：
- **统计功能**：查看最稀有的物品、用户排行榜
- **关系查询**：查找好友的背包、赠予历史
- **数据分析**：分析抽盲盒的概率是否正确
- **备份恢复**：可以导出/导入整个游戏数据

## 🎯 建议的使用时机

### 方案演进路线：
1. **LocalStorage** → 学习基础功能
2. **SQLite** → 本地复杂数据管理
3. **Firebase** → 真正的线上多人功能

### SQLite 最适合：
- 🎮 **单机版盲盒游戏**
- 📊 **需要复杂数据查询**
- 🔄 **需要数据备份功能**
- 👥 **本地多用户切换**

## 💡 总结

SQLite 是从简单的 LocalStorage 到复杂的云数据库之间的**完美桥梁**：

- 比 LocalStorage **更强大**
- 比 Firebase **更简单**
- 比 MySQL **更轻量**

**对于学习数据库操作来说，SQLite 是绝佳选择！**

---

您想在盲盒项目中尝试 SQLite 吗？我可以帮您从 LocalStorage 版本升级到 SQLite 版本！🗄️ 