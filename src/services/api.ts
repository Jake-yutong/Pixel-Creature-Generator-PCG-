// API 服务 - 连接前端和后端

// 🔧 部署配置：从环境变量读取，或使用默认值
// 在 Netlify 上设置环境变量 VITE_API_URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('🔗 API地址:', API_BASE_URL);

// 生成怪物图片的函数
export async function generateCreature(description: string, pixelSize?: string, quantity?: number) {
  try {
    console.log('📤 发送请求到后端:', description, '像素大小:', pixelSize, '数量:', quantity);
    
    const response = await fetch(`${API_BASE_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ description, pixelSize, quantity }),
    });

    // 无论状态码是什么，都尝试解析 JSON
    const data = await response.json();
    console.log('📥 收到后端响应:', data);
    
    // 返回数据，让调用者处理 success 字段
    return data;
  } catch (error) {
    console.error('❌ 调用后端失败:', error);
    throw error;
  }
}

// 测试后端是否在线
export async function checkBackend() {
  try {
    const response = await fetch(`${API_BASE_URL}/hello`);
    const data = await response.json();
    console.log('✅ 后端连接成功:', data.message);
    return true;
  } catch (error) {
    console.error('❌ 后端连接失败:', error);
    return false;
  }
}
