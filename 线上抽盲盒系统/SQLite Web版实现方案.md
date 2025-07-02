# SQLite Web版盲盒系统实现方案

## 🎯 技术栈确认

**HTML + JavaScript + sql.js（浏览器中的SQLite）**

这个方案的优势：
- ✅ **真正的SQLite数据库** - 满足老师要求
- ✅ **可视化Web界面** - 用户体验好
- ✅ **SQL语句展示** - 能看到实际的数据库操作
- ✅ **浏览器运行** - 无需安装任何软件
- ✅ **完整功能** - 包含所有盲盒系统功能

## 📁 项目文件结构

```
线上抽盲盒系统/
├── index.html              # 主页面
├── css/
│   └── style.css           # 样式文件
├── js/
│   ├── sql-wasm.js         # sql.js 核心文件
│   ├── sql-wasm.wasm       # WebAssembly 文件
│   ├── database.js         # 数据库初始化和操作
│   ├── blindbox.js         # 盲盒游戏逻辑
│   ├── user.js             # 用户系统
│   ├── friends.js          # 好友系统
│   └── app.js              # 主应用逻辑
├── data/
│   └── init-data.sql       # 初始数据SQL脚本
├── images/                 # 图片资源
└── README.md              # 项目说明
```

## 🗄️ SQLite数据库设计

### 核心表结构
```sql
-- 1. 用户表
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    email TEXT UNIQUE,
    coins INTEGER DEFAULT 1000,
    level INTEGER DEFAULT 1,
    experience INTEGER DEFAULT 0,
    avatar_url TEXT DEFAULT 'default.png',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME,
    is_active BOOLEAN DEFAULT 1
);

-- 2. 盲盒类型表
CREATE TABLE blindbox_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    image_url TEXT,
    is_available BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. 物品表
CREATE TABLE items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    rarity TEXT CHECK(rarity IN ('common', 'rare', 'epic', 'legendary', 'mythic')) NOT NULL,
    image_url TEXT,
    can_gift BOOLEAN DEFAULT 1,
    base_value INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. 盲盒内容表（盲盒类型与物品的关联）
CREATE TABLE blindbox_contents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    blindbox_type_id INTEGER,
    item_id INTEGER,
    probability REAL NOT NULL CHECK(probability >= 0 AND probability <= 100),
    FOREIGN KEY (blindbox_type_id) REFERENCES blindbox_types(id),
    FOREIGN KEY (item_id) REFERENCES items(id)
);

-- 5. 用户背包表
CREATE TABLE user_inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    item_id INTEGER,
    quantity INTEGER DEFAULT 1,
    obtained_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    source TEXT DEFAULT 'blindbox', -- 来源：blindbox, gift, purchase
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (item_id) REFERENCES items(id)
);

-- 6. 抽盒记录表
CREATE TABLE draw_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    blindbox_type_id INTEGER,
    item_id INTEGER,
    drawn_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    coins_spent INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (blindbox_type_id) REFERENCES blindbox_types(id),
    FOREIGN KEY (item_id) REFERENCES items(id)
);

-- 7. 好友关系表
CREATE TABLE friendships (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    friend_id INTEGER,
    status TEXT CHECK(status IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    accepted_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (friend_id) REFERENCES users(id),
    UNIQUE(user_id, friend_id)
);

-- 8. 礼物记录表
CREATE TABLE gifts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    from_user_id INTEGER,
    to_user_id INTEGER,
    item_id INTEGER,
    quantity INTEGER DEFAULT 1,
    message TEXT,
    status TEXT CHECK(status IN ('pending', 'accepted', 'rejected', 'expired')) DEFAULT 'pending',
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    received_at DATETIME,
    expires_at DATETIME,
    FOREIGN KEY (from_user_id) REFERENCES users(id),
    FOREIGN KEY (to_user_id) REFERENCES users(id),
    FOREIGN KEY (item_id) REFERENCES items(id)
);

-- 9. 用户统计表
CREATE TABLE user_statistics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE,
    total_boxes_opened INTEGER DEFAULT 0,
    total_coins_spent INTEGER DEFAULT 0,
    total_items_obtained INTEGER DEFAULT 0,
    total_gifts_sent INTEGER DEFAULT 0,
    total_gifts_received INTEGER DEFAULT 0,
    rarest_item_obtained TEXT,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### 索引优化
```sql
-- 创建索引提高查询性能
CREATE INDEX idx_user_inventory_user_id ON user_inventory(user_id);
CREATE INDEX idx_user_inventory_item_id ON user_inventory(item_id);
CREATE INDEX idx_draw_history_user_id ON draw_history(user_id);
CREATE INDEX idx_friendships_user_id ON friendships(user_id);
CREATE INDEX idx_friendships_friend_id ON friendships(friend_id);
CREATE INDEX idx_gifts_to_user_id ON gifts(to_user_id);
CREATE INDEX idx_gifts_from_user_id ON gifts(from_user_id);
```

## 🎮 核心功能模块

### 1. 数据库操作模块 (database.js)
- 数据库初始化
- SQL查询封装
- 数据导入导出
- 错误处理

### 2. 用户系统 (user.js)
- 用户注册/登录
- 密码加密验证
- 用户信息管理
- 统计数据更新

### 3. 盲盒系统 (blindbox.js)
- 概率计算算法
- 抽盒逻辑实现
- 背包管理
- 抽奖历史记录

### 4. 好友系统 (friends.js)
- 好友搜索添加
- 好友请求处理
- 礼物发送接收
- 好友动态展示

### 5. 界面控制 (app.js)
- 页面路由管理
- 事件处理
- 数据展示
- 用户交互

## 📊 初始测试数据

### 盲盒类型数据
```sql
INSERT INTO blindbox_types (name, description, price, image_url) VALUES
('新手礼包', '适合新手的入门盲盒，包含基础物品', 100, 'box_beginner.png'),
('经典盲盒', '经典款盲盒，平衡的物品搭配', 200, 'box_classic.png'),
('豪华盲盒', '豪华版盲盒，更高概率获得稀有物品', 500, 'box_luxury.png'),
('传说宝箱', '传说级宝箱，极小概率获得神话物品', 1000, 'box_legend.png');
```

### 物品数据
```sql
INSERT INTO items (name, description, rarity, image_url, base_value) VALUES
-- 普通物品 (60%概率)
('铁剑', '普通的铁制武器', 'common', 'iron_sword.png', 10),
('布甲', '简单的布制护甲', 'common', 'cloth_armor.png', 15),
('生命药水', '恢复少量生命值', 'common', 'health_potion.png', 20),

