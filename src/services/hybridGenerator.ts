// 混合生成器 - AI优先,本地保底
// Hybrid Generator - Try AI first, fallback to local fake generator

import { generateCreatureOffline } from './fakeGenerator';

interface AIVariation {
  name: string;
  description: string;
  colors: string[];
  personality: string;
}

interface GenerateResult {
  success: boolean;
  message: string;
  images: string[];
  audios: string[];
  prompt: string;
  method: string;
  aiEnhanced?: boolean;
  variations?: AIVariation[];
}

/**
 * 混合生成器 - 智能选择AI或本地生成
 * Hybrid generator - Smart selection between AI and local generation
 */
export async function generateCreatureHybrid(
  description: string,
  pixelSize: string = '32px',
  quantity: number = 4
): Promise<GenerateResult> {
  console.log('🎯 混合生成器启动 - Hybrid generator starting');
  console.log('📝 描述:', description, '| 数量:', quantity);

  // 步骤1: 尝试调用Netlify Function (AI增强)
  try {
    console.log('🤖 尝试AI增强生成...');
    
    const response = await fetch('/.netlify/functions/generate-creature-ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description, pixelSize, quantity })
    });

    if (response.ok) {
      const aiResult = await response.json();
      
      if (aiResult.success && !aiResult.useFallback) {
        console.log('✅ AI增强成功! 使用AI生成的变体');
        
        // 使用AI提供的变体信息生成像素艺术
        const localResult = await generateWithAIVariations(
          aiResult.variations,
          pixelSize,
          quantity
        );
        
        return {
          ...localResult,
          aiEnhanced: true,
          method: 'AI-Enhanced + Local Pixel Art',
          variations: aiResult.variations
        };
      } else {
        console.log('⚠️ AI要求使用fallback:', aiResult.message);
      }
    } else {
      console.log('⚠️ AI服务响应失败:', response.status);
    }
  } catch (error) {
    console.log('⚠️ AI服务调用失败:', error instanceof Error ? error.message : error);
  }

  // 步骤2: Fallback - 使用本地假AI生成器
  console.log('🎨 使用本地生成器 (Fallback)');
  const localResult = await generateCreatureOffline(description, pixelSize, quantity);
  
  return {
    ...localResult,
    aiEnhanced: false,
    method: 'Local Fake AI Generator (Fallback)'
  };
}

/**
 * 使用AI提供的变体信息生成像素艺术
 */
async function generateWithAIVariations(
  variations: AIVariation[],
  pixelSize: string,
  quantity: number
): Promise<GenerateResult> {
  const images: string[] = [];
  const audios: string[] = [];
  
  for (let i = 0; i < quantity && i < variations.length; i++) {
    const variation = variations[i];
    
    // 使用AI提供的描述和颜色信息生成
    const enhancedDesc = `${variation.name} ${variation.description} ${variation.personality}`;
    
    // 调用本地生成器,传递AI的颜色方案
    const result = await generateCreatureOffline(enhancedDesc, pixelSize, 1, variation.colors);
    
    if (result.success && result.images.length > 0) {
      images.push(result.images[0]);
      audios.push(result.audios?.[0] || '');
      console.log(`✅ AI变体 ${i + 1}/${quantity} 生成成功:`, variation.name);
    } else {
      console.log(`❌ AI变体 ${i + 1}/${quantity} 生成失败`);
      // 添加占位
      images.push('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
      audios.push('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=');
    }
  }

  return {
    success: true,
    message: `AI增强生成成功! (${images.length}个变体)`,
    images,
    audios,
    prompt: variations.map(v => v.name).join(', '),
    method: 'AI-Enhanced Pixel Art Generator'
  };
}
