// 纯前端假生成器 - 参考48个像素怪物优化版

// 简单的哈希函数
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// 根据关键词选择颜色方案(参考素材)
function getColorPalette(description: string, seed: number): any {
  const desc = description.toLowerCase();
  const rand = (offset: number) => (seed + offset) % 100;
  
  // 根据描述选择基础色系
  let palette: any;
  
  if (desc.includes('fire') || desc.includes('red') || desc.includes('火') || desc.includes('红')) {
    // 红色蘑菇系 - 暖色调
    palette = {
      main: `hsl(${rand(0) % 30}, 80%, 55%)`,
      dark: `hsl(${rand(0) % 30}, 70%, 35%)`,
      light: `hsl(${rand(0) % 30}, 85%, 75%)`,
      accent: `hsl(30, 75%, 65%)`,
      outline: '#2a1810'
    };
  } else if (desc.includes('green') || desc.includes('slime') || desc.includes('绿') || desc.includes('史莱姆')) {
    // 绿色史莱姆系 - 清新色调
    palette = {
      main: `hsl(${120 + rand(0) % 60}, 65%, 50%)`,
      dark: `hsl(${120 + rand(0) % 60}, 70%, 30%)`,
      light: `hsl(${120 + rand(0) % 60}, 75%, 70%)`,
      accent: `hsl(${160 + rand(0) % 30}, 60%, 55%)`,
      outline: '#1a3a1a'
    };
  } else if (desc.includes('blue') || desc.includes('ice') || desc.includes('蓝') || desc.includes('冰')) {
    // 蓝色冰霜系 - 冷色调
    palette = {
      main: `hsl(${180 + rand(0) % 60}, 70%, 55%)`,
      dark: `hsl(${180 + rand(0) % 60}, 75%, 35%)`,
      light: `hsl(${180 + rand(0) % 60}, 80%, 75%)`,
      accent: `hsl(${200 + rand(0) % 40}, 65%, 60%)`,
      outline: '#0a2a3a'
    };
  } else if (desc.includes('purple') || desc.includes('dark') || desc.includes('紫') || desc.includes('暗')) {
    // 紫色黑暗系 - 神秘色调
    palette = {
      main: `hsl(${270 + rand(0) % 60}, 60%, 45%)`,
      dark: `hsl(${270 + rand(0) % 60}, 65%, 25%)`,
      light: `hsl(${270 + rand(0) % 60}, 70%, 65%)`,
      accent: `hsl(${300 + rand(0) % 40}, 55%, 50%)`,
      outline: '#1a0a2a'
    };
  } else {
    // 随机混合色系
    const baseHue = rand(0) % 360;
    palette = {
      main: `hsl(${baseHue}, 70%, 50%)`,
      dark: `hsl(${baseHue}, 75%, 30%)`,
      light: `hsl(${baseHue}, 80%, 70%)`,
      accent: `hsl(${(baseHue + 40) % 360}, 65%, 55%)`,
      outline: '#1a1a1a'
    };
  }
  
  // 添加固定的白色和黑色用于眼睛
  palette.white = '#ffffff';
  palette.black = '#000000';
  palette.eyeHighlight = '#ffffff';
  
  return palette;
}

