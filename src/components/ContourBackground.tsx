import { useEffect, useRef } from 'react';
import { createNoise2D } from 'simplex-noise';
import { Theme } from '../App';

interface ContourBackgroundProps {
  theme: Theme;
}

export function ContourBackground({ theme }: ContourBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const colors = theme === 'dark' ? {
      base: 'rgba(60, 60, 60, 0.3)', // 深灰色，几乎融入黑色背景
      highlight: 'rgba(255, 255, 0, 0.5)', // 黄色高亮（减淡透明度）
    } : {
      base: 'rgba(200, 200, 200, 0.4)', // 浅灰色，几乎融入浅色背景
      highlight: 'rgba(100, 100, 100, 0.5)', // 深灰色高亮（减淡透明度）
    };

    // 创建噪声函数
    const noise2D = createNoise2D();

    // 等高线参数
    const noiseScale = 0.002; // 噪声缩放（越小越平滑，模拟大型山脉）
    const elevationLevels = 25; // 等高线数量
    const gridSize = 20; // 网格大小，用于marching squares

    // 动画参数
    const waveSpeed = 0.0005; // 波纹速度
    const waveRadius = 250; // 波纹影响半径
    const numWaves = 2; // 波纹数量

    // 生成高度场函数
    const getElevation = (x: number, y: number): number => {
      // 使用多个八度的噪声叠加，创建更真实的地形
      let elevation = 0;
      let amplitude = 1;
      let frequency = 1;
      
      for (let i = 0; i < 4; i++) {
        elevation += noise2D(
          x * noiseScale * frequency,
          y * noiseScale * frequency
        ) * amplitude;
        amplitude *= 0.5;
        frequency *= 2;
      }
      
      return elevation;
    };

    // 使用 marching squares 算法追踪等高线
    const traceContour = (level: number): Array<Array<{x: number, y: number}>> => {
      const contours: Array<Array<{x: number, y: number}>> = [];
      const visited = new Set<string>();
      
      const width = canvas.width;
      const height = canvas.height;
      
      // 遍历网格寻找等高线起点
      for (let y = 0; y < height - gridSize; y += gridSize) {
        for (let x = 0; x < width - gridSize; x += gridSize) {
          const key = `${x},${y}`;
          if (visited.has(key)) continue;
          
          // 获取网格四个角的高度
          const tl = getElevation(x, y);
          const tr = getElevation(x + gridSize, y);
          const bl = getElevation(x, y + gridSize);
          const br = getElevation(x + gridSize, y + gridSize);
          
          // 检查等高线是否穿过这个网格
          const crossesContour = 
            (tl < level && (tr >= level || bl >= level || br >= level)) ||
            (tr < level && (tl >= level || bl >= level || br >= level)) ||
            (bl < level && (tl >= level || tr >= level || br >= level)) ||
            (br < level && (tl >= level || tr >= level || bl >= level));
          
          if (crossesContour) {
            // 简化版：在网格边界上插值找到等高线点
            const points: Array<{x: number, y: number}> = [];
            
            // 检查四条边
            if ((tl < level && tr >= level) || (tl >= level && tr < level)) {
              const t = (level - tl) / (tr - tl);
              points.push({ x: x + gridSize * t, y });
            }
            if ((tr < level && br >= level) || (tr >= level && br < level)) {
              const t = (level - tr) / (br - tr);
              points.push({ x: x + gridSize, y: y + gridSize * t });
            }
            if ((bl < level && br >= level) || (bl >= level && br < level)) {
              const t = (level - bl) / (br - bl);
              points.push({ x: x + gridSize * t, y: y + gridSize });
            }
            if ((tl < level && bl >= level) || (tl >= level && bl < level)) {
              const t = (level - tl) / (bl - tl);
              points.push({ x, y: y + gridSize * t });
            }
            
            if (points.length >= 2) {
              contours.push(points);
            }
            
            visited.add(key);
          }
        }
      }
      
      return contours;
    };

    const animate = () => {
      timeRef.current += 16; // ~60fps
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 波纹中心位置（动态移动）
      const waveCenters: Array<{x: number, y: number}> = [];
      for (let i = 0; i < numWaves; i++) {
        const angle = (timeRef.current * waveSpeed * 0.5 + i * Math.PI * 2 / numWaves);
        const radius = 300;
        waveCenters.push({
          x: canvas.width / 2 + Math.cos(angle) * radius,
          y: canvas.height / 2 + Math.sin(angle) * radius
        });
      }

      // 绘制等高线
      for (let i = 0; i < elevationLevels; i++) {
        const level = (i / elevationLevels) * 2 - 1; // -1 到 1
        const contours = traceContour(level);
        
        // 绘制该高度的所有等高线段
        contours.forEach(points => {
          if (points.length < 2) return;
          
          // 计算这条线段受波纹影响的程度（使用线段中点）
          const midX = points.reduce((sum, p) => sum + p.x, 0) / points.length;
          const midY = points.reduce((sum, p) => sum + p.y, 0) / points.length;
          
          let maxInfluence = 0;
          for (const waveCenter of waveCenters) {
            const dx = midX - waveCenter.x;
            const dy = midY - waveCenter.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const influence = Math.max(0, 1 - distance / waveRadius);
            maxInfluence = Math.max(maxInfluence, influence);
          }
          
          // 根据影响程度混合颜色
          const color = interpolateColor(colors.base, colors.highlight, maxInfluence);
          
          ctx.strokeStyle = color;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          
          points.forEach((point, idx) => {
            if (idx === 0) {
              ctx.moveTo(point.x, point.y);
            } else {
              ctx.lineTo(point.x, point.y);
            }
          });
          
          ctx.stroke();
        });
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

// 颜色插值函数
function interpolateColor(color1: string, color2: string, factor: number): string {
  // 解析 rgba 或 hex 颜色
  const parseColor = (color: string): [number, number, number, number] => {
    if (color.startsWith('rgba')) {
      const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      if (match) {
        return [
          parseInt(match[1]),
          parseInt(match[2]),
          parseInt(match[3]),
          parseFloat(match[4] || '1')
        ];
      }
    } else if (color.startsWith('#')) {
      const hex = color.slice(1);
      return [
        parseInt(hex.slice(0, 2), 16),
        parseInt(hex.slice(2, 4), 16),
        parseInt(hex.slice(4, 6), 16),
        1
      ];
    }
    return [0, 0, 0, 1];
  };

  const c1 = parseColor(color1);
  const c2 = parseColor(color2);

  const r = Math.round(c1[0] + (c2[0] - c1[0]) * factor);
  const g = Math.round(c1[1] + (c2[1] - c1[1]) * factor);
  const b = Math.round(c1[2] + (c2[2] - c1[2]) * factor);
  const a = c1[3] + (c2[3] - c1[3]) * factor;

  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
