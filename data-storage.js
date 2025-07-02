// ===== 网页数据存储与文件处理功能 =====

// 1. 全局变量（内存存储）
let memoryData = {
    users: [],
    settings: {},
    temporaryFiles: []
};

// 模拟数据库
let mockDatabase = {
    students: []
};

// 2. 浏览器本地存储功能
function saveToLocalStorage() {
    const key = document.getElementById('localStorage-key').value.trim();
    const value = document.getElementById('localStorage-value').value.trim();
    
    if (!key || !value) {
        alert('请输入数据名称和内容！');
        return;
    }
    
    try {
        // 保存到localStorage
        localStorage.setItem(key, value);
        
        // 更新显示
        loadFromLocalStorage();
        
        // 清空输入框
        document.getElementById('localStorage-key').value = '';
        document.getElementById('localStorage-value').value = '';
        
        console.log(`数据已保存到localStorage: ${key} = ${value}`);
    } catch (error) {
        alert('保存失败：' + error.message);
    }
}

function loadFromLocalStorage() {
    const display = document.getElementById('localStorage-display');
    let content = '=== 本地存储的所有数据 ===\n\n';
    
    try {
        // 遍历所有localStorage数据
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            content += `${key}: ${value}\n`;
        }
        
        if (localStorage.length === 0) {
            content += '暂无数据\n';
        }
        
        content += `\n存储容量使用情况：`;
        content += `\n已使用: ${JSON.stringify(localStorage).length} 字符`;
        content += `\n剩余: 约 ${5000000 - JSON.stringify(localStorage).length} 字符`;
        
    } catch (error) {
        content += '读取失败：' + error.message;
    }
    
    display.textContent = content;
}

function clearLocalStorage() {
    if (confirm('确定要清空所有本地存储的数据吗？')) {
        localStorage.clear();
        loadFromLocalStorage();
        console.log('localStorage已清空');
    }
}

// 3. 内存存储功能
function saveToMemory() {
    const name = document.getElementById('user-name').value.trim();
    const age = document.getElementById('user-age').value.trim();
    const city = document.getElementById('user-city').value.trim();
    
    if (!name || !age || !city) {
        alert('请填写完整的用户信息！');
        return;
    }
    
    // 保存到内存变量
    const user = {
        id: Date.now(),
        name: name,
        age: parseInt(age),
        city: city,
        createTime: new Date().toLocaleString('zh-CN')
    };
    
    memoryData.users.push(user);
    
    // 清空输入框
    document.getElementById('user-name').value = '';
    document.getElementById('user-age').value = '';
    document.getElementById('user-city').value = '';
    
    console.log('用户数据已保存到内存:', user);
    
    // 自动显示数据
    displayMemoryData();
}

function displayMemoryData() {
    const display = document.getElementById('memory-display');
    let content = '=== 内存中的数据 ===\n\n';
    
    content += `用户列表 (${memoryData.users.length} 条记录):\n`;
    if (memoryData.users.length === 0) {
        content += '暂无用户数据\n';
    } else {
        memoryData.users.forEach((user, index) => {
            content += `${index + 1}. ${user.name} - ${user.age}岁 - ${user.city}\n`;
            content += `   创建时间: ${user.createTime}\n\n`;
        });
    }
    
    content += `内存使用情况:\n`;
    content += `用户数据: ${memoryData.users.length} 条\n`;
    content += `临时文件: ${memoryData.temporaryFiles.length} 个\n`;
    content += `对象大小: 约 ${JSON.stringify(memoryData).length} 字符`;
    
    display.textContent = content;
}

// 4. 文件上传功能
function handleFileSelect(event) {
    const files = event.target.files;
    processFiles(files);
}

function handleDragOver(event) {
    event.preventDefault();
    document.getElementById('dropZone').classList.add('dragover');
}

function handleDragLeave(event) {
    event.preventDefault();
    document.getElementById('dropZone').classList.remove('dragover');
}

function handleDrop(event) {
    event.preventDefault();
    document.getElementById('dropZone').classList.remove('dragover');
    
    const files = event.dataTransfer.files;
    processFiles(files);
}

