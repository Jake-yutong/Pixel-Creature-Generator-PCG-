import requests
import os

# 测试新的 Hugging Face API 端点
headers = {
    'Authorization': f'Bearer {os.getenv("HUGGINGFACE_TOKEN", "")}',
    'Content-Type': 'application/json'
}

print("🔍 测试新 API 端点...")
response = requests.post(
    'https://router.huggingface.co/hf-inference/stabilityai/stable-diffusion-2-1',
    headers=headers,
    json={'inputs': 'a red cat'},
    timeout=30
)

print(f"Status: {response.status_code}")
print(f"Content-Type: {response.headers.get('content-type', 'unknown')}")

if response.status_code == 200:
    print(f"✅ 成功！返回了 {len(response.content)} 字节数据")
    if 'image' in response.headers.get('content-type', ''):
        print("✅ 返回的是图片数据！")
    else:
        print(f"⚠️ 返回内容: {response.text[:200]}")
else:
    print(f"❌ 失败: {response.text}")
