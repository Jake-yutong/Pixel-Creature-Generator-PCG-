from flask import Flask, request, jsonify
from flask_cors import CORS
import io
import base64
import random
import hashlib
import time
from PIL import Image, ImageDraw
import requests
import numpy as np
from scipy.io import wavfile

app = Flask(__name__)
CORS(app)  # 允许前端跨域访问

# 配置
USE_AI = True  # True: 使用真AI, False: 使用假生成器
HUGGINGFACE_TOKEN = os.getenv('HUGGINGFACE_TOKEN', '')  # 从环境变量读取
HUGGINGFACE_MODEL = "black-forest-labs/FLUX.1-schnell"  # 图片生成模型
AUDIO_MODEL = "facebook/musicgen-small"  # 音频生成模型
API_URL = f"https://router.huggingface.co/hf-inference/models/{HUGGINGFACE_MODEL}"
AUDIO_API_URL = f"https://api-inference.huggingface.co/models/{AUDIO_MODEL}"

def generate_audio_with_ai(description, duration=3.0):
    """使用 Hugging Face AI 生成音频"""
    try:
        print(f"🤖 使用真 AI 生成音频: {description}")
        
        # 构建音频提示词
        audio_prompt = f"creature sound, {description}, sound effect, short"
        
        headers = {
            "Authorization": f"Bearer {HUGGINGFACE_TOKEN}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "inputs": audio_prompt,
            "parameters": {
                "duration": duration,
                "temperature": 1.0,
                "top_k": 250,
                "top_p": 0.0,
                "max_new_tokens": 256
            }
        }
        
        print(f"📡 正在调用 Hugging Face Audio API...")
        response = requests.post(AUDIO_API_URL, headers=headers, json=payload, timeout=30)
        
        if response.status_code == 200:
            # 成功获取音频
            audio_bytes = response.content
            audio_base64 = base64.b64encode(audio_bytes).decode()
            print(f"✅ AI 音频生成成功！")
            return f'data:audio/wav;base64,{audio_base64}'
        else:
            print(f"⚠️ API返回错误: {response.status_code}")
            print(f"错误内容: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ AI 音频生成失败: {str(e)}")
        return None

def generate_creature_audio_fake(description, duration=3.0, sample_rate=44100):
    """根据描述生成怪物叫声 - 假音频生成器"""
    # 使用描述生成随机种子
    seed = int(hashlib.md5(description.encode()).hexdigest(), 16) % (2**32)
    np.random.seed(seed)
    
    # 分析描述词来决定音频特征
    desc_lower = description.lower()
    
    # 基础频率 (Hz)
    if any(word in desc_lower for word in ['big', 'large', 'giant', '大', '巨']):
        base_freq = np.random.randint(80, 150)  # 低沉
    elif any(word in desc_lower for word in ['small', 'tiny', 'little', '小', '迷你']):
        base_freq = np.random.randint(400, 800)  # 尖锐
    else:
        base_freq = np.random.randint(150, 400)  # 中等
    
    # 音色特征
    if any(word in desc_lower for word in ['scary', 'monster', 'evil', '恐怖', '邪恶', '怪物']):
        harmonics = [1, 1.5, 2.5, 3.5]  # 不和谐音
        noise_level = 0.3
    elif any(word in desc_lower for word in ['cute', 'friendly', 'happy', '可爱', '友好', '快乐']):
        harmonics = [1, 2, 3]  # 和谐音
        noise_level = 0.1
    elif any(word in desc_lower for word in ['magical', 'mystic', 'mysterious', '魔法', '神秘']):
        harmonics = [1, 1.5, 2, 3, 4]  # 复杂音色
        noise_level = 0.15
    else:
        harmonics = [1, 2, 2.5, 3]  # 默认
        noise_level = 0.2
    
    # 生成时间轴
    t = np.linspace(0, duration, int(sample_rate * duration))
    
    # 生成基础音调（多个谐波叠加）
    audio = np.zeros_like(t)
    for i, harmonic in enumerate(harmonics):
        amplitude = 0.3 / (i + 1)  # 高次谐波衰减
        audio += amplitude * np.sin(2 * np.pi * base_freq * harmonic * t)
    
    # 添加频率调制（颤音效果）
    vibrato_freq = np.random.uniform(4, 8)
    vibrato_depth = np.random.uniform(0.02, 0.08)
    audio *= (1 + vibrato_depth * np.sin(2 * np.pi * vibrato_freq * t))
    
    # 添加噪音
    noise = np.random.randn(len(t)) * noise_level
    audio += noise
    
    # 包络（淡入淡出）
    attack = int(sample_rate * 0.1)  # 0.1s 淡入
    release = int(sample_rate * 0.3)  # 0.3s 淡出
    envelope = np.ones_like(t)
    envelope[:attack] = np.linspace(0, 1, attack)
    envelope[-release:] = np.linspace(1, 0, release)
    audio *= envelope
    
    # 归一化到 int16 范围
    audio = np.int16(audio / np.max(np.abs(audio)) * 32767 * 0.8)
    
    # 转换为 base64
    buffer = io.BytesIO()
    wavfile.write(buffer, sample_rate, audio)
    audio_base64 = base64.b64encode(buffer.getvalue()).decode()
    
    return f'data:audio/wav;base64,{audio_base64}'