function processFiles(files) {
    const display = document.getElementById('file-display');
    let content = '=== 选择的文件信息 ===\n\n';
    
    if (files.length === 0) {
        content += '未选择文件\n';
        display.textContent = content;
        return;
    }
    
    // 显示进度条
    const progressBar = document.getElementById('uploadProgress');
    const progressFill = document.getElementById('progressFill');
    progressBar.style.display = 'block';
    
    // 处理每个文件
    Array.from(files).forEach((file, index) => {
        content += `文件 ${index + 1}:\n`;
        content += `名称: ${file.name}\n`;
        content += `大小: ${formatFileSize(file.size)}\n`;
        content += `类型: ${file.type || '未知'}\n`;
        content += `最后修改: ${new Date(file.lastModified).toLocaleString('zh-CN')}\n`;
        
        // 判断文件类型
        if (file.type.startsWith('image/')) {
            content += `分类: 图片文件 📸\n`;
        } else if (file.type.startsWith('video/')) {
            content += `分类: 视频文件 🎥\n`;
        } else if (file.type.startsWith('audio/')) {
            content += `分类: 音频文件 🎵\n`;
        } else if (file.type.includes('pdf')) {
            content += `分类: PDF文档 📄\n`;
        } else if (file.type.includes('text') || file.name.endsWith('.txt')) {
            content += `分类: 文本文件 📝\n`;
        } else {
            content += `分类: 其他文件 ��\n`;
        }
        
        content += `状态: 已选择，等待上传\n\n`;
        
        // 保存到内存（模拟）
        memoryData.temporaryFiles.push({
            name: file.name,
            size: file.size,
            type: file.type,
            uploadTime: new Date().toLocaleString('zh-CN')
        });
    });
    
    display.textContent = content;
    
    // 模拟上传进度
    simulateUpload(files.length);
}

function simulateUpload(fileCount) {
    const progressFill = document.getElementById('progressFill');
    let progress = 0;
    
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            // 上传完成
            setTimeout(() => {
                document.getElementById('uploadProgress').style.display = 'none';
                const display = document.getElementById('file-display');
                display.textContent += `\n✅ 模拟上传完成！\n`;
                display.textContent += `上传了 ${fileCount} 个文件到服务器\n`;
                display.textContent += `实际应用中，文件会保存到服务器的文件系统中`;
            }, 500);
        }
        
        progressFill.style.width = progress + '%';
    }, 100);
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 5. 数据库存储模拟
function addStudent() {
    const name = document.getElementById('student-name').value.trim();
    const score = document.getElementById('student-score').value.trim();
    const subject = document.getElementById('student-subject').value;
    
    if (!name || !score) {
        alert('请输入学生姓名和分数！');
        return;
    }
    
    if (score < 0 || score > 100) {
        alert('分数应该在0-100之间！');
        return;
    }
    
    // 添加到模拟数据库
    const student = {
        id: mockDatabase.students.length + 1,
        name: name,
        score: parseInt(score),
        subject: subject,
        createTime: new Date().toLocaleString('zh-CN')
    };
    
    mockDatabase.students.push(student);
    
    // 清空输入框
    document.getElementById('student-name').value = '';
    document.getElementById('student-score').value = '';
    
    console.log('学生记录已添加到数据库:', student);
    
    // 自动显示数据
    queryStudents();
}

function queryStudents() {
    const display = document.getElementById('database-display');
    let content = '=== 数据库查询结果 ===\n\n';
    
    if (mockDatabase.students.length === 0) {
        content += '数据库中暂无学生记录\n';
    } else {
        content += `总记录数: ${mockDatabase.students.length}\n\n`;
        
        // 按学科分组统计
        const subjectStats = {};
        mockDatabase.students.forEach(student => {
            if (!subjectStats[student.subject]) {
                subjectStats[student.subject] = [];
            }
            subjectStats[student.subject].push(student);
        });
        
        Object.keys(subjectStats).forEach(subject => {
            const students = subjectStats[subject];
            const avgScore = students.reduce((sum, s) => sum + s.score, 0) / students.length;
            
            content += `=== ${subject} (${students.length}人) ===\n`;
            content += `平均分: ${avgScore.toFixed(1)}\n`;
            
            students.forEach(student => {
                content += `ID:${student.id} ${student.name} - ${student.score}分\n`;
            });
            content += '\n';
        });
        
        content += `数据库统计:\n`;
        content += `最高分: ${Math.max(...mockDatabase.students.map(s => s.score))}\n`;
        content += `最低分: ${Math.min(...mockDatabase.students.map(s => s.score))}\n`;
        content += `总平均分: ${(mockDatabase.students.reduce((sum, s) => sum + s.score, 0) / mockDatabase.students.length).toFixed(1)}`;
    }
    
    display.textContent = content;
}

function clearDatabase() {
    if (confirm('确定要清空所有数据库记录吗？')) {
        mockDatabase.students = [];
        queryStudents();
        console.log('数据库已清空');
    }
}

