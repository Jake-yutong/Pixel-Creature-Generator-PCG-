# 🚀 快速部署后端到 Render（5分钟）

## 步骤1：准备后端代码

后端代码已在 `backend/` 文件夹中，所有配置已就绪。

## 步骤2：部署到 Render

### 方法A：使用 GitHub（推荐）

1. **创建 GitHub 仓库**
   - 访问 https://github.com/new
   - 创建新仓库（如：`pixel-monster-backend`）
   - 选择 Public

2. **上传后端代码到 GitHub**
   ```powershell
   cd C:\Users\roder\pfad\pixe_gengerat_test\backend
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/你的用户名/pixel-monster-backend.git
   git push -u origin main
   ```

3. **在 Render 部署**
   - 访问 https://render.com
   - 用 GitHub 登录
   - 点击 "New +" → "Web Service"
   - 选择你的 GitHub 仓库
   - 配置：
     ```
     Name: pixel-monster-backend
     Region: Singapore
     Branch: main
     Runtime: Python 3
     Build Command: pip install -r requirements.txt
     Start Command: gunicorn server:app
     Instance Type: Free
     ```
   - 点击 "Create Web Service"

4. **等待部署**（5-10分钟）

5. **获取URL**
   - 部署完成后，复制 URL（如：`https://pixel-monster-backend-xxx.onrender.com`）

### 方法B：手动上传（无需 GitHub）

1. 将 `backend` 文件夹打包成 ZIP
2. 访问 https://render.com
3. New+ → Web Service → "Deploy from Git"
4. 选择手动上传 ZIP
5. 其他配置同上

---

## 步骤3：更新前端 API 地址

1. 打开 `C:\Users\roder\pfad\pixe_gengerat_test\src\services\api.ts`

2. 修改第3行：
   ```typescript
   // 原来：
   const API_BASE_URL = 'http://localhost:5000/api';
   
   // 改为（替换成你的Render URL）：
   const API_BASE_URL = 'https://pixel-monster-backend-xxx.onrender.com/api';
   ```

3. 保存文件

---

## 步骤4：重新构建前端

```powershell
cd C:\Users\roder\pfad\pixe_gengerat_test
D:\360Downloads\node.exe D:\360Downloads\node_modules\npm\bin\npm-cli.js run build
```

---

## 步骤5：重新部署到 Netlify

1. 访问你的 Netlify 项目
2. 拖拽新的 `build` 文件夹
3. 等待更新完成

或者：

1. 访问 https://app.netlify.com/drop
2. 拖拽新的 `build` 文件夹
3. 获得新链接

---

## ✅ 测试

访问你的 Netlify 链接：
- 应该看到 "✅ 后端已连接"
- 生成功能可以正常使用

---

## 🆘 遇到问题？

**后端休眠**：Render 免费套餐会在15分钟无活动后休眠，首次访问需要等待~30秒唤醒

**CORS错误**：后端已配置 `flask-cors`，应该不会有问题

**生成失败**：可能是 Hugging Face API 配额用完，会自动切换到假生成器

---

## 🎯 下一步

你的 Netlify 链接是什么？告诉我，我可以帮你检查问题！