-- 稀有物品 (25%概率)
('银剑', '精致的银制武器', 'rare', 'silver_sword.png', 50),
('皮甲', '坚韧的皮制护甲', 'rare', 'leather_armor.png', 60),
('魔法卷轴', '蕴含魔法力量的卷轴', 'rare', 'magic_scroll.png', 80),

-- 史诗物品 (10%概率)
('黄金战斧', '闪闪发光的黄金武器', 'epic', 'gold_axe.png', 200),
('龙鳞甲', '龙鳞制成的强力护甲', 'epic', 'dragon_armor.png', 250),
('时空法杖', '操控时空的神秘法杖', 'epic', 'time_staff.png', 300),

-- 传说物品 (4%概率)
('屠龙剑', '传说中的屠龙神器', 'legendary', 'dragon_slayer.png', 800),
('凤凰羽衣', '凤凰羽毛编织的神衣', 'legendary', 'phoenix_robe.png', 1000),
('智慧之书', '记录古老智慧的魔法书', 'legendary', 'wisdom_book.png', 1200),

-- 神话物品 (1%概率)
('创世之剑', '开天辟地的终极武器', 'mythic', 'genesis_sword.png', 5000),
('永恒之心', '拥有永恒力量的神器', 'mythic', 'eternal_heart.png', 8000);
```

### 盲盒内容概率配置
```sql
-- 新手礼包内容（较高普通物品概率）
INSERT INTO blindbox_contents (blindbox_type_id, item_id, probability) VALUES
(1, 1, 30), (1, 2, 30), (1, 3, 25),  -- 普通物品85%
(1, 4, 8), (1, 5, 5), (1, 6, 2);     -- 稀有物品15%

-- 经典盲盒内容（平衡概率）
INSERT INTO blindbox_contents (blindbox_type_id, item_id, probability) VALUES
(2, 1, 20), (2, 2, 20), (2, 3, 20),  -- 普通物品60%
(2, 4, 10), (2, 5, 10), (2, 6, 5),   -- 稀有物品25%
(2, 7, 5), (2, 8, 5), (2, 9, 5);     -- 史诗物品15%