def text_to_color(text):
    """根据文字生成颜色"""
    import colorsys
    # 使用哈希确保相同文字总是生成相同颜色
    hash_val = int(hashlib.md5(text.encode()).hexdigest(), 16)
    random.seed(hash_val)
    
    # 根据关键词选择颜色主题
    desc_lower = text.lower()
    
    # 预设颜色主题
    if any(word in desc_lower for word in ['火', 'fire', '红', 'red', '热']):
        base_hue = random.randint(0, 30)  # 红橙色系
    elif any(word in desc_lower for word in ['水', 'water', '蓝', 'blue', '冰', 'ice']):
        base_hue = random.randint(180, 240)  # 蓝色系
    elif any(word in desc_lower for word in ['草', 'grass', '绿', 'green', '森林', 'forest']):
        base_hue = random.randint(90, 150)  # 绿色系
    elif any(word in desc_lower for word in ['紫', 'purple', '魔', 'magic', '暗', 'dark']):
        base_hue = random.randint(270, 300)  # 紫色系
    elif any(word in desc_lower for word in ['金', 'gold', '黄', 'yellow', '光', 'light']):
        base_hue = random.randint(40, 60)  # 黄色系
    else:
        base_hue = random.randint(0, 360)
    
    # 生成丰富的配色方案
    colors = []
    # 主色
    r, g, b = colorsys.hsv_to_rgb(base_hue/360, 0.8, 0.9)
    colors.append((int(r*255), int(g*255), int(b*255)))
    # 阴影色
    r, g, b = colorsys.hsv_to_rgb(base_hue/360, 0.9, 0.6)
    colors.append((int(r*255), int(g*255), int(b*255)))
    # 高光色
    r, g, b = colorsys.hsv_to_rgb(base_hue/360, 0.4, 1.0)
    colors.append((int(r*255), int(g*255), int(b*255)))
    # 对比色
    r, g, b = colorsys.hsv_to_rgb((base_hue + 180) % 360 / 360, 0.7, 0.8)
    colors.append((int(r*255), int(g*255), int(b*255)))
    # 装饰色
    r, g, b = colorsys.hsv_to_rgb((base_hue + 30) % 360 / 360, 0.6, 0.85)
    colors.append((int(r*255), int(g*255), int(b*255)))
    
    return colors

