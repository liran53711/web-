// ===== 简单的文件上传下载服务器 =====
// 这是一个Node.js后端服务器示例，展示真实的文件处理

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// 创建上传目录
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
    console.log('创建uploads目录');
}

// 模拟数据库（实际项目中应该使用真实数据库）
let fileDatabase = [];

// 获取文件的MIME类型
function getMimeType(filename) {
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif',
        '.mp4': 'video/mp4',
        '.pdf': 'application/pdf',
        '.txt': 'text/plain'
    };
    return mimeTypes[ext] || 'application/octet-stream';
}

// 解析multipart/form-data请求（文件上传）
function parseMultipartData(req, callback) {
    let data = '';
    let files = [];
    
    req.on('data', chunk => {
        data += chunk;
    });
    
    req.on('end', () => {
        // 简化的multipart解析（实际项目建议使用multer等库）
        const boundary = req.headers['content-type'].split('boundary=')[1];
        if (!boundary) {
            callback(null, []);
            return;
        }
        
        const parts = data.split('--' + boundary);
        
        parts.forEach(part => {
            if (part.includes('filename=')) {
                const lines = part.split('\r\n');
                let filename = '';
                let fileContent = '';
                let startContent = false;
                
                lines.forEach(line => {
                    if (line.includes('filename=')) {
                        const match = line.match(/filename="([^"]+)"/);
                        if (match) filename = match[1];
                    } else if (startContent && line !== '--') {
                        fileContent += line + '\r\n';
                    } else if (line === '') {
                        startContent = true;
                    }
                });
                
                if (filename && fileContent) {
                    files.push({
                        filename: filename,
                        content: fileContent.trim()
                    });
                }
            }
        });
        
        callback(null, files);
    });
}

// 创建HTTP服务器
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method;
    
    console.log(`${method} ${pathname}`);
    
    // 设置CORS头（允许跨域）
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // 处理OPTIONS请求（预检请求）
    if (method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // API路由处理
    if (pathname === '/api/upload' && method === 'POST') {
        // 文件上传处理
        console.log('处理文件上传请求...');
        
        parseMultipartData(req, (err, files) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: '上传失败' }));
                return;
            }
            
            const uploadedFiles = [];
            
            files.forEach(file => {
                const timestamp = Date.now();
                const safeFilename = `${timestamp}_${file.filename}`;
                const filePath = path.join(uploadDir, safeFilename);
                
                try {
                    // 保存文件到服务器
                    fs.writeFileSync(filePath, file.content, 'binary');
                    
                    // 保存文件信息到"数据库"
                    const fileInfo = {
                        id: fileDatabase.length + 1,
                        originalName: file.filename,
                        filename: safeFilename,
                        path: filePath,
                        size: Buffer.byteLength(file.content, 'binary'),
                        uploadTime: new Date().toISOString(),
                        downloadUrl: `/api/download/${fileDatabase.length + 1}`
                    };
                    
                    fileDatabase.push(fileInfo);
                    uploadedFiles.push(fileInfo);
                    
                    console.log(`文件已保存: ${safeFilename}`);
                } catch (error) {
                    console.error('保存文件失败:', error);
                }
            });
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: true,
                message: '上传成功',
                files: uploadedFiles
            }));
        });
        
    } else if (pathname.startsWith('/api/download/') && method === 'GET') {
        // 文件下载处理
        const fileId = parseInt(pathname.split('/')[3]);
        const fileInfo = fileDatabase.find(f => f.id === fileId);
        
        if (!fileInfo) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: '文件不存在' }));
            return;
        }
        
        try {
            const fileContent = fs.readFileSync(fileInfo.path);
            const mimeType = getMimeType(fileInfo.originalName);
            
            res.writeHead(200, {
                'Content-Type': mimeType,
                'Content-Disposition': `attachment; filename="${fileInfo.originalName}"`,
                'Content-Length': fileContent.length
            });
            
            res.end(fileContent);
            console.log(`文件已下载: ${fileInfo.originalName}`);
            
        } catch (error) {
            console.error('读取文件失败:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: '文件读取失败' }));
        }
        
    } else if (pathname === '/api/files' && method === 'GET') {
        // 获取文件列表
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: true,
            files: fileDatabase
        }));
        
    } else if (pathname === '/' || pathname === '/index.html') {
        // 提供一个简单的上传测试页面
        const htmlContent = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>文件上传测试</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .upload-area { border: 2px dashed #ccc; padding: 20px; text-align: center; margin: 20px 0; }
        button { background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; }
        .file-list { background: #f8f9fa; padding: 15px; border-radius: 4px; margin: 10px 0; }
    </style>
</head>
<body>
    <h1>🚀 文件上传下载测试服务器</h1>
    
    <div class="upload-area">
        <h3>选择文件上传</h3>
        <input type="file" id="fileInput" multiple>
        <br><br>
        <button onclick="uploadFiles()">上传文件</button>
    </div>
    
    <div class="file-list">
        <h3>已上传的文件</h3>
        <div id="fileList">加载中...</div>
        <button onclick="loadFiles()">刷新列表</button>
    </div>
    
    <script>
        function uploadFiles() {
            const fileInput = document.getElementById('fileInput');
            const files = fileInput.files;
            
            if (files.length === 0) {
                alert('请选择文件');
                return;
            }
            
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
                formData.append('files[]', files[i]);
            }
            
            fetch('/api/upload', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                alert('上传成功！');
                loadFiles();
                fileInput.value = '';
            })
            .catch(error => {
                alert('上传失败：' + error);
            });
        }
        
        function loadFiles() {
            fetch('/api/files')
                .then(response => response.json())
                .then(data => {
                    const fileList = document.getElementById('fileList');
                    if (data.files.length === 0) {
                        fileList.innerHTML = '暂无文件';
                        return;
                    }
                    
                    let html = '';
                    data.files.forEach(file => {
                        html += \`
                            <div style="border-bottom: 1px solid #ddd; padding: 10px 0;">
                                <strong>\${file.originalName}</strong> 
                                (大小: \${(file.size / 1024).toFixed(2)} KB)
                                <br>
                                上传时间: \${new Date(file.uploadTime).toLocaleString()}
                                <br>
                                <a href="\${file.downloadUrl}" download>下载文件</a>
                            </div>
                        \`;
                    });
                    fileList.innerHTML = html;
                })
                .catch(error => {
                    console.error('加载文件列表失败:', error);
                });
        }
        
        // 页面加载时获取文件列表
        loadFiles();
    </script>
</body>
</html>
        `;
        
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(htmlContent);
        
    } else {
        // 404 处理
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: '页面不存在' }));
    }
});

// 启动服务器
const PORT = 3000;
server.listen(PORT, () => {
    console.log('🚀 文件上传下载服务器已启动！');
    console.log(`📱 访问地址: http://localhost:${PORT}`);
    console.log(`📁 上传目录: ${path.resolve(uploadDir)}`);
    console.log(`⏰ 启动时间: ${new Date().toLocaleString('zh-CN')}`);
    console.log('\n可用的API接口:');
    console.log('  POST /api/upload - 上传文件');
    console.log('  GET  /api/download/:id - 下载文件');
    console.log('  GET  /api/files - 获取文件列表');
    console.log('\n按 Ctrl+C 停止服务器');
});

// 优雅关闭
process.on('SIGINT', () => {
    console.log('\n正在关闭服务器...');
    server.close(() => {
        console.log('服务器已关闭');
        process.exit(0);
    });
});