-- 豪华盲盒内容（更多稀有物品）
INSERT INTO blindbox_contents (blindbox_type_id, item_id, probability) VALUES
(3, 4, 15), (3, 5, 15), (3, 6, 15),  -- 稀有物品45%
(3, 7, 15), (3, 8, 15), (3, 9, 10),  -- 史诗物品40%
(3, 10, 5), (3, 11, 5), (3, 12, 5);  -- 传说物品15%

-- 传说宝箱内容（高概率稀有物品）
INSERT INTO blindbox_contents (blindbox_type_id, item_id, probability) VALUES
(4, 7, 10), (4, 8, 10), (4, 9, 10),  -- 史诗物品30%
(4, 10, 20), (4, 11, 20), (4, 12, 15), -- 传说物品55%
(4, 13, 8), (4, 14, 7);              -- 神话物品15%
```

## 🔧 技术实现要点

### 1. sql.js 集成
```html
<!-- 在HTML中引入sql.js -->
<script src="js/sql-wasm.js"></script>
```

```javascript
// 初始化数据库
const initSqlJs = window.initSqlJs;

async function initDatabase() {
    const SQL = await initSqlJs({
        locateFile: file => `js/${file}`
    });
    
    // 创建新数据库或加载现有数据库
    const db = new SQL.Database();
    
    // 执行表创建语句
    const createTables = `/* 所有CREATE TABLE语句 */`;
    db.run(createTables);
    
    return db;
}
```

### 2. 概率抽取算法
```javascript
function drawItemFromBlindbox(db, blindboxTypeId) {
    // 获取盲盒内容和概率
    const stmt = db.prepare(`
        SELECT bc.item_id, bc.probability, i.name, i.rarity
        FROM blindbox_contents bc
        JOIN items i ON bc.item_id = i.id
        WHERE bc.blindbox_type_id = ?
        ORDER BY bc.probability DESC
    `);
    
    const contents = stmt.all([blindboxTypeId]);
    
    // 概率抽取
    const random = Math.random() * 100;
    let cumulative = 0;
    
    for (const content of contents) {
        cumulative += content.probability;
        if (random <= cumulative) {
            return content;
        }
    }
    
    // 兜底返回第一个物品
    return contents[0];
}
```

### 3. 复杂SQL查询示例
```javascript
// 用户统计查询
function getUserStatistics(db, userId) {
    const query = `
        SELECT 
            u.username,
            u.coins,
            u.level,
            us.total_boxes_opened,
            us.total_coins_spent,
            us.total_items_obtained,
            us.rarest_item_obtained,
            (
                SELECT COUNT(*) 
                FROM user_inventory ui 
                JOIN items i ON ui.item_id = i.id 
                WHERE ui.user_id = ? AND i.rarity = 'mythic'
            ) as mythic_items_count,
            (
                SELECT COUNT(*) 
                FROM friendships f 
                WHERE (f.user_id = ? OR f.friend_id = ?) 
                AND f.status = 'accepted'
            ) as friends_count
        FROM users u
        LEFT JOIN user_statistics us ON u.id = us.user_id
        WHERE u.id = ?
    `;
    
    const stmt = db.prepare(query);
    return stmt.get([userId, userId, userId, userId]);
}
```

## 🎯 项目开发计划

### 阶段一：数据库基础 (第1-2天)
1. 搭建项目结构
2. 集成sql.js
3. 创建数据库表结构
4. 插入初始测试数据

### 阶段二：核心功能 (第3-5天)
1. 用户注册登录系统
2. 盲盒抽取逻辑
3. 背包系统
4. 基础界面

### 阶段三：高级功能 (第6-7天)
1. 好友系统
2. 礼物赠送功能
3. 统计分析
4. 界面美化

### 阶段四：完善优化 (第8天)
1. 错误处理
2. 性能优化
3. 数据导入导出
4. 文档整理

## ✅ 项目亮点

这个实现方案的优势：
- 🗄️ **真正的SQLite数据库操作**
- 🎯 **复杂的SQL查询展示**
- 🎮 **完整的游戏功能**
- 🎨 **现代化Web界面**
- 📊 **数据分析和统计**
- 🔄 **数据导入导出功能**

**这样既满足了老师对SQLite的要求，又能展示完整的Web开发技能！**

---

**您觉得这个方案怎么样？我们可以开始从数据库设计开始实现！** 🚀 