// 6. 文件下载功能
function downloadText() {
    const content = document.getElementById('download-content').value;
    const timestamp = new Date().toLocaleString('zh-CN').replace(/[\/\s:]/g, '-');
    const filename = `文本文件-${timestamp}.txt`;
    
    downloadFile(content, filename, 'text/plain');
    showDownloadStatus();
}

function downloadStudentData() {
    if (mockDatabase.students.length === 0) {
        alert('数据库中没有学生数据！');
        return;
    }
    
    // 生成CSV格式的学生数据
    let csvContent = 'ID,姓名,分数,学科,创建时间\n';
    mockDatabase.students.forEach(student => {
        csvContent += `${student.id},${student.name},${student.score},${student.subject},${student.createTime}\n`;
    });
    
    const timestamp = new Date().toLocaleString('zh-CN').replace(/[\/\s:]/g, '-');
    const filename = `学生数据-${timestamp}.csv`;
    
    downloadFile(csvContent, filename, 'text/csv');
    showDownloadStatus();
}

function generateAndDownloadImage() {
    // 创建canvas生成简单图片
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    
    // 绘制背景
    const gradient = ctx.createLinearGradient(0, 0, 400, 300);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 400, 300);
    
    // 绘制文字
    ctx.fillStyle = 'white';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('JavaScript 生成的图片', 200, 150);
    
    ctx.font = '16px Arial';
    ctx.fillText('生成时间: ' + new Date().toLocaleString('zh-CN'), 200, 180);
    
    // 绘制一些图形
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    for (let i = 0; i < 10; i++) {
        const x = Math.random() * 400;
        const y = Math.random() * 300;
        const radius = Math.random() * 30 + 10;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // 转换为blob并下载
    canvas.toBlob(function(blob) {
        const timestamp = new Date().toLocaleString('zh-CN').replace(/[\/\s:]/g, '-');
        const filename = `生成的图片-${timestamp}.png`;
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        showDownloadStatus();
    }, 'image/png');
}

function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // 释放URL对象
    URL.revokeObjectURL(url);
}

function showDownloadStatus() {
    const status = document.getElementById('download-status');
    status.style.display = 'block';
    
    setTimeout(() => {
        status.style.display = 'none';
    }, 3000);
}

// 7. 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('数据存储演示页面已加载');
    
    // 初始化显示
    loadFromLocalStorage();
    displayMemoryData();
    queryStudents();
    
    // 添加一些示例数据
    setTimeout(() => {
        // 添加示例localStorage数据
        if (localStorage.getItem('demo-setting') === null) {
            localStorage.setItem('demo-setting', '这是一个示例设置');
            localStorage.setItem('user-preference', '深色主题');
            loadFromLocalStorage();
        }
        
        // 添加示例内存数据
        if (memoryData.users.length === 0) {
            memoryData.users.push({
                id: 1,
                name: '张三',
                age: 25,
                city: '北京',
                createTime: '2024-01-15 10:30:00'
            });
            displayMemoryData();
        }
        
        // 添加示例数据库数据
        if (mockDatabase.students.length === 0) {
            mockDatabase.students.push(
                { id: 1, name: '李明', score: 95, subject: '数学', createTime: '2024-01-15 09:00:00' },
                { id: 2, name: '王华', score: 87, subject: '语文', createTime: '2024-01-15 09:15:00' },
                { id: 3, name: '刘洋', score: 92, subject: '英语', createTime: '2024-01-15 09:30:00' }
            );
            queryStudents();
        }
    }, 1000);
    
    console.log('数据存储系统初始化完成');
});

// 8. 存储容量检测
function checkStorageQuota() {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
        navigator.storage.estimate().then(estimate => {
            console.log('存储配额信息:');
            console.log('已使用:', (estimate.usage / 1024 / 1024).toFixed(2) + ' MB');
            console.log('总配额:', (estimate.quota / 1024 / 1024).toFixed(2) + ' MB');
            console.log('使用率:', ((estimate.usage / estimate.quota) * 100).toFixed(2) + '%');
        });
    }
}

// 页面卸载时保存数据
window.addEventListener('beforeunload', function() {
    // 保存当前内存数据到localStorage作为备份
    try {
        localStorage.setItem('backup-memory-data', JSON.stringify(memoryData));
        localStorage.setItem('backup-database', JSON.stringify(mockDatabase));
    } catch (error) {
        console.log('备份数据失败:', error);
    }
});

console.log('数据存储JavaScript文件已加载完成！');
