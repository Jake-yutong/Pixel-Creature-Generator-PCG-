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
// 如果提供aiColors,优先使用AI生成的颜色
function getColorPalette(description: string, seed: number, aiColors?: string[]): any {
  const desc = description.toLowerCase();
  const rand = (offset: number) => (seed + offset) % 100;
  
  // 如果有AI颜色,优先使用
  if (aiColors && aiColors.length >= 3) {
    console.log('🎨 使用AI颜色方案:', aiColors);
    return {
      main: aiColors[0] || '#FF6B6B',
      dark: aiColors[1] || '#C44444',
      light: aiColors[2] || '#FFB3B3',
      accent: aiColors[3] || aiColors[0],
      outline: aiColors[4] || '#2a1810',
      white: '#ffffff',
      black: '#000000',
      eyeHighlight: '#ffffff'
    };
  }
  
  // 根据描述选择基础色系,但每个变体在色系内随机变化
  let palette: any;
  
  // 随机选择一个色系变化范围(让同一描述的4个变体也不同)
  const colorVariation = rand(999) % 5; // 0-4, 5种变化
  
  if (desc.includes('fire') || desc.includes('red') || desc.includes('火') || desc.includes('红')) {
    // 红色系 - 从橙红到深红的渐变
    const hueShift = colorVariation * 10; // 0, 10, 20, 30, 40
    const satShift = colorVariation * 5;
    palette = {
      main: `hsl(${(rand(0) % 30 + hueShift) % 360}, ${75 + satShift}%, ${50 + colorVariation * 3}%)`,
      dark: `hsl(${(rand(0) % 30 + hueShift) % 360}, ${70 + satShift}%, ${30 + colorVariation * 2}%)`,
      light: `hsl(${(rand(0) % 30 + hueShift) % 360}, ${80 + satShift}%, ${70 + colorVariation * 2}%)`,
      accent: `hsl(${(30 + hueShift * 2) % 360}, ${70 + satShift}%, ${60 + colorVariation}%)`,
      outline: `hsl(${rand(0) % 30}, 50%, ${10 + colorVariation * 2}%)`
    };
  } else if (desc.includes('green') || desc.includes('slime') || desc.includes('绿') || desc.includes('史莱姆')) {
    // 绿色系 - 从黄绿到蓝绿的渐变
    const hueShift = colorVariation * 15;
    const satShift = colorVariation * 4;
    palette = {
      main: `hsl(${90 + rand(0) % 70 + hueShift}, ${60 + satShift}%, ${45 + colorVariation * 3}%)`,
      dark: `hsl(${90 + rand(0) % 70 + hueShift}, ${65 + satShift}%, ${25 + colorVariation * 2}%)`,
      light: `hsl(${90 + rand(0) % 70 + hueShift}, ${70 + satShift}%, ${65 + colorVariation * 2}%)`,
      accent: `hsl(${140 + rand(0) % 40 + hueShift}, ${55 + satShift}%, ${50 + colorVariation}%)`,
      outline: `hsl(${120 + hueShift}, 60%, ${10 + colorVariation * 2}%)`
    };
  } else if (desc.includes('blue') || desc.includes('ice') || desc.includes('蓝') || desc.includes('冰')) {
    // 蓝色系 - 从青色到深蓝的渐变
    const hueShift = colorVariation * 12;
    const satShift = colorVariation * 5;
    palette = {
      main: `hsl(${170 + rand(0) % 70 + hueShift}, ${65 + satShift}%, ${50 + colorVariation * 3}%)`,
      dark: `hsl(${170 + rand(0) % 70 + hueShift}, ${70 + satShift}%, ${30 + colorVariation * 2}%)`,
      light: `hsl(${170 + rand(0) % 70 + hueShift}, ${75 + satShift}%, ${70 + colorVariation * 2}%)`,
      accent: `hsl(${190 + rand(0) % 50 + hueShift}, ${60 + satShift}%, ${55 + colorVariation}%)`,
      outline: `hsl(${200 + hueShift}, 70%, ${8 + colorVariation * 2}%)`
    };
  } else if (desc.includes('purple') || desc.includes('dark') || desc.includes('紫') || desc.includes('暗')) {
    // 紫色系 - 从粉紫到深紫的渐变
    const hueShift = colorVariation * 18;
    const satShift = colorVariation * 6;
    palette = {
      main: `hsl(${260 + rand(0) % 60 + hueShift}, ${55 + satShift}%, ${40 + colorVariation * 3}%)`,
      dark: `hsl(${260 + rand(0) % 60 + hueShift}, ${60 + satShift}%, ${20 + colorVariation * 2}%)`,
      light: `hsl(${260 + rand(0) % 60 + hueShift}, ${65 + satShift}%, ${60 + colorVariation * 2}%)`,
      accent: `hsl(${290 + rand(0) % 50 + hueShift}, ${50 + satShift}%, ${45 + colorVariation}%)`,
      outline: `hsl(${280 + hueShift}, 50%, ${8 + colorVariation * 2}%)`
    };
  } else {
    // 完全随机色系 - 每个变体完全不同的颜色
    const baseHue = (rand(0) * colorVariation * 73) % 360; // 使用质数让分布更均匀
    const saturation = 60 + rand(100) % 30;
    const lightness = 45 + rand(200) % 20;
    palette = {
      main: `hsl(${baseHue}, ${saturation}%, ${lightness}%)`,
      dark: `hsl(${baseHue}, ${saturation + 10}%, ${lightness - 20}%)`,
      light: `hsl(${baseHue}, ${saturation + 15}%, ${lightness + 25}%)`,
      accent: `hsl(${(baseHue + 60 + rand(300) % 120) % 360}, ${saturation - 5}%, ${lightness + 10}%)`,
      outline: `hsl(${baseHue}, ${saturation}%, ${10 + colorVariation * 2}%)`
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

// 像素艺术绘制函数 - 真正的像素化
function drawPixel(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, pixelSize: number) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.floor(x), Math.floor(y), pixelSize, pixelSize);
}

// 生成像素生物图像 - 真正的像素艺术版
function generatePixelCreature(description: string, targetSize: number = 64, aiColors?: string[]): string {
  // 使用更小的画布来创建像素效果,然后放大
  const pixelRes = 32; // 32x32像素分辨率
  // 确保每个像素至少8x8实际像素,避免图片太小导致细节丢失
  const pixelSize = Math.max(8, Math.ceil(targetSize / pixelRes));
  
  const canvas = document.createElement('canvas');
  canvas.width = pixelRes * pixelSize;
  canvas.height = pixelRes * pixelSize;
  const ctx = canvas.getContext('2d')!;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = false;
  
  const seed = simpleHash(description);
  const palette = getColorPalette(description, seed, aiColors);
  console.log('🎨 生成调色板:', palette);
  const rand = (offset: number) => (seed + offset) % 100;
  
  // 增强随机性 - 使用时间戳让每次生成都不同
  const timeBasedRand = (offset: number) => (seed + offset + Date.now()) % 100;
  
  // 根据描述和随机数选择形状类型 - 使用时间戳增加随机性
  const shapeType = timeBasedRand(10) % 4;
  
  // 创建像素数据数组 (32x32)
  const pixels: string[][] = Array(pixelRes).fill(null).map(() => Array(pixelRes).fill('transparent'));
  
  const centerX = Math.floor(pixelRes / 2);
  const centerY = Math.floor(pixelRes / 2);
  
  // 根据类型绘制不同的像素怪物
  if (shapeType === 0) {
    // 史莱姆型 - 圆润可爱
    drawPixelSlime(pixels, centerX, centerY, palette, rand);
  } else if (shapeType === 1) {
    // 蘑菇/蜘蛛型 - 带腿
    drawPixelMushroom(pixels, centerX, centerY, palette, rand);
  } else if (shapeType === 2) {
    // 幽灵型 - 漂浮
    drawPixelGhost(pixels, centerX, centerY, palette, rand);
  } else {
    // 恶魔/蝙蝠型 - 带翅膀
    drawPixelDemon(pixels, centerX, centerY, palette, rand);
  }
  
  // 将像素数组绘制到画布
  let pixelCount = 0;
  const colorUsage: {[key: string]: number} = {};
  for (let y = 0; y < pixelRes; y++) {
    for (let x = 0; x < pixelRes; x++) {
      if (pixels[y][x] !== 'transparent') {
        drawPixel(ctx, x * pixelSize, y * pixelSize, pixels[y][x], pixelSize);
        pixelCount++;
        colorUsage[pixels[y][x]] = (colorUsage[pixels[y][x]] || 0) + 1;
      }
    }
  }
  console.log(`📊 绘制了${pixelCount}个像素, 使用了${Object.keys(colorUsage).length}种颜色`);
  console.log('🎨 颜色使用情况:', colorUsage);
  
  return canvas.toDataURL();
}

// 绘制像素史莱姆 - 增加随机变化
function drawPixelSlime(pixels: string[][], cx: number, cy: number, palette: any, rand: (n: number) => number) {
  const size = 9 + (rand(100) % 3); // 随机大小 9-11
  const squish = 0.8 + (rand(101) % 40) / 100; // 随机扁平度 0.8-1.2
  
  // 底部阴影 (椭圆形) - 随机宽度
  const shadowWidth = 6 + (rand(102) % 3);
  for (let y = -3; y <= 3; y++) {
    for (let x = -shadowWidth; x <= shadowWidth; x++) {
      if (x * x / (shadowWidth * shadowWidth) + y * y / 9 < 1) {
        setPixel(pixels, cx + x, cy + size - 3 + y, palette.outline);
      }
    }
  }
  
  // 主体 (椭圆形) - 随机形状
  for (let y = -size; y <= size; y++) {
    for (let x = -size; x <= size; x++) {
      const dist = Math.sqrt(x * x / (squish * squish) + y * y);
      if (dist < size) {
        if (dist < size - 2) {
          setPixel(pixels, cx + x, cy + y, palette.main);
        } else {
          setPixel(pixels, cx + x, cy + y, palette.dark);
        }
      }
    }
  }
  
  // 底部阴影层
  for (let y = size / 2; y <= size; y++) {
    for (let x = -size + 2; x <= size - 2; x++) {
      if (Math.sqrt(x * x + (y - size / 2) * (y - size / 2)) < size / 2) {
        setPixel(pixels, cx + x, cy + y, palette.dark);
      }
    }
  }
  
  // 高光 - 随机位置
  const highlightX = -size + 2 + (rand(103) % 3);
  const highlightY = -size + 2 + (rand(104) % 3);
  for (let y = highlightY; y <= highlightY + 3; y++) {
    for (let x = highlightX; x <= highlightX + 3; x++) {
      if (Math.sqrt((x - highlightX - 1) * (x - highlightX - 1) + (y - highlightY - 1) * (y - highlightY - 1)) < 2) {
        setPixel(pixels, cx + x, cy + y, palette.light);
      }
    }
  }
  
  // 眼睛 - 随机位置
  const eyeY = cy - 2 + (rand(105) % 3) - 1;
  drawPixelEyes(pixels, cx, eyeY, palette, rand);
  
  // 嘴巴 - 3种随机样式
  const mouthStyle = rand(106) % 3;
  const mouthY = cy + 4 + (rand(107) % 2);
  if (mouthStyle === 0) {
    // 直线嘴
    for (let x = -2; x <= 2; x++) {
      setPixel(pixels, cx + x, mouthY, palette.outline);
    }
  } else if (mouthStyle === 1) {
    // 微笑
    setPixel(pixels, cx - 2, mouthY, palette.outline);
    setPixel(pixels, cx - 1, mouthY + 1, palette.outline);
    setPixel(pixels, cx, mouthY + 1, palette.outline);
    setPixel(pixels, cx + 1, mouthY + 1, palette.outline);
    setPixel(pixels, cx + 2, mouthY, palette.outline);
  } else {
    // 小圆口
    setPixel(pixels, cx, mouthY, palette.outline);
    setPixel(pixels, cx - 1, mouthY, palette.outline);
    setPixel(pixels, cx + 1, mouthY, palette.outline);
  }
}

// 绘制像素蘑菇 - 增加随机变化
function drawPixelMushroom(pixels: string[][], cx: number, cy: number, palette: any, rand: (n: number) => number) {
  // 腿部 - 随机数量和位置
  const legCount = 3 + (rand(200) % 2); // 3-4条腿
  for (let i = 0; i < legCount; i++) {
    const legSpacing = legCount === 3 ? 4 : 3;
    const legX = cx + (i - (legCount - 1) / 2) * legSpacing;
    const legHeight = 10 + (rand(201 + i) % 3); // 随机腿长
    for (let y = cy + 5; y < cy + 5 + legHeight; y++) {
      setPixel(pixels, legX, y, palette.dark);
      // 随机增加腿的粗细
      if (rand(202 + i) % 2 === 0) {
        setPixel(pixels, legX + 1, y, palette.dark);
      }
    }
  }
  
  // 头部大小随机
  const headSize = 7 + (rand(203) % 2);
  
  // 头部轮廓
  for (let y = -headSize - 1; y <= 4; y++) {
    for (let x = -headSize - 1; x <= headSize + 1; x++) {
      const dist = Math.sqrt(x * x + y * y);
      if (dist < headSize + 1 && dist > headSize - 0.5) {
        setPixel(pixels, cx + x, cy + y, palette.outline);
      }
    }
  }
  
  // 头部主体
  for (let y = -headSize; y <= 3; y++) {
    for (let x = -headSize; x <= headSize; x++) {
      if (Math.sqrt(x * x + y * y) < headSize) {
        setPixel(pixels, cx + x, cy + y, palette.main);
      }
    }
  }
  
  // 斑点装饰 - 随机数量和位置
  const spotCount = 3 + (rand(204) % 4); // 3-6个斑点
  for (let i = 0; i < spotCount; i++) {
    const angle = (i / spotCount) * Math.PI * 2 + rand(205 + i) / 50;
    const distance = 2 + (rand(206 + i) % 4);
    const sx = Math.floor(Math.cos(angle) * distance);
    const sy = Math.floor(Math.sin(angle) * distance) - 2;
    const spotSize = 1 + (rand(207 + i) % 2);
    
    for (let dy = -spotSize; dy <= spotSize; dy++) {
      for (let dx = -spotSize; dx <= spotSize; dx++) {
        if (Math.abs(dx) + Math.abs(dy) <= spotSize) {
          setPixel(pixels, cx + sx + dx, cy + sy + dy, palette.light);
        }
      }
    }
  }
  
  // 眼睛 - 随机位置
  const eyeY = cy + (rand(208) % 3) - 1;
  drawPixelEyes(pixels, cx, eyeY, palette, rand);
}

// 绘制像素幽灵 - 增加随机变化
function drawPixelGhost(pixels: string[][], cx: number, cy: number, palette: any, rand: (n: number) => number) {
  const bodyWidth = 5 + (rand(300) % 3); // 随机宽度 5-7
  const bodyHeight = 7 + (rand(301) % 3); // 随机高度 7-9
  
  // 头部
  for (let y = -bodyHeight; y <= 2; y++) {
    for (let x = -bodyWidth; x <= bodyWidth; x++) {
      const dist = Math.sqrt(x * x + Math.max(0, y) * Math.max(0, y));
      if (dist < bodyWidth + 1) {
        setPixel(pixels, cx + x, cy + y, y < 0 ? palette.main : palette.main);
      }
    }
  }
  
  // 波浪底部 - 随机波浪样式
  const waveStyle = rand(302) % 3;
  for (let x = -bodyWidth; x <= bodyWidth; x++) {
    let wave = 0;
    if (waveStyle === 0) {
      wave = Math.sin(x * 0.8) * 2; // 正弦波
    } else if (waveStyle === 1) {
      wave = Math.abs(x % 3) - 1; // 锯齿波
    } else {
      wave = x % 2 === 0 ? 1 : -1; // 方波
    }
    for (let y = 2; y < 2 + wave + 4; y++) {
      setPixel(pixels, cx + x, cy + y, palette.main);
    }
  }
  
  // 半透明效果 (用浅色模拟) - 随机位置和大小
  const glowSize = 3 + (rand(303) % 2);
  const glowX = -bodyWidth + (rand(304) % 3);
  const glowY = -bodyHeight + (rand(305) % 3);
  for (let y = glowY; y <= glowY + glowSize; y++) {
    for (let x = glowX; x <= glowX + glowSize; x++) {
      if (Math.sqrt((x - glowX - 1) * (x - glowX - 1) + (y - glowY - 1) * (y - glowY - 1)) < glowSize) {
        setPixel(pixels, cx + x, cy + y, palette.light);
      }
    }
  }
  
  // 轮廓
  for (let y = -bodyHeight - 1; y <= 10; y++) {
    for (let x = -bodyWidth - 1; x <= bodyWidth + 1; x++) {
      if (getPixel(pixels, cx + x, cy + y) === palette.main || getPixel(pixels, cx + x, cy + y) === palette.light) {
        // 检查周围是否有透明像素
        if (getPixel(pixels, cx + x + 1, cy + y) === 'transparent' ||
            getPixel(pixels, cx + x - 1, cy + y) === 'transparent' ||
            getPixel(pixels, cx + x, cy + y + 1) === 'transparent' ||
            getPixel(pixels, cx + x, cy + y - 1) === 'transparent') {
          if (getPixel(pixels, cx + x, cy + y) !== palette.light) {
            setPixel(pixels, cx + x, cy + y, palette.dark);
          }
        }
      }
    }
  }
  
  // 眼睛 - 随机位置
  const eyeY = cy - 2 + (rand(306) % 3) - 1;
  drawPixelEyes(pixels, cx, eyeY, palette, rand);
}

// 绘制像素恶魔 - 增加随机变化
function drawPixelDemon(pixels: string[][], cx: number, cy: number, palette: any, rand: (n: number) => number) {
  const bodySize = 5 + (rand(400) % 3); // 随机身体大小 5-7
  const wingSize = 3 + (rand(401) % 2); // 随机翅膀大小 3-4
  const wingSpread = 10 + (rand(402) % 3); // 随机翅膀展开距离 10-12
  
  // 翅膀样式随机
  const wingStyle = rand(403) % 2;
  
  // 翅膀 (左)
  for (let y = -wingSize; y <= wingSize; y++) {
    for (let x = -wingSpread - 2; x <= -wingSpread + 2; x++) {
      const dist = Math.sqrt((x + wingSpread) * (x + wingSpread) + y * y);
      if (wingStyle === 0) {
        // 圆形翅膀
        if (dist < wingSize) {
          setPixel(pixels, cx + x, cy + y, palette.dark);
        }
      } else {
        // 尖角翅膀
        if (Math.abs(y) + Math.abs(x + wingSpread) < wingSize + 1) {
          setPixel(pixels, cx + x, cy + y, palette.dark);
        }
      }
    }
  }
  
  // 翅膀 (右)
  for (let y = -wingSize; y <= wingSize; y++) {
    for (let x = wingSpread - 2; x <= wingSpread + 2; x++) {
      const dist = Math.sqrt((x - wingSpread) * (x - wingSpread) + y * y);
      if (wingStyle === 0) {
        // 圆形翅膀
        if (dist < wingSize) {
          setPixel(pixels, cx + x, cy + y, palette.dark);
        }
      } else {
        // 尖角翅膀
        if (Math.abs(y) + Math.abs(x - wingSpread) < wingSize + 1) {
          setPixel(pixels, cx + x, cy + y, palette.dark);
        }
      }
    }
  }
  
  // 身体
  for (let y = -bodySize; y <= bodySize; y++) {
    for (let x = -bodySize; x <= bodySize; x++) {
      if (Math.sqrt(x * x + y * y) < bodySize) {
        setPixel(pixels, cx + x, cy + y, palette.main);
      }
    }
  }
  
  // 角 - 随机样式
  const hornStyle = rand(404) % 3;
  const hornHeight = 3 + (rand(405) % 3); // 随机角高 3-5
  const hornSpacing = 2 + (rand(406) % 2); // 随机角间距 2-3
  
  if (hornStyle === 0) {
    // 直角
    for (let y = -bodySize - hornHeight; y <= -bodySize; y++) {
      for (let x = -hornSpacing - 1; x <= -hornSpacing + 1; x++) {
        setPixel(pixels, cx + x, cy + y, palette.accent);
      }
      for (let x = hornSpacing - 1; x <= hornSpacing + 1; x++) {
        setPixel(pixels, cx + x, cy + y, palette.accent);
      }
    }
  } else if (hornStyle === 1) {
    // 尖角
    for (let i = 0; i < hornHeight; i++) {
      const width = Math.floor((hornHeight - i) / 2);
      for (let w = -width; w <= width; w++) {
        setPixel(pixels, cx - hornSpacing + w, cy - bodySize - i, palette.accent);
        setPixel(pixels, cx + hornSpacing + w, cy - bodySize - i, palette.accent);
      }
    }
  } else {
    // 弯曲角
    for (let i = 0; i < hornHeight; i++) {
      setPixel(pixels, cx - hornSpacing - Math.floor(i / 2), cy - bodySize - i, palette.accent);
      setPixel(pixels, cx + hornSpacing + Math.floor(i / 2), cy - bodySize - i, palette.accent);
    }
  }
  
  // 阴影
  for (let y = bodySize / 2; y <= bodySize + 1; y++) {
    for (let x = -bodySize + 1; x <= bodySize - 1; x++) {
      if (Math.sqrt(x * x + (y - bodySize / 2) * (y - bodySize / 2)) < bodySize / 2) {
        setPixel(pixels, cx + x, cy + y, palette.dark);
      }
    }
  }
  
  // 眼睛 - 随机位置
  const eyeY = cy - 1 + (rand(407) % 3) - 1;
  drawPixelEyes(pixels, cx, eyeY, palette, rand);
}

// 绘制像素眼睛 - 增加随机变化
function drawPixelEyes(pixels: string[][], cx: number, cy: number, palette: any, rand: (n: number) => number) {
  const eyeSpacing = 3 + (rand(500) % 2); // 随机眼距 3-4
  const eyeSize = 1 + (rand(501) % 2); // 随机眼睛大小 1-2
  const pupilLook = rand(502) % 5; // 随机瞳孔方向 0-4
  
  // 眼睛样式
  const eyeStyle = rand(503) % 3;
  
  if (eyeStyle === 0) {
    // 标准圆眼
    // 左眼白
    for (let y = -eyeSize; y <= eyeSize; y++) {
      for (let x = -eyeSize; x <= eyeSize; x++) {
        if (Math.abs(x) + Math.abs(y) <= eyeSize) {
          setPixel(pixels, cx - eyeSpacing + x, cy + y, palette.white);
        }
      }
    }
    
    // 右眼白
    for (let y = -eyeSize; y <= eyeSize; y++) {
      for (let x = -eyeSize; x <= eyeSize; x++) {
        if (Math.abs(x) + Math.abs(y) <= eyeSize) {
          setPixel(pixels, cx + eyeSpacing + x, cy + y, palette.white);
        }
      }
    }
    
    // 瞳孔方向 (0=中 1=左 2=右 3=上 4=下)
    const pupilOffsetX = pupilLook === 1 ? -1 : pupilLook === 2 ? 1 : 0;
    const pupilOffsetY = pupilLook === 3 ? -1 : pupilLook === 4 ? 1 : 0;
    
    setPixel(pixels, cx - eyeSpacing + pupilOffsetX, cy + pupilOffsetY, palette.black);
    setPixel(pixels, cx + eyeSpacing + pupilOffsetX, cy + pupilOffsetY, palette.black);
    
    // 眼睛高光
    setPixel(pixels, cx - eyeSpacing - 1, cy - 1, palette.eyeHighlight);
    setPixel(pixels, cx + eyeSpacing - 1, cy - 1, palette.eyeHighlight);
    
  } else if (eyeStyle === 1) {
    // 愤怒眼 (斜线)
    setPixel(pixels, cx - eyeSpacing - 1, cy - 1, palette.black);
    setPixel(pixels, cx - eyeSpacing, cy, palette.black);
    setPixel(pixels, cx - eyeSpacing + 1, cy + 1, palette.black);
    
    setPixel(pixels, cx + eyeSpacing + 1, cy - 1, palette.black);
    setPixel(pixels, cx + eyeSpacing, cy, palette.black);
    setPixel(pixels, cx + eyeSpacing - 1, cy + 1, palette.black);
    
  } else {
    // 可爱大眼
    // 左眼 - 更大的白色区域
    for (let y = -2; y <= 2; y++) {
      for (let x = -2; x <= 2; x++) {
        if (x * x + y * y < 5) {
          setPixel(pixels, cx - eyeSpacing + x, cy + y, palette.white);
        }
      }
    }
    
    // 右眼 - 更大的白色区域
    for (let y = -2; y <= 2; y++) {
      for (let x = -2; x <= 2; x++) {
        if (x * x + y * y < 5) {
          setPixel(pixels, cx + eyeSpacing + x, cy + y, palette.white);
        }
      }
    }
    
    // 大瞳孔
    setPixel(pixels, cx - eyeSpacing, cy, palette.black);
    setPixel(pixels, cx - eyeSpacing + 1, cy, palette.black);
    setPixel(pixels, cx - eyeSpacing, cy + 1, palette.black);
    
    setPixel(pixels, cx + eyeSpacing, cy, palette.black);
    setPixel(pixels, cx + eyeSpacing - 1, cy, palette.black);
    setPixel(pixels, cx + eyeSpacing, cy + 1, palette.black);
    
    // 大高光
    setPixel(pixels, cx - eyeSpacing - 1, cy - 1, palette.eyeHighlight);
    setPixel(pixels, cx - eyeSpacing, cy - 1, palette.eyeHighlight);
    setPixel(pixels, cx + eyeSpacing, cy - 1, palette.eyeHighlight);
    setPixel(pixels, cx + eyeSpacing + 1, cy - 1, palette.eyeHighlight);
  }
}

// 辅助函数
function setPixel(pixels: string[][], x: number, y: number, color: string) {
  if (y >= 0 && y < pixels.length && x >= 0 && x < pixels[0].length) {
    pixels[y][x] = color;
  }
}

function getPixel(pixels: string[][], x: number, y: number): string {
  if (y >= 0 && y < pixels.length && x >= 0 && x < pixels[0].length) {
    return pixels[y][x];
  }
  return 'transparent';
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

// 根据描述选择匹配的音频文件 - 增强随机性
function selectAudioByKeyword(description: string, seed: number): string {
  const desc = description.toLowerCase();
  
  // 收集所有可能的音频类别
  const possibleCategories: string[] = [];
  
  // 根据关键词匹配类别(可以匹配多个)
  if (desc.includes('roar') || desc.includes('咆哮') || desc.includes('aggressive') || desc.includes('beast')) {
    possibleCategories.push('roar');
  }
  if (desc.includes('scream') || desc.includes('尖叫') || desc.includes('angry')) {
    possibleCategories.push('scream');
  }
  if (desc.includes('laugh') || desc.includes('笑') || desc.includes('troll')) {
    possibleCategories.push('laugh');
  }
  if (desc.includes('cry') || desc.includes('hurt') || desc.includes('哭')) {
    possibleCategories.push('cry');
  }
  if (desc.includes('growl') || desc.includes('低吼') || desc.includes('calm')) {
    possibleCategories.push('growl');
  }
  
  // 如果没有匹配任何关键词,随机选择一个类别
  if (possibleCategories.length === 0) {
    const allCategories = Object.keys(AUDIO_LIBRARY);
    const randomCategoryIndex = seed % allCategories.length;
    possibleCategories.push(allCategories[randomCategoryIndex]);
  }
  
  // 从匹配的类别中随机选一个
  const categoryIndex = seed % possibleCategories.length;
  const selectedCategory = possibleCategories[categoryIndex];
  
  // 从该类别的音频列表中随机选择一个
  const audioList = AUDIO_LIBRARY[selectedCategory];
  const audioIndex = Math.floor((seed * 7 + Date.now()) % audioList.length);
  
  return audioList[audioIndex];
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

// 主生成函数 - 增加随机性
export async function generateCreatureOffline(
  description: string,
  pixelSize: string = '32px',
  quantity: number = 4,
  aiColors?: string[]
): Promise<any> {
  console.log('🎨 使用增强版前端生成器(真实音频+随机性):', description);
  
  try {
    const images: string[] = [];
    const audioPromises: Promise<string>[] = [];
    
    const size = parseInt(pixelSize.replace('px', ''));
    
    for (let i = 0; i < quantity; i++) {
      // 为每个变体添加随机时间戳和索引,确保每次都不同
      const randomSeed = Date.now() + Math.random() * 10000 + i * 1000;
      const variantDesc = `${description}_${randomSeed}_variant${i}`;
      
      // 如果有AI颜色,使用AI颜色;否则让每个变体生成完全不同的随机颜色
      let variantColors = aiColors;
      if (!aiColors) {
        // 为每个变体生成独特的随机配色方案
        const hue = (i * 90 + Math.floor(Math.random() * 60)) % 360; // 每个变体相隔90度色相
        const saturation = 65 + Math.floor(Math.random() * 20); // 65-85%
        const baseLightness = 50 + Math.floor(Math.random() * 10); // 50-60%
        variantColors = [
          `hsl(${hue}, ${saturation}%, ${baseLightness}%)`,           // main - 中等亮度
          `hsl(${hue}, ${Math.min(saturation + 15, 95)}%, ${Math.max(baseLightness - 25, 25)}%)`, // dark - 更暗
          `hsl(${hue}, ${Math.max(saturation - 10, 50)}%, ${Math.min(baseLightness + 25, 85)}%)`, // light - 更亮
          `hsl(${(hue + 30) % 360}, ${saturation}%, ${baseLightness + 5}%)`, // accent - 稍微偏色
          `hsl(${hue}, ${saturation}%, 15%)`                          // outline - 很暗
        ];
        console.log(`🎨 变体${i + 1}随机配色: 色相${hue}°, 饱和度${saturation}%, 基础亮度${baseLightness}%`);
      }
      
      try {
        const img = generatePixelCreature(variantDesc, size, variantColors);
        images.push(img);
        console.log(`✅ 图片 ${i + 1}/${quantity} 生成成功`);
      } catch (imgError) {
        console.error(`❌ 图片 ${i + 1}/${quantity} 生成失败:`, imgError);
        // 失败时添加空白占位图片,保证数组长度一致
        images.push('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
      }
      
      audioPromises.push(generateAudio(variantDesc));
    }
    
    // 等待所有音频加载完成,如果某些失败也不影响其他
    const audios = await Promise.all(audioPromises.map((p, index) => 
      p.catch(err => {
        console.error(`❌ 音频 ${index + 1}/${quantity} 加载失败:`, err);
        return 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
      })
    ));
    
    // 确保数组长度一致
    console.log(`📊 生成结果: ${images.length}张图片, ${audios.length}个音频 (请求${quantity}个)`);
    
    if (images.length === 0) {
      throw new Error('所有图片生成失败');
    }
    
    // 确保图片和音频数量匹配quantity
    while (images.length < quantity) {
      console.warn(`⚠️ 补充缺失的图片 (当前${images.length}, 需要${quantity})`);
      images.push('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
    }
    
    while (audios.length < quantity) {
      console.warn(`⚠️ 补充缺失的音频 (当前${audios.length}, 需要${quantity})`);
      audios.push('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=');
    }
    
    return {
      success: true,
      message: `生成成功! (${images.length}个生物)`,
      images,
      audios,
      prompt: description,
      method: 'Enhanced Frontend Generator with Real Audio & Randomization'
    };
  } catch (error) {
    console.error('生成器错误:', error);
    return {
      success: false,
      message: '生成失败: ' + (error instanceof Error ? error.message : '未知错误'),
      images: [],
      audios: [],
      prompt: description,
      method: 'Enhanced Frontend Generator with Real Audio & Randomization'
    };
  }
}
