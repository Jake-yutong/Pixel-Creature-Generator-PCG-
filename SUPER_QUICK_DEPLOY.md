# 🚀 超简单部署指南（10分钟完成）

## 方案选择

推荐使用 **Railway** 一键部署！比Render更简单，无需配置。

---

## 📍 方法一：Railway 一键部署（最推荐）

### 后端部署

1. 访问 https://railway.app
2. 用 GitHub 登录（免费）
3. 点击 "New Project" → "Deploy from GitHub repo"
4. 如果没有GitHub，选择 "Empty Project" → "Add Service" → "GitHub Repo"
5. 或直接点击这个按钮（需要先fork项目到GitHub）：

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template)

6. Railway会自动：
   - 检测Python项目
   - 安装依赖
   - 启动服务
   
7. 等待部署完成（3分钟）
8. 点击 "Settings" → "Generate Domain" 获取公开URL
9. **复制这个URL**（如：`https://your-app.railway.app`）

### 前端部署

1. 修改 `src/services/api.ts` 第3行：
   ```typescript
   const API_BASE_URL = 'https://your-app.railway.app/api';
   ```

2. 访问 https://vercel.com
3. 用 GitHub 登录
4. 拖拽整个 `pixe_gengerat_test` 文件夹
5. Vercel自动部署（2分钟）
6. **获取链接分享给朋友！**

---

## 📍 方法二：Vercel + Render（备用）

见 `QUICK_DEPLOY.md` 详细步骤。

---

## 📍 方法三：本地运行 + Ngrok（临时分享）

如果只是短期分享，可以用 ngrok：

1. 下载 ngrok：https://ngrok.com/download
2. 后端运行：`python backend/server.py`
3. 新终端运行：`ngrok http 5000`
4. 复制 ngrok 提供的URL（如：`https://abc123.ngrok.io`）
5. 修改前端 `api.ts` 的 API_BASE_URL
6. 前端运行：`npm run dev`
7. 新终端运行：`ngrok http 3000`
8. **分享前端的 ngrok URL**

---

## ✅ 部署成功检查清单

- [ ] 后端可以访问（访问 `你的后端URL/api/hello` 应该看到JSON）
- [ ] 前端可以访问（访问你的前端URL应该看到界面）
- [ ] 前端显示 "✅ 后端已连接"
- [ ] 能成功生成图片
- [ ] 能播放音频

---

## 🎉 完成！

现在你可以把**前端链接**分享给任何人，他们可以在线使用你的像素怪物生成器！

示例：`https://pixel-monster.vercel.app`
