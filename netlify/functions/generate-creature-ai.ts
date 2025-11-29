// Netlify Function - AI生成像素生物
// 使用OpenAI API生成创意描述和增强的生成参数
import { Handler, HandlerEvent } from '@netlify/functions';

interface GenerateRequest {
  description: string;
  pixelSize: string;
  quantity: number;
}

export const handler: Handler = async (event: HandlerEvent) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const body: GenerateRequest = JSON.parse(event.body || '{}');
    const { description, pixelSize, quantity } = body;

    // 检查是否配置了OpenAI API Key
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.log('⚠️ OpenAI API Key not configured, will use fallback');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: false,
          useFallback: true,
          message: 'AI service not configured, using local generator'
        })
      };
    }

    console.log('🤖 Using OpenAI to enhance generation:', description);

    // 调用OpenAI增强描述
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // 使用更经济的模型
        messages: [
          {
            role: 'system',
            content: 'You are a creative pixel art monster designer. Generate vivid, creative descriptions for pixel art monsters. Keep descriptions under 50 words, focus on visual details, colors, and personality.'
          },
          {
            role: 'user',
            content: `Create ${quantity} unique pixel monster variations based on: "${description}". Return as JSON array with fields: name, description, colors (array of 3-5 hex colors), personality (one word).`
          }
        ],
        temperature: 0.9,
        max_tokens: 500
      })
    });

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.status}`);
    }

    const aiData = await openaiResponse.json();
    const aiContent = aiData.choices[0].message.content;
    
    // 解析AI返回的JSON
    let variations;
    try {
      variations = JSON.parse(aiContent);
    } catch {
      // 如果AI没返回标准JSON,创建简单变体
      variations = Array.from({ length: quantity }, (_, i) => ({
        name: `${description} Variant ${i + 1}`,
        description: `A unique ${description} with special characteristics`,
        colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'],
        personality: 'fierce'
      }));
    }

    console.log('✅ AI generation successful:', variations.length, 'variations');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        useFallback: false,
        variations,
        message: 'AI-enhanced generation successful',
        method: 'OpenAI GPT-4o-mini'
      })
    };

  } catch (error) {
    console.error('❌ AI generation error:', error);
    
    // 返回失败,前端将使用fallback
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: false,
        useFallback: true,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'AI service failed, using local generator'
      })
    };
  }
};
