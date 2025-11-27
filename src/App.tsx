import { useState, useEffect } from "react";
import { CreatureGenerator } from "./components/CreatureGenerator";
import { AssetCard, PixelLeftArrow, PixelRightArrow } from "./components/AssetCard";
import { LoadingAnimation } from "./components/LoadingAnimation";
import { FavoritesModal } from "./components/FavoritesModal";
import { ContourBackground } from "./components/ContourBackground";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";
import { Settings, Heart } from "lucide-react";
import { generateCreature, checkBackend } from "./services/api";

export type Theme = 'dark' | 'light';

export default function App() {
  // UI 状态 - 不需要持久化
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [expandedCardIndex, setExpandedCardIndex] = useState<number | null>(null);
  const [animationKey, setAnimationKey] = useState(0);
  const [theme, setTheme] = useState<Theme>('dark');
  
  // 持久化数据 - 保存到 localStorage
  const [favoritesData, setFavoritesData] = useState<Array<{id: number, image: string, audio: string}>>(() => {
    const saved = localStorage.getItem('favoritesData');
    const data = saved ? JSON.parse(saved) : [];
    console.log('📦 从 localStorage 加载收藏数据:', data.length, '个');
    return data;
  });
  
  // 当前会话的收藏标记
  const [favoriteCards, setFavoriteCards] = useState<Set<number>>(new Set());
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>(() => {
    // 从 localStorage 加载生成的图片
    const saved = localStorage.getItem('generatedImages');
    return saved ? JSON.parse(saved) : [];
  });
  const [generatedAudios, setGeneratedAudios] = useState<string[]>(() => {
    // 从 localStorage 加载生成的音频
    const saved = localStorage.getItem('generatedAudios');
    return saved ? JSON.parse(saved) : [];
  });
  const [userInput, setUserInput] = useState<string>(''); // 存储用户输入
  const [lastPixelSize, setLastPixelSize] = useState<string>('32px'); // 存储上次的像素大小
  const [lastQuantity, setLastQuantity] = useState<number>(4); // 存储上次的生成数量
  const [backendStatus, setBackendStatus] = useState<string>('检查中...'); // 后端状态
  const [currentPage, setCurrentPage] = useState(0); // 当前页码（0或1）

  // 保存收藏数据到 localStorage
  useEffect(() => {
    console.log('💾 保存收藏数据到 localStorage:', favoritesData.length, '个');
    localStorage.setItem('favoritesData', JSON.stringify(favoritesData));
  }, [favoritesData]);

  // 保存生成的图片和音频到 localStorage
  useEffect(() => {
    localStorage.setItem('generatedImages', JSON.stringify(generatedImages));
  }, [generatedImages]);

  useEffect(() => {
    localStorage.setItem('generatedAudios', JSON.stringify(generatedAudios));
  }, [generatedAudios]);

  // 页面加载时检查后端是否在线
  useEffect(() => {
    checkBackend().then(isOnline => {
      setBackendStatus(isOnline ? '✅ 后端已连接' : '❌ 后端未连接');
    });
  }, []);

  // 同步当前生成图片的收藏状态（根据 favoritesData）
  useEffect(() => {
    const newFavorites = new Set<number>();
    if (generatedImages.length > 0) {
      generatedImages.forEach((image, index) => {
        const cardNumber = index + 1;
        // 检查该图片是否在收藏数据中
        const isFavorited = favoritesData.some(item => item.image === image);
        if (isFavorited) {
          newFavorites.add(cardNumber);
        }
      });
    }
    setFavoriteCards(newFavorites);
  }, [generatedImages, favoritesData]);

  const handleGenerate = async (description: string, pixelSize: string = '32px', quantity: number = 4) => {
    if (!description.trim()) {
      alert('请输入怪物描述！');
      return;
    }

    setUserInput(description);
    setLastPixelSize(pixelSize); // 保存参数
    setLastQuantity(quantity); // 保存参数
    setIsGenerating(true);
    setIsPaused(false);
    setIsCompleted(false);
    setGeneratedImages([]); // 清空之前的图片
    setGeneratedAudios([]); // 清空之前的音频
    // 不清空 favoriteCards，让 useEffect 自动同步
    setCurrentPage(0); // 重置到第一页
    
    try {
      console.log('🎨 开始生成怪物变体:', description, '像素大小:', pixelSize, '数量:', quantity);
      
      // 调用真实的后端 API
      const result = await generateCreature(description, pixelSize, quantity);
      
      if (result.success && result.images) {
        console.log('📦 收到的数据:', result);
        console.log('📦 图片数组长度:', result.images.length);
        console.log('📦 音频数组长度:', result.audios?.length || 0);
        setGeneratedImages(result.images); // 设置图片
        setGeneratedAudios(result.audios || []); // 设置音频
        setIsCompleted(true);
        console.log(`✅ ${result.images.length}张图片 + ${result.audios?.length || 0}个音频生成成功!`);
      } else {
        alert('生成失败：' + (result.message || '未知错误'));
        setIsCompleted(false);
      }
    } catch (error) {
      console.error('生成出错:', error);
      alert('连接后端失败，请确保 Python 服务器正在运行！');
      setIsCompleted(false);
    } finally {
      setIsGenerating(false);
      setIsPaused(false);
    }
  };

  const handlePauseToggle = () => {
    setIsPaused(!isPaused);
    if (!isPaused) {
      // Pausing
      setIsGenerating(false);
    } else {
      // Resuming
      setIsGenerating(true);
      setTimeout(() => {
        setIsGenerating(false);
        setIsCompleted(true);
      }, 2000);
    }
  };

  const handleRegenerate = () => {
    // 重新生成：使用上次的描述和参数再次调用生成函数
    if (userInput.trim()) {
      handleGenerate(userInput, lastPixelSize, lastQuantity);
    }
  };

  const handlePrevCard = () => {
    if (expandedCardIndex !== null) {
      const newIndex = expandedCardIndex === 0 ? 3 : expandedCardIndex - 1;
      setExpandedCardIndex(newIndex);
      setAnimationKey(prev => prev + 1);
    }
  };

  const handleNextCard = () => {
    if (expandedCardIndex !== null) {
      const newIndex = expandedCardIndex === 3 ? 0 : expandedCardIndex + 1;
      setExpandedCardIndex(newIndex);
      setAnimationKey(prev => prev + 1);
    }
  };

  const toggleFavorite = (cardNumber: number) => {
    const cardIndex = cardNumber - 1;
    const image = generatedImages[cardIndex];
    const audio = generatedAudios[cardIndex];
    
    if (!image) return; // 如果没有图片，不执行收藏操作
    
    setFavoriteCards(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(cardNumber)) {
        // 取消收藏
        newFavorites.delete(cardNumber);
        setFavoritesData(prevData => prevData.filter(item => !(item.id === cardNumber && item.image === image)));
      } else {
        // 添加收藏
        newFavorites.add(cardNumber);
        // 检查是否已经存在相同的图片（避免重复收藏）
        setFavoritesData(prevData => {
          const isDuplicate = prevData.some(item => item.image === image);
          if (isDuplicate) {
            console.log('⚠️ 该图片已被收藏，跳过添加');
            return prevData;
          }
          console.log('❤️ 添加收藏，当前总数:', prevData.length + 1);
          return [...prevData, { id: cardNumber, image, audio: audio || '' }];
        });
      }
      return newFavorites;
    });
  };
  
  // 从收藏夹中取消收藏（用于 FavoritesModal）
  const toggleFavoriteFromModal = (cardId: number, cardImage: string) => {
    setFavoritesData(prevData => prevData.filter(item => !(item.id === cardId && item.image === cardImage)));
    
    // 同时更新 favoriteCards 状态
    setFavoriteCards(prev => {
      const newFavorites = new Set(prev);
      // 检查当前生成的图片中是否有匹配的
      const cardIndex = generatedImages.findIndex(img => img === cardImage);
      if (cardIndex !== -1 && cardIndex + 1 === cardId) {
        newFavorites.delete(cardId);
      }
      return newFavorites;
    });
  };

  // 下载图片和音频（用于当前生成的图片）
  const handleDownload = (cardIndex: number) => {
    const imageData = generatedImages[cardIndex];
    const audioData = generatedAudios[cardIndex];
    
    // 下载图片
    if (imageData) {
      const link = document.createElement('a');
      link.href = imageData;
      link.download = `creature-${cardIndex + 1}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    
    // 下载音频
    if (audioData) {
      const link = document.createElement('a');
      link.href = audioData;
      link.download = `creature-${cardIndex + 1}-audio-${Date.now()}.wav`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // 下载收藏的图片和音频
  const handleDownloadFavorite = (image: string, audio: string, id: number) => {
    // 下载图片
    if (image) {
      const link = document.createElement('a');
      link.href = image;
      link.download = `favorite-creature-${id}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    
    // 下载音频
    if (audio) {
      const link = document.createElement('a');
      link.href = audio;
      link.download = `favorite-creature-${id}-audio-${Date.now()}.wav`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const colors = theme === 'dark' ? {
    bg: '#1a1a1a',
    cardBg: '#2a2a2a',
    previewBg: '#2a2a2a',
    text: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.6)',
    textTertiary: 'rgba(255, 255, 255, 0.3)',
    border: 'rgba(234, 234, 234, 0.3)',
    borderHover: '#FFFFFF',
    inputBg: '#1a1a1a',
    loadingBg: '#1a1a1a',
    pixelBg: '#2a2a2a',
  } : {
    bg: '#F0F0F0',
    cardBg: '#FFFFFF',
    previewBg: '#F5F5F5',
    text: '#000000',
    textSecondary: '#666666',
    textTertiary: '#999999',
    border: '#EAEAEA',
    borderHover: '#000000',
    inputBg: '#FFFFFF',
    loadingBg: '#FFFFFF',
    pixelBg: '#F5F5F5',
  };

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: colors.bg }}>
      {/* Contour Background */}
      <ContourBackground theme={theme} />
      
      {/* Blur Overlay */}
      {expandedCardIndex !== null && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 transition-all duration-500"
          onClick={() => setExpandedCardIndex(null)}
        />
      )}

      {/* Expanded Card - Rendered at root level */}
      {expandedCardIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none animate-modalFadeIn">
          {/* Left Arrow */}
          <button
            onClick={handlePrevCard}
            className="absolute left-8 top-1/2 -translate-y-1/2 pointer-events-auto w-12 h-12 border flex items-center justify-center transition-all z-10"
            style={{ 
              borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.3)',
              backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.8)',
              borderRadius: '8px',
              boxShadow: theme === 'dark'
                ? '0 0 0 1px rgba(255, 255, 255, 0.1), 0 0 12px rgba(255, 255, 255, 0.05)'
                : '0 0 0 1px rgba(0, 0, 0, 0.08), 0 0 16px rgba(0, 0, 0, 0.1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.5)';
              e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.95)';
              e.currentTarget.style.boxShadow = theme === 'dark'
                ? '0 0 0 1px rgba(255, 255, 255, 0.2), 0 0 20px rgba(255, 255, 255, 0.1)'
                : '0 0 0 1px rgba(0, 0, 0, 0.12), 0 0 24px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.3)';
              e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.8)';
              e.currentTarget.style.boxShadow = theme === 'dark'
                ? '0 0 0 1px rgba(255, 255, 255, 0.1), 0 0 12px rgba(255, 255, 255, 0.05)'
                : '0 0 0 1px rgba(0, 0, 0, 0.08), 0 0 16px rgba(0, 0, 0, 0.1)';
            }}
          >
            <PixelLeftArrow theme={theme} />
          </button>

          {/* Card */}
          <div key={animationKey} className="pointer-events-auto animate-modalScaleIn">
            <AssetCard 
              cardNumber={expandedCardIndex + 1}
              isExpanded={true}
              onExpand={() => {}}
              onClose={() => setExpandedCardIndex(null)}
              theme={theme}
              isFavorited={favoriteCards.has(expandedCardIndex + 1)}
              onToggleFavorite={() => toggleFavorite(expandedCardIndex + 1)}
              generatedImage={generatedImages[expandedCardIndex]} // 传递对应的图片
              generatedAudio={generatedAudios[expandedCardIndex]} // 传递对应的音频
              onDownload={() => handleDownload(expandedCardIndex)} // 添加下载功能
            />
          </div>

          {/* Right Arrow */}
          <button
            onClick={handleNextCard}
            className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-auto w-12 h-12 border flex items-center justify-center transition-all z-10"
            style={{ 
              borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.3)',
              backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.8)',
              borderRadius: '8px',
              boxShadow: theme === 'dark'
                ? '0 0 0 1px rgba(255, 255, 255, 0.1), 0 0 12px rgba(255, 255, 255, 0.05)'
                : '0 0 0 1px rgba(0, 0, 0, 0.08), 0 0 16px rgba(0, 0, 0, 0.1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.5)';
              e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.95)';
              e.currentTarget.style.boxShadow = theme === 'dark'
                ? '0 0 0 1px rgba(255, 255, 255, 0.2), 0 0 20px rgba(255, 255, 255, 0.1)'
                : '0 0 0 1px rgba(0, 0, 0, 0.12), 0 0 24px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.3)';
              e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.8)';
              e.currentTarget.style.boxShadow = theme === 'dark'
                ? '0 0 0 1px rgba(255, 255, 255, 0.1), 0 0 12px rgba(255, 255, 255, 0.05)'
                : '0 0 0 1px rgba(0, 0, 0, 0.08), 0 0 16px rgba(0, 0, 0, 0.1)';
            }}
          >
            <PixelRightArrow theme={theme} />
          </button>
        </div>
      )}

      {/* Header */}
      <header className={`px-12 py-6 transition-all duration-500 ${
        expandedCardIndex !== null ? 'blur-sm' : ''
      }`} style={{ borderBottom: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}` }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2" style={{ backgroundColor: colors.text }}></div>
              <span className="tracking-wider font-['Inter']" style={{ color: colors.text }}>CREATURE GENERATOR</span>
              {/* 后端状态显示 */}
              <span className="text-xs font-['Inter'] ml-4 px-3 py-1 rounded-full" style={{ 
                backgroundColor: backendStatus.includes('✅') ? 'rgba(76, 175, 80, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                color: backendStatus.includes('✅') ? '#4CAF50' : '#EF4444'
              }}>
                {backendStatus}
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Favorites Button */}
              <button 
                onClick={() => setIsFavoritesOpen(true)}
                className="flex items-center gap-2 px-4 py-2 hover:opacity-70 transition-opacity"
              >
                <Heart className="w-4 h-4" style={{ color: colors.text }} />
                <span className="font-['Inter'] text-sm" style={{ color: colors.text }}>Favorites</span>
                {favoritesData.length > 0 && (
                  <span 
                    className="px-2 py-0.5 rounded-full text-xs font-['Inter']"
                    style={{ 
                      backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                      color: colors.text
                    }}
                  >
                    {favoritesData.length}
                  </span>
                )}
              </button>

              {/* Preferences Dropdown */}
              <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-4 py-2 hover:opacity-70 transition-opacity">
                  <Settings className="w-4 h-4" style={{ color: colors.text }} />
                  <span className="font-['Inter'] text-sm" style={{ color: colors.text }}>Preferences</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                <div className="px-2 py-1.5">
                  <div className="text-xs font-['Inter']" style={{ color: colors.textTertiary }}>THEME</div>
                </div>
                <DropdownMenuItem 
                  onClick={() => setTheme('dark')}
                  className="font-['Inter']"
                  style={{ 
                    color: colors.text,
                    backgroundColor: theme === 'dark' ? (theme === 'dark' ? 'rgba(234, 234, 234, 0.1)' : 'rgba(0, 0, 0, 0.05)') : 'transparent'
                  }}
                >
                  <span className="flex items-center gap-2">
                    {theme === 'dark' && <span className="w-1.5 h-1.5 rounded-full bg-[#FFFF00]"></span>}
                    Dark Mode
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setTheme('light')}
                  className="font-['Inter']"
                  style={{ 
                    color: colors.text,
                    backgroundColor: theme === 'light' ? (theme === 'dark' ? 'rgba(234, 234, 234, 0.1)' : 'rgba(0, 0, 0, 0.05)') : 'transparent'
                  }}
                >
                  <span className="flex items-center gap-2">
                    {theme === 'light' && <span className="w-1.5 h-1.5 rounded-full bg-[#FFFF00]"></span>}
                    Light Mode
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Favorites Modal */}
      <FavoritesModal
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        theme={theme}
        favoritesData={favoritesData}
        onToggleFavorite={(cardId: number, cardImage: string) => toggleFavoriteFromModal(cardId, cardImage)}
        onDownload={handleDownloadFavorite}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-12 py-16">
        <div className="grid grid-cols-[40%_60%] gap-12">
          {/* Left Column - Generator Form */}
          <div 
            className={`rounded-3xl p-8 backdrop-blur-xl transition-all duration-500 ${
              expandedCardIndex !== null ? 'blur-sm' : ''
            }`}
            style={{ 
              backgroundColor: theme === 'dark' ? 'rgba(42, 42, 42, 0.4)' : 'rgba(255, 255, 255, 0.5)',
            }}
          >
            <CreatureGenerator 
              onGenerate={handleGenerate} 
              isGenerating={isGenerating}
              isPaused={isPaused}
              isCompleted={isCompleted}
              onPauseToggle={handlePauseToggle}
              onRegenerate={handleRegenerate}
              theme={theme}
            />
          </div>

          {/* Right Column - Preview Area with 2x2 Grid */}
          <div 
            className="rounded-3xl p-8 backdrop-blur-xl" 
            style={{ backgroundColor: theme === 'dark' ? 'rgba(42, 42, 42, 0.4)' : 'rgba(255, 255, 255, 0.5)' }}
          >
            <div className="grid grid-cols-2 gap-6 animate-fadeIn">
              <AssetCard 
                cardNumber={1}
                isExpanded={false}
                onExpand={() => setExpandedCardIndex(0)}
                onClose={() => setExpandedCardIndex(null)}
                theme={theme}
                isFavorited={favoriteCards.has(1)}
                onToggleFavorite={() => toggleFavorite(1)}
                generatedImage={generatedImages.length > 0 ? generatedImages[0] : undefined}
                generatedAudio={generatedAudios.length > 0 ? generatedAudios[0] : undefined}
                isLoading={isGenerating && lastQuantity >= 1}
                onDownload={() => handleDownload(0)}
              />
              <AssetCard 
                cardNumber={2}
                isExpanded={false}
                onExpand={() => setExpandedCardIndex(1)}
                onClose={() => setExpandedCardIndex(null)}
                theme={theme}
                isFavorited={favoriteCards.has(2)}
                onToggleFavorite={() => toggleFavorite(2)}
                generatedImage={generatedImages.length > 1 ? generatedImages[1] : undefined}
                generatedAudio={generatedAudios.length > 1 ? generatedAudios[1] : undefined}
                isLoading={isGenerating && lastQuantity >= 2}
                onDownload={() => handleDownload(1)}
              />
              <AssetCard 
                cardNumber={3}
                isExpanded={false}
                onExpand={() => setExpandedCardIndex(2)}
                onClose={() => setExpandedCardIndex(null)}
                theme={theme}
                isFavorited={favoriteCards.has(3)}
                onToggleFavorite={() => toggleFavorite(3)}
                generatedImage={generatedImages.length > 2 ? generatedImages[2] : undefined}
                generatedAudio={generatedAudios.length > 2 ? generatedAudios[2] : undefined}
                isLoading={isGenerating && lastQuantity >= 3}
                onDownload={() => handleDownload(2)}
              />
              <AssetCard 
                cardNumber={4}
                isExpanded={false}
                onExpand={() => setExpandedCardIndex(3)}
                onClose={() => setExpandedCardIndex(null)}
                theme={theme}
                isFavorited={favoriteCards.has(4)}
                onToggleFavorite={() => toggleFavorite(4)}
                generatedImage={generatedImages.length > 3 ? generatedImages[3] : undefined}
                generatedAudio={generatedAudios.length > 3 ? generatedAudios[3] : undefined}
                isLoading={isGenerating && lastQuantity >= 4}
                onDownload={() => handleDownload(3)}
              />
            </div>
          </div>
          
          <style>{`
            @keyframes fadeIn {
              from {
                opacity: 0;
                transform: translateY(10px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            .animate-fadeIn {
              animation: fadeIn 0.6s ease-out forwards;
            }
            
            @keyframes modalFadeIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }
            
            @keyframes modalScaleIn {
              from {
                opacity: 0;
                transform: scale(0.85) translateY(20px);
              }
              to {
                opacity: 1;
                transform: scale(1) translateY(0);
              }
            }
            
            .animate-modalFadeIn {
              animation: modalFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            
            .animate-modalScaleIn {
              animation: modalScaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
          `}</style>
        </div>
      </main>

      {/* Footer */}
      <footer className={`px-12 py-6 mt-auto transition-all duration-500 ${
        expandedCardIndex !== null ? 'blur-sm' : ''
      }`} style={{ borderTop: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}` }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="text-sm font-['Inter']" style={{ color: colors.textTertiary }}>
              © 2025 CREATURE GENERATOR · AI-POWERED DESIGN
            </div>
            <div className="flex gap-8">
              <button className="text-sm font-['Inter'] transition-colors" style={{ color: colors.textTertiary }}
                onMouseEnter={(e) => e.currentTarget.style.color = colors.text}
                onMouseLeave={(e) => e.currentTarget.style.color = colors.textTertiary}>
                PRIVACY
              </button>
              <button className="text-sm font-['Inter'] transition-colors" style={{ color: colors.textTertiary }}
                onMouseEnter={(e) => e.currentTarget.style.color = colors.text}
                onMouseLeave={(e) => e.currentTarget.style.color = colors.textTertiary}>
                TERMS
              </button>
              <button className="text-sm font-['Inter'] transition-colors" style={{ color: colors.textTertiary }}
                onMouseEnter={(e) => e.currentTarget.style.color = colors.text}
                onMouseLeave={(e) => e.currentTarget.style.color = colors.textTertiary}>
                CONTACT
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
