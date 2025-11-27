# Pixel Monster Generator

一个像素风格的怪物生成器，支持图片和音频生成。

## 在线访问

🌐 **部署链接**：待部署后更新

## 功能特性

- 🎨 根据描述生成像素风格怪物图片
- 🔊 为怪物生成专属音效
- 📏 支持自定义像素大小（32px/64px/128px）
- 🔢 批量生成（1-4个）
- 🌓 明暗主题切换
- ❤️ 收藏功能
- 📤 分享和下载

## 技术栈

### 前端
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Lucide Icons

### 后端
- Python 3.11
- Flask 3.0
- Hugging Face AI API（带假生成器回退）

## 本地运行

### 前端
```bash
npm install
npm run dev
```

### 后端
```bash
cd backend
pip install -r requirements.txt
python server.py
```

## 部署说明

### 前端部署（Vercel）
1. 登录 [Vercel](https://vercel.com)
2. 导入 GitHub 仓库
3. 自动检测 Vite 配置并部署

### 后端部署（Render）
1. 登录 [Render](https://render.com)
2. 创建新的 Web Service
3. 连接 GitHub 仓库
4. 设置：
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn server:app`

## 环境变量

后端需要设置 Hugging Face Token（可选，用于真AI生成）：
```
HUGGINGFACE_TOKEN=your_token_here
```

## 授权

MIT License