// 史莱姆型身体
function drawSlimeBody(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, palette: any, seed: number) {
  // 外轮廓阴影
  ctx.fillStyle = palette.outline;
  ctx.beginPath();
  ctx.ellipse(x, y + radius * 0.15, radius * 1.1, radius * 0.95, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // 主体
  ctx.fillStyle = palette.main;
  ctx.beginPath();
  ctx.ellipse(x, y, radius * 1.05, radius * 0.9, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // 底部阴影
  ctx.fillStyle = palette.dark;
  ctx.beginPath();
  ctx.ellipse(x, y + radius * 0.5, radius * 0.95, radius * 0.4, 0, 0, Math.PI);
  ctx.fill();
  
  // 高光
  ctx.fillStyle = palette.light;
  ctx.beginPath();
  ctx.arc(x - radius * 0.3, y - radius * 0.3, radius * 0.35, 0, Math.PI * 2);
  ctx.fill();
}

// 腿状身体(蘑菇/蜘蛛)
function drawLeggedBody(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, palette: any, seed: number) {
  const rand = (offset: number) => (seed + offset) % 100;
  
  // 绘制腿/根须
  ctx.strokeStyle = palette.dark;
  ctx.lineWidth = radius * 0.2;
  ctx.lineCap = 'round';
  const numLegs = 4 + rand(20) % 3; // 4-6条腿
  for (let i = 0; i < numLegs; i++) {
    const angle = (i / numLegs) * Math.PI + Math.PI * 0.5;
    const legLength = radius * (1.2 + (rand(i) % 30) / 100);
    ctx.beginPath();
    ctx.moveTo(x, y + radius * 0.8);
    ctx.lineTo(
      x + Math.cos(angle) * legLength,
      y + radius * 0.8 + Math.sin(angle) * legLength
    );
    ctx.stroke();
  }
  
  // 外轮廓
  ctx.fillStyle = palette.outline;
  ctx.beginPath();
  ctx.arc(x, y + radius * 0.1, radius * 1.15, 0, Math.PI * 2);
  ctx.fill();
  
  // 主体(圆形头部)
  ctx.fillStyle = palette.main;
  ctx.beginPath();
  ctx.arc(x, y, radius * 1.1, 0, Math.PI * 2);
  ctx.fill();
  
  // 阴影
  ctx.fillStyle = palette.dark;
  ctx.beginPath();
  ctx.arc(x, y + radius * 0.4, radius * 0.85, 0, Math.PI);
  ctx.fill();
  
  // 高光/斑点
  ctx.fillStyle = palette.light;
  const numSpots = 2 + rand(30) % 3;
  for (let i = 0; i < numSpots; i++) {
    const angle = (i / numSpots) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(
      x + Math.cos(angle) * radius * 0.5,
      y + Math.sin(angle) * radius * 0.5,
      radius * 0.2,
      0, Math.PI * 2
    );
    ctx.fill();
  }
}

// 漂浮型身体(幽灵/水母)
function drawFloatingBody(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, palette: any, seed: number) {
  const rand = (offset: number) => (seed + offset) % 100;
  
  // 底部触须
  ctx.fillStyle = palette.dark;
  const numTentacles = 3 + rand(15) % 3;
  for (let i = 0; i < numTentacles; i++) {
    const tx = x - radius * 0.6 + (i / (numTentacles - 1)) * radius * 1.2;
    const height = radius * (0.6 + (rand(i) % 40) / 100);
    ctx.fillRect(tx - radius * 0.08, y + radius * 0.7, radius * 0.16, height);
  }
  
  // 外轮廓
  ctx.fillStyle = palette.outline;
  ctx.beginPath();
  ctx.ellipse(x, y + radius * 0.05, radius * 1.15, radius * 1.05, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // 主体(椭圆形头部)
  ctx.fillStyle = palette.main;
  ctx.beginPath();
  ctx.ellipse(x, y, radius * 1.1, radius, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // 半透明感的内部高光
  ctx.fillStyle = palette.light;
  ctx.globalAlpha = 0.6;
  ctx.beginPath();
  ctx.ellipse(x - radius * 0.2, y - radius * 0.2, radius * 0.6, radius * 0.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1.0;
  
  // 底部渐变
  ctx.fillStyle = palette.dark;
  ctx.beginPath();
  ctx.ellipse(x, y + radius * 0.5, radius * 0.9, radius * 0.4, 0, 0, Math.PI);
  ctx.fill();
}

// 翅膀型身体(恶魔/蝙蝠)
function drawWingedBody(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, palette: any, seed: number) {
  // 绘制翅膀
  ctx.fillStyle = palette.dark;
  // 左翅膀
  ctx.beginPath();
  ctx.moveTo(x - radius * 0.5, y);
  ctx.quadraticCurveTo(x - radius * 1.8, y - radius * 0.5, x - radius * 1.5, y + radius * 0.8);
  ctx.quadraticCurveTo(x - radius * 0.8, y + radius * 0.3, x - radius * 0.5, y);
  ctx.fill();
  // 右翅膀
  ctx.beginPath();
  ctx.moveTo(x + radius * 0.5, y);
  ctx.quadraticCurveTo(x + radius * 1.8, y - radius * 0.5, x + radius * 1.5, y + radius * 0.8);
  ctx.quadraticCurveTo(x + radius * 0.8, y + radius * 0.3, x + radius * 0.5, y);
  ctx.fill();
  
  // 翅膀高光
  ctx.fillStyle = palette.accent;
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.arc(x - radius * 1.2, y + radius * 0.2, radius * 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + radius * 1.2, y + radius * 0.2, radius * 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1.0;
  
  // 外轮廓
  ctx.fillStyle = palette.outline;
  ctx.beginPath();
  ctx.arc(x, y + radius * 0.08, radius * 1.1, 0, Math.PI * 2);
  ctx.fill();
  
  // 主体
  ctx.fillStyle = palette.main;
  ctx.beginPath();
  ctx.arc(x, y, radius * 1.05, 0, Math.PI * 2);
  ctx.fill();
  
  // 阴影
  ctx.fillStyle = palette.dark;
  ctx.beginPath();
  ctx.arc(x, y + radius * 0.4, radius * 0.8, 0, Math.PI);
  ctx.fill();
  
  // 高光
  ctx.fillStyle = palette.light;
  ctx.beginPath();
  ctx.arc(x - radius * 0.3, y - radius * 0.3, radius * 0.25, 0, Math.PI * 2);
  ctx.fill();
}

// 绘制眼睛
function drawEyes(ctx: CanvasRenderingContext2D, x: number, y: number, eyeSize: number, palette: any, seed: number) {
  const rand = (offset: number) => (seed + offset) % 100;
  const eyeSpacing = eyeSize * 1.5;
  
  // 眼白
  ctx.fillStyle = palette.white;
  ctx.beginPath();
  ctx.arc(x - eyeSpacing, y, eyeSize, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + eyeSpacing, y, eyeSize, 0, Math.PI * 2);
  ctx.fill();
  
  // 瞳孔
  ctx.fillStyle = palette.black;
  const pupilSize = eyeSize * 0.6;
  const pupilOffsetX = (rand(40) % 3 - 1) * eyeSize * 0.15; // 轻微偏移
  ctx.beginPath();
  ctx.arc(x - eyeSpacing + pupilOffsetX, y, pupilSize, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + eyeSpacing + pupilOffsetX, y, pupilSize, 0, Math.PI * 2);
  ctx.fill();
  
  // 眼睛高光(关键!)
  ctx.fillStyle = palette.eyeHighlight;
  const highlightSize = eyeSize * 0.3;
  ctx.beginPath();
  ctx.arc(x - eyeSpacing - pupilSize * 0.3, y - pupilSize * 0.3, highlightSize, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + eyeSpacing - pupilSize * 0.3, y - pupilSize * 0.3, highlightSize, 0, Math.PI * 2);
  ctx.fill();
}

// 绘制配饰(角/触手/帽子/嘴巴)
function drawAccessories(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, palette: any, seed: number, shapeType: number) {
  const rand = (offset: number) => (seed + offset) % 100;
  
  // 嘴巴
  ctx.strokeStyle = palette.outline;
  ctx.lineWidth = size * 0.02;
  ctx.lineCap = 'round';
  const mouthType = rand(50) % 3;
  if (mouthType === 0) {
    // 微笑
    ctx.beginPath();
    ctx.arc(x, y + size * 0.15, size * 0.12, 0, Math.PI);
    ctx.stroke();
  } else if (mouthType === 1) {
    // 波浪
    ctx.beginPath();
    ctx.moveTo(x - size * 0.1, y + size * 0.15);
    ctx.quadraticCurveTo(x, y + size * 0.18, x + size * 0.1, y + size * 0.15);
    ctx.stroke();
  } else {
    // 小圆口
    ctx.fillStyle = palette.outline;
    ctx.beginPath();
    ctx.arc(x, y + size * 0.15, size * 0.04, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // 根据类型添加特殊配饰
  if (rand(60) > 50) {
    if (shapeType === 1) {
      // 触角/角
      ctx.strokeStyle = palette.accent;
      ctx.lineWidth = size * 0.03;
      ctx.beginPath();
      ctx.moveTo(x - size * 0.15, y - size * 0.25);
      ctx.lineTo(x - size * 0.25, y - size * 0.4);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + size * 0.15, y - size * 0.25);
      ctx.lineTo(x + size * 0.25, y - size * 0.4);
      ctx.stroke();
    } else if (shapeType === 3) {
      // 小角
      ctx.fillStyle = palette.dark;
      ctx.beginPath();
      ctx.moveTo(x - size * 0.2, y - size * 0.25);
      ctx.lineTo(x - size * 0.15, y - size * 0.2);
      ctx.lineTo(x - size * 0.25, y - size * 0.15);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x + size * 0.2, y - size * 0.25);
      ctx.lineTo(x + size * 0.15, y - size * 0.2);
      ctx.lineTo(x + size * 0.25, y - size * 0.15);
      ctx.fill();
    }
  }
}

// 生成像素生物图像 - 增强版
function generatePixelCreature(description: string, size: number = 64): string {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  
  ctx.clearRect(0, 0, size, size);
  
  const seed = simpleHash(description);
  const palette = getColorPalette(description, seed);
  const rand = (offset: number) => (seed + offset) % 100;
  
  // 根据描述和随机数选择形状类型
  const shapeType = rand(10) % 4; // 0=圆形/史莱姆, 1=腿状/蜘蛛, 2=漂浮/幽灵, 3=翅膀/蝙蝠
  
  const centerX = size / 2;
  const centerY = size / 2;
  
  // 禁用抗锯齿,保持像素风格
  ctx.imageSmoothingEnabled = false;
  
  // ===== 绘制身体 =====
  if (shapeType === 0) {
    // 圆形史莱姆型
    drawSlimeBody(ctx, centerX, centerY, size * 0.38, palette, seed);
  } else if (shapeType === 1) {
    // 腿状蘑菇/蜘蛛型
    drawLeggedBody(ctx, centerX, centerY - size * 0.05, size * 0.32, palette, seed);
  } else if (shapeType === 2) {
    // 漂浮幽灵型
    drawFloatingBody(ctx, centerX, centerY, size * 0.35, palette, seed);
  } else {
    // 翅膀恶魔/蝙蝠型
    drawWingedBody(ctx, centerX, centerY, size * 0.3, palette, seed);
  }
  
  // ===== 绘制装饰 =====
  drawAccessories(ctx, centerX, centerY, size, palette, seed, shapeType);
  
  // ===== 绘制眼睛(最后画,在最上层) =====
  drawEyes(ctx, centerX, centerY - size * 0.1, size * 0.15, palette, seed);
  
  return canvas.toDataURL();
}

// 音频文件库 - 根据关键词匹配
const AUDIO_LIBRARY: { [key: string]: string[] } = {
  'roar': [
    '/reference-assets/audio/mixkit-aggressive-beast-roar-13.wav',
    '/reference-assets/audio/mixkit-giant-monster-roar-1972 (1).wav',
    '/reference-assets/audio/mixkit-wild-lion-animal-roar-6.wav'
  ],
  'scream': [
    '/reference-assets/audio/mixkit-angry-monster-scream-1963 (1).wav'
  ],
  'growl': [
    '/reference-assets/audio/mixkit-monster-calm-growl-1956 (1).wav',
    '/reference-assets/audio/mixkit-wild-creature-growl-1957.wav',
    '/reference-assets/audio/mixkit-zombie-monster-growl-1973.wav'
  ],
  'laugh': [
    '/reference-assets/audio/mixkit-troll-warrior-laugh-409.wav'
  ],
  'cry': [
    '/reference-assets/audio/mixkit-creature-cry-of-hurt-2208.wav'
  ]
};

// 根据描述选择匹配的音频文件
function selectAudioByKeyword(description: string, seed: number): string {
  const desc = description.toLowerCase();
  
  // 按优先级匹配关键词
  let selectedCategory = 'growl'; // 默认
  
  if (desc.includes('roar') || desc.includes('咆哮') || desc.includes('aggressive') || desc.includes('beast')) {
    selectedCategory = 'roar';
  } else if (desc.includes('scream') || desc.includes('尖叫') || desc.includes('angry')) {
    selectedCategory = 'scream';
  } else if (desc.includes('laugh') || desc.includes('笑') || desc.includes('troll')) {
    selectedCategory = 'laugh';
  } else if (desc.includes('cry') || desc.includes('hurt') || desc.includes('哭')) {
    selectedCategory = 'cry';
  } else if (desc.includes('growl') || desc.includes('低吼') || desc.includes('calm')) {
    selectedCategory = 'growl';
  }
  
  // 从该类别中根据seed选择一个
  const audioList = AUDIO_LIBRARY[selectedCategory];
  const index = seed % audioList.length;
  
  return audioList[index];
}

// 生成音频 - 使用真实音频文件
async function generateAudio(description: string): Promise<string> {
  const seed = simpleHash(description);
  const audioPath = selectAudioByKeyword(description, seed);
  
  try {
    // 获取音频文件
    const response = await fetch(audioPath);
    const blob = await response.blob();
    
    // 转换为base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('加载音频失败:', error);
    // 如果加载失败,返回空音频
    return 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
  }
}

// 主生成函数
export async function generateCreatureOffline(
  description: string,
  pixelSize: string = '32px',
  quantity: number = 4
): Promise<any> {
  console.log('🎨 使用增强版前端生成器(真实音频):', description);
  
  const images: string[] = [];
  const audioPromises: Promise<string>[] = [];
  
  const size = parseInt(pixelSize.replace('px', ''));
  
  for (let i = 0; i < quantity; i++) {
    // 为每个变体添加不同的后缀
    const variantDesc = `${description}_variant_${i}`;
    images.push(generatePixelCreature(variantDesc, size));
    audioPromises.push(generateAudio(variantDesc));
  }
  
  // 等待所有音频加载完成
  const audios = await Promise.all(audioPromises);
  
  return {
    success: true,
    message: '生成成功!(增强版+真实音频)',
    images,
    audios,
    prompt: description,
    method: 'Enhanced Frontend Generator with Real Audio'
  };
}
