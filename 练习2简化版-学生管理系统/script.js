// @ts-nocheck
// ===== 学生管理系统 - ES6练习 =====

// 全局变量
let students = [];
let nextId = 1;

// ===== 需要您实现的函数 =====

// 1. 添加学生 (使用箭头函数)
const addStudent = () => {
    const name = document.getElementById('student-name').value.trim();
    const age = document.getElementById('student-age').value;
    const major = document.getElementById('student-major').value.trim();

    // 输入验证
    if (!name || !age || !major) {
        alert('请填写完整的学生信息！');
        return;
    }

    if (parseInt(age) < 16 || parseInt(age) > 30) {
        alert('年龄应在16-30岁之间！');
        return;
    }

    // 创建学生对象
    const student = {
        id: nextId++,
        name: name,
        age: parseInt(age),
        major: major,
        createdTime: new Date().toLocaleDateString()
    };

    students.push(student);
    console.log('➕ 新学生已添加:', student);

    // 更新界面和保存数据
    renderStudents();
    updateStats();
    saveData();

    // 清空输入框
    document.getElementById('student-name').value = '';
    document.getElementById('student-age').value = '';
    document.getElementById('student-major').value = '';

    alert(`学生 ${name} 添加成功！`);
};

// 2. 删除学生 (使用filter方法)
function deleteStudent(id) {
    const beforeLength = students.length;
    students = students.filter(student => student.id !== id);
    
    if (students.length < beforeLength) {
        console.log('🗑️ 学生已删除，ID:', id);
        console.log('📊 删除后学生数量:', students.length);
        
        renderStudents();
        updateStats();
        saveData(); // 自动保存数据
        
        alert('学生信息已删除！');
    } else {
        console.log('❌ 未找到要删除的学生，ID:', id);
    }
}

// 3. 渲染学生列表 (使用map和模板字符串)
function renderStudents() {
    const container = document.getElementById('student-container');
    
    if (students.length === 0) {
        container.innerHTML = '<div class="empty-state">暂无学生</div>';
        return;
    }
    
    const html = students.map(student => `
        <div class="student-item">
            <div class="student-info">
                <div class="student-name">${student.name}</div>
                <div class="student-details">年龄: ${student.age} | 专业: ${student.major} | 添加时间: ${student.createdTime}</div>
            </div>
            <button class="delete-btn" onclick="deleteStudent(${student.id})">删除</button>
        </div>
    `).join('');
    
    container.innerHTML = html;
}

// 4. 计算统计信息 (使用reduce)
const updateStats = () => {
    const total = students.length;

    // 使用reduce计算总年龄
    const totalAge = students.reduce((sum, student) => {
        return sum + student.age;
    }, 0);
    
    // 计算平均年龄
    const avgAge = total === 0 ? 0 : totalAge / total;

    // 使用reduce统计专业数量
    const majors = students.reduce((majorList, student) => {
        if (!majorList.includes(student.major)) {
            majorList.push(student.major);
        }
        return majorList;
    }, []);

    // 更新界面显示
    document.getElementById('total-students').textContent = total;
    document.getElementById('avg-age').textContent = avgAge.toFixed(1);
    document.getElementById('total-subjects').textContent = majors.length;

    console.log('📊 统计信息更新: 总数=' + total + ', 平均年龄=' + avgAge.toFixed(1) + ', 专业数=' + majors.length);
}

// 5. 保存到localStorage (JSON)
const saveData = () => {
    const jsonString = JSON.stringify(students);
    
    // 显示JSON内容的变化
    console.log('📄 当前localStorage中的旧数据:');
    console.log(localStorage.getItem('students-data'));
    
    localStorage.setItem('students-data', jsonString);
    
    console.log('✅ 数据已保存到localStorage');
    console.log('📄 新保存的JSON数据:');
    console.log(jsonString);
    console.log('👥 保存的学生数量:', students.length);
    console.log('🔄 JSON内容确实动态改变了！');
}

// 6. 加载数据
const loadData = () => {
    console.log('🔄 开始从localStorage加载数据...');
    const jsonStorage = localStorage.getItem('students-data');
    
    if (jsonStorage) {
        students = JSON.parse(jsonStorage);
        
        // 更新nextId，确保新添加的学生ID不重复
        if (students.length > 0) {
            const maxId = Math.max(...students.map(student => student.id));
            nextId = maxId + 1;
        }
        
        console.log('✅ 从localStorage成功加载数据');
        console.log('加载的学生数量:', students.length);
        console.log('加载的数据:', students);
        console.log('下一个ID将是:', nextId);
    } else {
        console.log('❌ localStorage中没有找到数据，使用空数组');
        students = [];
    }
}

// 7. 清空所有数据
const clearAllData = () => {
    if (students.length === 0) {
        alert('当前没有学生数据！');
        return;
    }

    const confirmed = confirm(`确定要清空所有 ${students.length} 个学生的数据吗？\n此操作不可恢复！`);
    
    if (confirmed) {
        students = [];
        nextId = 1;
        
        localStorage.removeItem('students-data');
        
        renderStudents();
        updateStats();
        
        console.log('🗑️ 所有学生数据已清空');
        alert('所有学生数据已清空！');
    }
}

// 页面初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌟 页面加载完成，开始初始化...');
    loadData();
    renderStudents();
    updateStats();
    console.log('✅ 初始化完成');
})
