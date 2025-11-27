# ⚡ 紧急修复：后端连接问题

## 🎯 问题

你的前端在 Netlify 上，但后端还在本地（localhost），所以无法连接。

## ✅ 解决方案（3个选择）

### 选择1：快速部署后端到 Render（10分钟，永久解决）

**步骤：**

1. **访问 https://render.com 并登录**（用 GitHub 账号）

2. **点击右上角 "New +" → "Web Service"**

3. **选择 "Public Git repository"**
   - 如果你还没有 GitHub 仓库，看下方"创建 GitHub 仓库"

4. **填写配置：**
   ```
   Name: pixel-monster-backend
   Region: Singapore (或最近的)
   Branch: main
   Root Directory: backend
   Runtime: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: gunicorn server:app
   Instance Type: Free
   ```

5. **点击 "Create Web Service"** 并等待5-10分钟

6. **复制部署完成后的 URL**（如：`https://pixel-monster-backend-abc123.onrender.com`）

7. **在 Netlify 设置环境变量：**
   - 进入你的 Netlify 项目
   - Site settings → Environment variables
   - 添加：`VITE_API_URL` = `https://你的render地址.onrender.com/api`
   - 点击 "Trigger deploy" 重新部署

8. **完成！** 🎉

---

### 选择2：使用 Railway（更简单，5分钟）

1. 访问 https://railway.app
2. 用 GitHub 登录
3. New Project → Deploy from GitHub repo
4. 选择仓库（需要先上传到 GitHub）
5. Root Directory: `backend`
6. 自动部署完成后，点击 "Generate Domain"
7. 复制 URL 并在 Netlify 设置环境变量（同上）

---

### 选择3：临时使用 ngrok（仅用于测试，不推荐）

1. 下载 ngrok: https://ngrok.com/download
2. 解压并运行你的本地后端：
   ```powershell
   cd C:\Users\roder\pfad\pixe_gengerat_test\backend
   python server.py
   ```
3. 新开一个终端，运行：
   ```powershell
   ngrok http 5000
   ```
4. 复制 ngrok 提供的 HTTPS URL（如：`https://abc123.ngrok.io`）
5. 在 Netlify 设置环境变量：`VITE_API_URL` = `https://abc123.ngrok.io/api`
6. 重新部署 Netlify

⚠️ **注意**：ngrok 链接在关闭终端后会失效，仅用于临时测试！

---

## 📝 如何创建 GitHub 仓库（如果还没有）

```powershell
# 进入后端目录
cd C:\Users\roder\pfad\pixe_gengerat_test\backend

# 初始化 git
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: Pixel Monster Backend"

# 创建 main 分支
git branch -M main

# 添加远程仓库（在 GitHub 创建后）
git remote add origin https://github.com/你的用户名/pixel-monster-backend.git

# 推送
git push -u origin main
```

---

## 🆘 需要帮助？

告诉我：
1. 你的 Netlify 链接是什么？
2. 你想用哪个方案？

我可以继续帮你！