def generate_pixel_creature(description, size=64):
    """根据描述生成像素怪物 - 增强版"""
    # 使用描述生成随机种子，确保相同描述生成相同图像
    seed = int(hashlib.md5(description.encode()).hexdigest(), 16) % (2**32)
    random.seed(seed)
    
    # 创建图像
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # 获取颜色方案
    colors = text_to_color(description)
    main_color, shadow_color, highlight_color, contrast_color, deco_color = colors
    
    # 生成对称的像素怪物
    center_x = size // 2
    
    # 关键词检测，影响形状和特征
    desc_lower = description.lower()
    is_round = any(word in desc_lower for word in ['球', 'ball', '圆', 'round', '史莱姆', 'slime', '泡', 'bubble'])
    is_tall = any(word in desc_lower for word in ['高', 'tall', '长', 'long', '瘦', 'thin'])
    is_fat = any(word in desc_lower for word in ['胖', 'fat', '宽', 'wide', '大', 'big'])
    has_wings = any(word in desc_lower for word in ['翅膀', 'wing', '飞', 'fly', '天使', 'angel'])
    has_horns = any(word in desc_lower for word in ['角', 'horn', '恶魔', 'demon', '牛', 'bull'])
    is_cute = any(word in desc_lower for word in ['可爱', 'cute', '萌', 'kawaii', '小', 'small'])
    is_scary = any(word in desc_lower for word in ['恐怖', 'scary', '可怕', 'horror', '邪恶', 'evil'])
    has_tail = any(word in desc_lower for word in ['尾巴', 'tail', '龙', 'dragon'])
    has_ears = any(word in desc_lower for word in ['耳朵', 'ear', '兔', 'rabbit', '猫', 'cat'])
    is_robot = any(word in desc_lower for word in ['机器', 'robot', '机械', 'mechanical'])
    is_ghost = any(word in desc_lower for word in ['幽灵', 'ghost', '鬼', 'spirit'])
    has_fire = any(word in desc_lower for word in ['火', 'fire', '焰', 'flame'])
    has_crystals = any(word in desc_lower for word in ['水晶', 'crystal', '宝石', 'gem'])
    
    # 身体尺寸
    if is_tall:
        body_height = int(size * 0.7)
        body_width = size // 4
    elif is_fat:
        body_height = size // 3
        body_width = int(size * 0.4)
    else:
        body_height = size // 2
        body_width = size // 3
    
    body_y = size // 3
    
    # === 绘制身体 ===
    if is_round:
        # 圆形身体 + 阴影
        draw.ellipse([center_x - body_width + 2, body_y + 2, 
                     center_x + body_width + 2, body_y + body_height + 2], 
                    fill=shadow_color)  # 阴影
        draw.ellipse([center_x - body_width, body_y, 
                     center_x + body_width, body_y + body_height], 
                    fill=main_color)
        # 多层高光
        highlight_size = body_width // 3
        draw.ellipse([center_x - body_width//2, body_y + body_height//4,
                     center_x - body_width//2 + highlight_size, body_y + body_height//4 + highlight_size],
                    fill=highlight_color)
        # 小高光点
        draw.ellipse([center_x - body_width//3, body_y + body_height//5,
                     center_x - body_width//3 + 2, body_y + body_height//5 + 2],
                    fill=(255, 255, 255))
    elif is_robot:
        # 机器人方形身体 + 金属感
        draw.rectangle([center_x - body_width + 2, body_y + 2,
                       center_x + body_width + 2, body_y + body_height + 2],
                      fill=shadow_color)
        draw.rectangle([center_x - body_width, body_y,
                       center_x + body_width, body_y + body_height],
                      fill=main_color, outline=(100, 100, 100))
        # 金属线条
        for i in range(3):
            y_line = body_y + (body_height // 4) * (i + 1)
            draw.line([center_x - body_width + 2, y_line,
                      center_x + body_width - 2, y_line],
                     fill=highlight_color, width=1)
        # 方形高光
        draw.rectangle([center_x - body_width + 2, body_y + 2,
                       center_x - body_width//3, body_y + body_height//4],
                      fill=highlight_color)
    elif is_ghost:
        # 幽灵飘逸的身体
        # 半透明效果用多层绘制
        for offset in range(3):
            alpha = 150 - offset * 30
            ghost_color = main_color + (alpha,)
            draw.ellipse([center_x - body_width + offset, body_y + offset, 
                         center_x + body_width + offset, body_y + body_height + offset], 
                        fill=ghost_color)
        # 底部波浪
        wave_points = [(center_x - body_width, body_y + body_height),
                      (center_x - body_width//2, body_y + body_height + 5),
                      (center_x, body_y + body_height),
                      (center_x + body_width//2, body_y + body_height + 5),
                      (center_x + body_width, body_y + body_height)]
        draw.line(wave_points, fill=highlight_color, width=2)
    else:
        # 普通方形身体 + 阴影
        draw.rectangle([center_x - body_width + 2, body_y + 2,
                       center_x + body_width + 2, body_y + body_height + 2],
                      fill=shadow_color)
        draw.rectangle([center_x - body_width, body_y,
                       center_x + body_width, body_y + body_height],
                      fill=main_color)
        # 高光
        draw.rectangle([center_x - body_width + 3, body_y + 3,
                       center_x - body_width//2, body_y + body_height//3],
                      fill=highlight_color)
        # 边缘高光线
        draw.line([center_x - body_width, body_y,
                  center_x - body_width, body_y + body_height//2],
                 fill=highlight_color, width=1)
    
    # === 绘制角 ===
    if has_horns:
        horn_points_left = [(center_x - body_width + 3, body_y),
                           (center_x - body_width, body_y - 8),
                           (center_x - body_width + 5, body_y)]
        horn_points_right = [(center_x + body_width - 3, body_y),
                            (center_x + body_width, body_y - 8),
                            (center_x + body_width - 5, body_y)]
        draw.polygon(horn_points_left, fill=contrast_color, outline=shadow_color)
        draw.polygon(horn_points_right, fill=contrast_color, outline=shadow_color)
    
    # === 绘制耳朵 ===
    if has_ears:
        # 长耳朵
        ear_left = [(center_x - body_width + 2, body_y + 5),
                   (center_x - body_width - 3, body_y - 5),
                   (center_x - body_width + 5, body_y + 3)]
        ear_right = [(center_x + body_width - 2, body_y + 5),
                    (center_x + body_width + 3, body_y - 5),
                    (center_x + body_width - 5, body_y + 3)]
        draw.polygon(ear_left, fill=deco_color, outline=contrast_color)
        draw.polygon(ear_right, fill=deco_color, outline=contrast_color)
        # 耳朵内侧
        draw.ellipse([center_x - body_width, body_y - 2,
                     center_x - body_width + 2, body_y], fill=highlight_color)
        draw.ellipse([center_x + body_width - 2, body_y - 2,
                     center_x + body_width, body_y], fill=highlight_color)
    
    # === 绘制眼睛 ===
    eye_y = body_y + body_height // 4
    if is_cute:
        # 可爱的大眼睛
        eye_size = 5
        eye_spacing = 10
        # 白色眼白
        draw.ellipse([center_x - eye_spacing - eye_size, eye_y, 
                     center_x - eye_spacing, eye_y + eye_size], fill=(255, 255, 255))
        draw.ellipse([center_x + eye_spacing, eye_y, 
                     center_x + eye_spacing + eye_size, eye_y + eye_size], fill=(255, 255, 255))
        # 黑色瞳孔
        pupil_size = 2
        draw.ellipse([center_x - eye_spacing - pupil_size, eye_y + 1, 
                     center_x - eye_spacing, eye_y + 1 + pupil_size], fill=(0, 0, 0))
        draw.ellipse([center_x + eye_spacing + 1, eye_y + 1, 
                     center_x + eye_spacing + 1 + pupil_size, eye_y + 1 + pupil_size], fill=(0, 0, 0))
        # 高光点
        draw.rectangle([center_x - eye_spacing - 1, eye_y + 1,
                       center_x - eye_spacing, eye_y + 2], fill=(255, 255, 255))
        draw.rectangle([center_x + eye_spacing + 2, eye_y + 1,
                       center_x + eye_spacing + 3, eye_y + 2], fill=(255, 255, 255))
    elif is_scary:
        # 恐怖的眼睛
        eye_size = 4
        draw.ellipse([center_x - 10, eye_y, center_x - 10 + eye_size, eye_y + eye_size], fill=(255, 0, 0))
        draw.ellipse([center_x + 6, eye_y, center_x + 6 + eye_size, eye_y + eye_size], fill=(255, 0, 0))
        # 发光效果
        draw.ellipse([center_x - 11, eye_y - 1, center_x - 9 + eye_size, eye_y + 1 + eye_size], 
                    fill=(255, 100, 100, 100))
        draw.ellipse([center_x + 5, eye_y - 1, center_x + 7 + eye_size, eye_y + 1 + eye_size], 
                    fill=(255, 100, 100, 100))
    else:
        # 普通眼睛
        eye_size = 4
        draw.ellipse([center_x - 9, eye_y, center_x - 9 + eye_size, eye_y + eye_size], fill=(255, 255, 255))
        draw.ellipse([center_x + 5, eye_y, center_x + 5 + eye_size, eye_y + eye_size], fill=(255, 255, 255))
        draw.ellipse([center_x - 8, eye_y + 1, center_x - 8 + 2, eye_y + 3], fill=(0, 0, 0))
        draw.ellipse([center_x + 6, eye_y + 1, center_x + 6 + 2, eye_y + 3], fill=(0, 0, 0))
    
    # === 绘制嘴巴 ===
    mouth_y = eye_y + 10
    if is_cute:
        # 微笑
        draw.arc([center_x - 6, mouth_y, center_x + 6, mouth_y + 6], 0, 180, fill=contrast_color, width=2)
    elif is_scary:
        # 锯齿嘴
        teeth_points = [(center_x - 8, mouth_y), (center_x - 6, mouth_y + 4), (center_x - 4, mouth_y),
                       (center_x - 2, mouth_y + 4), (center_x, mouth_y), (center_x + 2, mouth_y + 4),
                       (center_x + 4, mouth_y), (center_x + 6, mouth_y + 4), (center_x + 8, mouth_y)]
        draw.line(teeth_points, fill=contrast_color, width=2)
    else:
        # 普通嘴巴
        draw.line([center_x - 6, mouth_y, center_x + 6, mouth_y], fill=contrast_color, width=2)
    
    # === 绘制翅膀 ===
    if has_wings:
        # 更精致的翅膀
        wing_points_left = [(center_x - body_width, body_y + 8),
                           (center_x - body_width - 12, body_y + 5),
                           (center_x - body_width - 10, body_y + 15),
                           (center_x - body_width, body_y + 18)]
        wing_points_right = [(center_x + body_width, body_y + 8),
                            (center_x + body_width + 12, body_y + 5),
                            (center_x + body_width + 10, body_y + 15),
                            (center_x + body_width, body_y + 18)]
        draw.polygon(wing_points_left, fill=deco_color, outline=contrast_color)
        draw.polygon(wing_points_right, fill=deco_color, outline=contrast_color)
        # 翅膀纹理
        draw.line([center_x - body_width - 2, body_y + 10,
                  center_x - body_width - 8, body_y + 8], fill=highlight_color, width=1)
        draw.line([center_x + body_width + 2, body_y + 10,
                  center_x + body_width + 8, body_y + 8], fill=highlight_color, width=1)
    
    # === 绘制尾巴 ===
    if has_tail:
        tail_points = [(center_x, body_y + body_height),
                      (center_x + 3, body_y + body_height + 8),
                      (center_x + 5, body_y + body_height + 15),
                      (center_x + 2, body_y + body_height + 8)]
        draw.polygon(tail_points, fill=deco_color, outline=contrast_color)
    
    # === 绘制火焰效果 ===
    if has_fire:
        # 身体周围的火焰
        for i in range(4):
            angle = i * 90
            if angle == 0:  # 上方
                flame_x, flame_y = center_x, body_y - 5
            elif angle == 90:  # 右侧
                flame_x, flame_y = center_x + body_width + 3, body_y + body_height // 2
            elif angle == 180:  # 下方
                flame_x, flame_y = center_x, body_y + body_height + 3
            else:  # 左侧
                flame_x, flame_y = center_x - body_width - 3, body_y + body_height // 2
            
            # 火焰形状
            flame = [(flame_x, flame_y), (flame_x - 2, flame_y + 4), 
                    (flame_x, flame_y + 6), (flame_x + 2, flame_y + 4)]
            draw.polygon(flame, fill=(255, 150, 0))
            # 内焰
            inner_flame = [(flame_x, flame_y + 1), (flame_x - 1, flame_y + 3),
                          (flame_x, flame_y + 4), (flame_x + 1, flame_y + 3)]
            draw.polygon(inner_flame, fill=(255, 255, 0))
    
    # === 绘制水晶装饰 ===
    if has_crystals:
        # 身体上的水晶
        for i in range(3):
            crystal_x = center_x - body_width + (body_width * 2 * i // 3)
            crystal_y = body_y + body_height // 4 + (i * 5)
            crystal = [(crystal_x, crystal_y), (crystal_x - 2, crystal_y + 3),
                      (crystal_x, crystal_y + 5), (crystal_x + 2, crystal_y + 3)]
            draw.polygon(crystal, fill=highlight_color, outline=(200, 200, 255))
            # 水晶高光
            draw.rectangle([crystal_x - 1, crystal_y + 1,
                          crystal_x, crystal_y + 2], fill=(255, 255, 255))
    
    # === 绘制装饰图案 ===
    num_patterns = random.randint(5, 12)
    for _ in range(num_patterns):
        x = random.randint(center_x - body_width + 3, center_x + body_width - 3)
        y = random.randint(body_y + 3, body_y + body_height - 3)
        pattern_type = random.randint(0, 2)
        if pattern_type == 0:
            # 圆点
            draw.ellipse([x, y, x + 2, y + 2], fill=deco_color)
        elif pattern_type == 1:
            # 方块
            draw.rectangle([x, y, x + 2, y + 2], fill=highlight_color)
        else:
            # 星星效果
            draw.rectangle([x, y, x + 1, y + 1], fill=highlight_color)
            draw.rectangle([x - 1, y, x, y + 1], fill=deco_color)
            draw.rectangle([x + 1, y, x + 2, y + 1], fill=deco_color)
    
    # 放大到 512x512 使用最近邻插值创建像素效果
    img_large = img.resize((512, 512), Image.Resampling.NEAREST)
    
    return img_large

def pixelate_image(img, pixel_size=16):
    """将图片转换为像素风格"""
    # 获取原始尺寸
    width, height = img.size
    
    # 缩小到像素尺寸
    small_img = img.resize(
        (width // pixel_size, height // pixel_size),
        Image.Resampling.BILINEAR
    )
    
    # 放大回原尺寸,使用最近邻插值保持像素效果
    pixelated = small_img.resize(
        (width, height),
        Image.Resampling.NEAREST
    )
    
    return pixelated

def generate_with_ai(description, seed=None, pixel_size=8):
    """使用 Hugging Face Inference API 生成真AI图像"""
    try:
        print(f"🤖 使用真AI生成: {description}")
        
        # 自动在描述中添加像素风格提示
        pixel_prompt = f"pixel art style, {description}, retro game art, 8-bit style"
        
        headers = {
            "Authorization": f"Bearer {HUGGINGFACE_TOKEN}"
        }
        
        payload = {
            "inputs": pixel_prompt,
            "parameters": {
                "num_inference_steps": 4,  # FLUX.1-schnell 只需要4步,超快!
            }
        }
        
        # 如果提供了seed，添加到参数中以确保生成不同的图片
        if seed is not None:
            payload["parameters"]["seed"] = seed
            print(f"🎲 使用随机种子: {seed}")
        
        print(f"📡 正在调用 Hugging Face API...")
        print(f"🎨 提示词: {pixel_prompt}")
        response = requests.post(API_URL, headers=headers, json=payload, timeout=60)
        
        if response.status_code == 200:
            # 成功获取图片
            img = Image.open(io.BytesIO(response.content))
            print(f"✅ AI生成成功! 图片尺寸: {img.size}")
            
            # 调整大小到512x512
            img = img.resize((512, 512), Image.Resampling.LANCZOS)
            
            # 转换为像素风格
            print(f"🎮 正在转换为像素风格... (像素块大小: {pixel_size}px)")
            img = pixelate_image(img, pixel_size=pixel_size)
            print("✨ 像素化完成!")
            
            return img
        else:
            print(f"⚠️ API返回错误: {response.status_code}")
            print(f"错误内容: {response.text[:200]}")
            return None
        
        return None
        
    except Exception as e:
        print(f"⚠️ AI生成失败: {str(e)}")
        print("🔄 切换到假生成器...")
        return None

@app.route('/api/hello', methods=['GET'])
def hello():
    """测试接口 - 确认后端是否运行"""
    return jsonify({
        'status': 'ok',
        'message': 'Python 后端正在运行！'
    })

@app.route('/api/generate', methods=['POST'])
def generate_creature():
    """生成怪物的接口 - 根据quantity生成不同数量的图片"""
    data = request.json
    description = data.get('description', '')
    pixel_size_str = data.get('pixelSize', '32px')
    quantity = data.get('quantity', 4)  # 默认4张
    
    # 将像素大小字符串转换为数字
    pixel_size = int(pixel_size_str.replace('px', ''))
    
    if not description:
        return jsonify({
            'success': False,
            'message': '请输入怪物描述'
        }), 400
    
    print(f"🎨 收到生成请求：{description}")
    print(f"📐 像素大小：{pixel_size}px")
    print(f"🔢 生成数量：{quantity}张")
    print(f"🔄 准备生成{quantity}张不同的变体...")
    
    try:
        images = []
        
        # 根据quantity生成对应数量的图片
        for i in range(quantity):
            print(f"\n📸 正在生成第 {i+1}/{quantity} 张图片...")
            img = None
            
            # 为每张图片使用更明显的不同提示词和随机种子
            style_variations = [
                "cute and friendly",
                "scary and menacing", 
                "mysterious and magical",
                "funny and quirky"
            ]
            
            pose_variations = [
                "standing pose",
                "action pose",
                "side view",
                "dynamic pose"
            ]
            
            # 为每个变体创建独特的描述（使用模运算避免越界）
            style = style_variations[i % len(style_variations)]
            pose = pose_variations[i % len(pose_variations)]
            current_prompt = f"{description}, {style}, {pose}"
            
            # 生成随机种子确保每次都不同
            import time
            random_seed = int(time.time() * 1000) + i * 12345 + random.randint(0, 100000)
            
            print(f"🎨 变体 {i+1} 提示词: {current_prompt}")
            
            # 尝试使用AI生成
            if USE_AI:
                img = generate_with_ai(current_prompt, seed=random_seed, pixel_size=pixel_size)
            
            # 如果AI失败或不使用AI,用假生成器
            if img is None:
                print(f"⏳ 使用假生成器生成第 {i+1} 张...")
                # 为假生成器添加一些随机性
                seed_modifier = f"{description}_{i}"
                img = generate_pixel_creature(seed_modifier, size=pixel_size)
            
            # 转换为 base64
            buffered = io.BytesIO()
            img.save(buffered, format="PNG")
            img_str = base64.b64encode(buffered.getvalue()).decode()
            
            images.append(f'data:image/png;base64,{img_str}')
            print(f"✅ 第 {i+1}/{quantity} 张生成成功！")
        
        print(f"\n🎉 全部{len(images)}张图片生成完成！")
        
        # 只为成功生成的图片生成对应的音频
        print(f"\n🔊 开始生成音频...")
        audios = []
        for i in range(len(images)):  # 只为实际生成的图片数量生成音频
            print(f"🎵 正在生成第 {i+1}/{len(images)} 个音频...")
            # 为每个音频使用不同的描述确保独特性
            audio_description = f"{description}, variation {i+1}"
            
            # 尝试使用 AI 生成音频
            audio_base64 = None
            if USE_AI:
                audio_base64 = generate_audio_with_ai(audio_description)
            
            # 如果 AI 失败或不使用 AI，使用假生成器
            if audio_base64 is None:
                print(f"⏳ 使用假生成器生成音频...")
                audio_base64 = generate_creature_audio_fake(audio_description)
            
            audios.append(audio_base64)
            print(f"✅ 第 {i+1}/{len(images)} 个音频生成成功！")
        
        print(f"\n🎊 全部生成完成！{len(images)}张图片 + {len(audios)}个音频")
        
        return jsonify({
            'success': True,
            'message': '生成成功！',
            'images': images,  # 返回quantity数量的图片数组
            'audios': audios,  # 返回quantity数量的音频数组
            'prompt': description,
            'method': 'AI' if USE_AI else 'Fake Generator'
        })
        
    except Exception as e:
        print(f"❌ 生成出错: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'message': f'生成失败: {str(e)}'
        }), 500

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    print("🚀 后端服务器启动中...")
    print(f"📍 服务地址：http://0.0.0.0:{port}")
    print("✅ 准备接收前端请求！")
    app.run(host='0.0.0.0', port=port, debug=False)
