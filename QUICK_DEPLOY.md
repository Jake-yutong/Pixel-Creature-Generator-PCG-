# Pixel Monster Generator - 快速部署指南

## 🚀 最简单的部署方法（无需命令行）

### 第一步：部署后端到 Render（免费）

1. 访问 https://render.com （需要注册账号，可用GitHub登录）
2. 点击 "New +" → "Web Service"
3. 选择 "Deploy from Git" → "Public Repository"
4. 输入仓库URL或选择 "Build and deploy from a Git repository"
5. 如果没有GitHub仓库，选择 "Deploy from a local directory"：
   - 将 `pixe_gengerat_test/backend` 文件夹打包成 zip
   - 上传到 Render

6. 配置设置：
   ```
   Name: pixel-monster-backend
   Region: Singapore (或最近的区域)
   Branch: main (如果用Git)
   Root Directory: backend (如果整个项目上传)
   Runtime: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: gunicorn server:app --bind 0.0.0.0:$PORT
   ```

7. 点击 "Create Web Service"
8. 等待部署完成（5-10分钟）
9. **记下部署后的URL**（类似：`https://pixel-monster-backend-xxx.onrender.com`）

### 第二步：更新前端API地址

1. 打开 `pixe_gengerat_test/src/services/api.ts`
2. 修改第3行：
   ```typescript
   // 原来：
   const API_BASE_URL = 'http://localhost:5000/api';
   
   // 改为（替换成你的Render后端地址）：
   const API_BASE_URL = 'https://你的render地址.onrender.com/api';
   ```

3. 保存文件

### 第三步：部署前端到 Vercel（免费）

1. 访问 https://vercel.com （需要注册账号，可用GitHub登录）
2. 点击 "Add New..." → "Project"
3. 选择 "Browse" 上传项目文件夹或连接GitHub

**如果没有GitHub仓库**：
   - 安装 Vercel CLI：在项目目录运行 `npm install -g vercel`
   - 运行 `vercel` 并按提示操作
   - 或直接拖拽项目文件夹到 Vercel Dashboard

**如果有GitHub仓库**：
   - 选择 `pixe_gengerat_test` 仓库
   - Vercel会自动检测到 Vite 配置
   - 点击 "Deploy"

4. 等待部署完成（3-5分钟）
5. **获取公开链接**（类似：`https://pixel-monster.vercel.app`）

### 第四步：测试

1. 访问你的 Vercel 前端链接
2. 测试生成功能
3. 如果后端连接失败，检查：
   - 后端URL是否正确更新
   - Render后端是否在运行中
   - 浏览器控制台是否有CORS错误

---

## 📦 备用方案：使用 Netlify

如果 Vercel 有问题，可以用 Netlify：

1. 访问 https://netlify.com
2. 拖拽 `pixe_gengerat_test` 文件夹到 Netlify Drop
3. 等待部署完成
4. 获取公开链接

---

## ⚠️ 注意事项

1. **免费套餐限制**：
   - Render 免费套餐在15分钟无活动后会休眠，首次访问需要等待唤醒（~30秒）
   - Vercel/Netlify 前端无休眠问题

2. **API配额**：
   - Hugging Face API有免费配额限制
   - 如果配额用完，会自动切换到假生成器（已配置双重保障）

3. **环境变量**（可选）：
   - 在 Render 后端设置：`HUGGINGFACE_TOKEN` = 你的token
   - 但已有默认token，可以直接用

---

## 🔗 部署后的链接示例

- 前端：`https://pixel-monster-generator.vercel.app`
- 后端：`https://pixel-monster-backend.onrender.com`

分享给别人时，只需要分享**前端链接**即可！

---

## 🆘 遇到问题？

1. **后端未连接**：检查 `api.ts` 中的 API_BASE_URL 是否正确
2. **CORS错误**：确认后端的 `flask-cors` 已安装并启用
3. **生成失败**：查看浏览器控制台和Render日志

需要帮助？联系开发者或查看 DEPLOYMENT.md 详细文档。
