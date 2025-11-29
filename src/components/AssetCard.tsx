import { Download, Share2, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import type { Theme } from "../App";
import { LoadingAnimation } from "./LoadingAnimation";

interface AssetCardProps {
  cardNumber?: number;
  isExpanded?: boolean;
  onExpand?: () => void;
  onClose?: () => void;
  theme: Theme;
  isFavorited?: boolean;
  onToggleFavorite?: () => void;
  generatedImage?: string;
  generatedAudio?: string; // 添加音频支持
  isLoading?: boolean;
  onDownload?: () => void;
  onShare?: () => void; // 添加分享回调
}

export function AssetCard({ cardNumber, isExpanded = false, onExpand, onClose, theme, isFavorited = false, onToggleFavorite, generatedImage, generatedAudio, isLoading = false, onDownload, onShare }: AssetCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [remainingTime, setRemainingTime] = useState(3);
  const audioDuration = 3000; // 3 seconds in milliseconds

  // 下载图片和音频的处理函数
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDownload) {
      onDownload();
    }
  };

  // 分享处理函数
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onShare) {
      onShare();
    }
  };

  // 初始化音频元素
  useEffect(() => {
    if (generatedAudio) {
      const audio = new Audio(generatedAudio);
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setProgress(0);
        setRemainingTime(3);
      });
      audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
          setProgress((audio.currentTime / audio.duration) * 100);
          setRemainingTime(Math.ceil(audio.duration - audio.currentTime));
        }
      });
      setAudioElement(audio);
      return () => {
        audio.pause();
        audio.remove();
      };
    }
  }, [generatedAudio]);

  const colors = theme === 'dark' ? {
    cardBg: '#2a2a2a',
    imageBg: '#1a1a1a',
    text: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.6)',
    textTertiary: 'rgba(255, 255, 255, 0.4)',
    border: 'rgba(234, 234, 234, 0.3)',
    borderHover: '#FFFFFF',
    pixelLit: 'rgba(255, 255, 255, 0.8)',
    pixelDim: 'rgba(255, 255, 255, 0.1)',
    progressBg: 'rgba(234, 234, 234, 0.2)',
    progressBar: '#FFFFFF',
    buttonHoverBg: 'rgba(255, 255, 255, 0.1)',
  } : {
    cardBg: '#FFFFFF',
    imageBg: '#F5F5F5',
    text: '#000000',
    textSecondary: '#666666',
    textTertiary: '#999999',
    border: '#EAEAEA',
    borderHover: '#000000',
    pixelLit: 'rgba(0, 0, 0, 0.8)',
    pixelDim: 'rgba(0, 0, 0, 0.1)',
    progressBg: 'rgba(0, 0, 0, 0.1)',
    progressBar: '#000000',
    buttonHoverBg: 'rgba(0, 0, 0, 0.05)',
  };

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            setRemainingTime(0);
            return 0;
          }
          const newProgress = prev + (100 / (audioDuration / 100)); // Increase by percentage every 100ms
          const remaining = Math.max(0, Math.ceil((audioDuration - (newProgress / 100 * audioDuration)) / 1000));
          setRemainingTime(remaining);
          return newProgress;
        });
      }, 100);

      return () => clearInterval(interval);
    } else if (progress === 0) {
      // Reset remaining time when stopped at the beginning
      setRemainingTime(3);
    }
  }, [isPlaying, audioDuration, progress]);

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioElement) {
      if (isPlaying) {
        audioElement.pause();
        setIsPlaying(false);
      } else {
        audioElement.play();
        setIsPlaying(true);
      }
    } else {
      // 如果没有音频，使用模拟效果
      if (progress >= 100) {
        setProgress(0);
        setRemainingTime(3);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleCardClick = () => {
    if (!isExpanded && onExpand) {
      onExpand();
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className={`group border p-4 relative transition-all duration-500 ease-out ${
        isExpanded 
          ? 'w-[600px] cursor-default' 
          : 'cursor-pointer'
      }`}
      style={{ 
        borderRadius: '12px',
        backgroundColor: colors.cardBg,
        borderColor: isExpanded ? colors.borderHover : colors.border,
        boxShadow: isExpanded
          ? (theme === 'dark'
            ? '0 0 0 1px rgba(255, 255, 255, 0.2), 0 0 20px rgba(255, 255, 255, 0.1), 0 0 40px rgba(255, 255, 255, 0.05)'
            : '0 0 0 1px rgba(0, 0, 0, 0.1), 0 0 20px rgba(0, 0, 0, 0.06), 0 0 40px rgba(0, 0, 0, 0.03)')
          : (theme === 'dark' 
            ? '0 0 0 1px rgba(255, 255, 255, 0.1), 0 0 12px rgba(255, 255, 255, 0.05)' 
            : '0 0 0 1px rgba(0, 0, 0, 0.06), 0 0 12px rgba(0, 0, 0, 0.03)')
      }}
      onMouseEnter={(e) => {
        if (!isExpanded) {
          e.currentTarget.style.borderColor = colors.borderHover;
          e.currentTarget.style.boxShadow = theme === 'dark'
            ? '0 0 0 1px rgba(255, 255, 255, 0.2), 0 0 20px rgba(255, 255, 255, 0.1), 0 0 40px rgba(255, 255, 255, 0.05)'
            : '0 0 0 1px rgba(0, 0, 0, 0.1), 0 0 20px rgba(0, 0, 0, 0.06), 0 0 40px rgba(0, 0, 0, 0.03)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isExpanded) {
          e.currentTarget.style.borderColor = colors.border;
          e.currentTarget.style.boxShadow = theme === 'dark'
            ? '0 0 0 1px rgba(255, 255, 255, 0.1), 0 0 12px rgba(255, 255, 255, 0.05)'
            : '0 0 0 1px rgba(0, 0, 0, 0.06), 0 0 12px rgba(0, 0, 0, 0.03)';
        }
      }}
    >
      {/* Card Number - Top Left */}
      {!isExpanded && cardNumber && (
        <div className="absolute top-4 left-4 z-10">
          <span className="font-['Press_Start_2P'] text-xs" style={{ color: colors.textTertiary }}>
            #{cardNumber}
          </span>
        </div>
      )}

      {/* Action Buttons - Top Right */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        {isExpanded && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClose?.();
            }}
            className="w-8 h-8 flex items-center justify-center transition-colors"
            style={{ backgroundColor: 'transparent' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.buttonHoverBg}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <PixelCloseIcon theme={theme} />
          </button>
        )}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.();
          }}
          className="w-8 h-8 flex items-center justify-center transition-colors"
          style={{ backgroundColor: 'transparent' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.buttonHoverBg}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <Heart 
            className="w-4 h-4 transition-all" 
            style={{ 
              color: isFavorited ? '#C1272D' : colors.textTertiary,
              fill: isFavorited ? '#C1272D' : 'transparent',
            }} 
            onMouseEnter={(e) => !isFavorited && (e.currentTarget.style.color = colors.text)}
            onMouseLeave={(e) => !isFavorited && (e.currentTarget.style.color = colors.textTertiary)}
          />
        </button>
        <button 
          onClick={handleDownload}
          className="w-8 h-8 flex items-center justify-center transition-colors"
          style={{ backgroundColor: 'transparent' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.buttonHoverBg}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <Download className="w-4 h-4 transition-colors" style={{ color: colors.textTertiary }} 
            onMouseEnter={(e) => e.currentTarget.style.color = colors.text}
            onMouseLeave={(e) => e.currentTarget.style.color = colors.textTertiary} />
        </button>
        <button 
          onClick={handleShare}
          className="w-8 h-8 flex items-center justify-center transition-colors"
          style={{ backgroundColor: 'transparent' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.buttonHoverBg}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <Share2 className="w-4 h-4 transition-colors" style={{ color: colors.textTertiary }}
            onMouseEnter={(e) => e.currentTarget.style.color = colors.text}
            onMouseLeave={(e) => e.currentTarget.style.color = colors.textTertiary} />
        </button>
      </div>

      {/* Image Placeholder */}
      <div 
        className={`border mb-4 flex items-center justify-center transition-all duration-500 overflow-hidden ${
          isExpanded ? 'aspect-square' : 'aspect-square'
        }`}
        style={{ 
          borderRadius: '8px',
          backgroundColor: colors.imageBg,
          borderColor: theme === 'dark' ? 'rgba(234, 234, 234, 0.2)' : 'rgba(0, 0, 0, 0.1)'
        }}
      >
        {isLoading ? (
          // 显示跳动的加载动画
          <LoadingAnimation theme={theme} />
        ) : generatedImage ? (
          // 显示生成的图片
          <img 
            src={generatedImage} 
            alt={`Generated creature ${cardNumber || ''}`} 
            className="w-full h-full object-contain"
            style={{ imageRendering: 'pixelated' }}
          />
        ) : (
          // 显示原来的像素加载动画
          <div className="grid grid-cols-8 gap-1">
            {[...Array(64)].map((_, i) => {
              const pixelIndex = i + 1;
              const totalPixels = 64;
              const litPixels = Math.floor((progress / 100) * totalPixels);
              const isLit = pixelIndex <= litPixels;
              
              return (
                <div
                  key={i}
                  className="w-2 h-2 transition-all duration-200"
                  style={{ 
                    borderRadius: 0,
                    backgroundColor: isLit ? colors.pixelLit : colors.pixelDim
                  }}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Audio Player - 只在有图片和音频时显示 */}
      {generatedImage && generatedAudio && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            {/* Play Button with Pixel Triangle */}
            <button 
              onClick={handlePlayPause}
              className="w-8 h-8 border flex items-center justify-center transition-colors"
              style={{ borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)' }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'}
            >
              {isPlaying ? <PixelPauseIcon theme={theme} /> : <PixelPlayIcon theme={theme} />}
            </button>
            
            {/* Audio Label */}
            <span className="text-sm font-['Inter']" style={{ color: colors.textSecondary }}>
              Creature Cry (0:0{remainingTime}s)
            </span>
          </div>

          {/* Progress Bar */}
          <div className="relative h-[2px]" style={{ backgroundColor: colors.progressBg }}>
            <div 
              className="absolute top-0 left-0 h-full transition-all duration-100"
              style={{ 
                width: `${progress}%`,
                borderRadius: 0,
                backgroundColor: colors.progressBar
              }}
            />
          </div>

          {/* Audio Wave Visualization */}
          <AudioWaveVisualization progress={progress} theme={theme} />
        </div>
      )}
    </div>
  );
}

function PixelPlayIcon({ theme }: { theme: Theme }) {
  const iconColor = theme === 'dark' ? '#FFFFFF' : '#000000';
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex gap-0.5">
        <div className="w-1 h-1" style={{ backgroundColor: iconColor }}></div>
        <div className="w-1 h-1 bg-transparent"></div>
        <div className="w-1 h-1 bg-transparent"></div>
      </div>
      <div className="flex gap-0.5">
        <div className="w-1 h-1" style={{ backgroundColor: iconColor }}></div>
        <div className="w-1 h-1" style={{ backgroundColor: iconColor }}></div>
        <div className="w-1 h-1 bg-transparent"></div>
      </div>
      <div className="flex gap-0.5">
        <div className="w-1 h-1" style={{ backgroundColor: iconColor }}></div>
        <div className="w-1 h-1" style={{ backgroundColor: iconColor }}></div>
        <div className="w-1 h-1" style={{ backgroundColor: iconColor }}></div>
      </div>
      <div className="flex gap-0.5">
        <div className="w-1 h-1" style={{ backgroundColor: iconColor }}></div>
        <div className="w-1 h-1" style={{ backgroundColor: iconColor }}></div>
        <div className="w-1 h-1 bg-transparent"></div>
      </div>
      <div className="flex gap-0.5">
        <div className="w-1 h-1" style={{ backgroundColor: iconColor }}></div>
        <div className="w-1 h-1 bg-transparent"></div>
        <div className="w-1 h-1 bg-transparent"></div>
      </div>
    </div>
  );
}

function PixelPauseIcon({ theme }: { theme: Theme }) {
  const iconColor = theme === 'dark' ? '#FFFFFF' : '#000000';
  return (
    <div className="flex gap-1">
      <div className="flex flex-col gap-0.5">
        <div className="w-1 h-1" style={{ backgroundColor: iconColor }}></div>
        <div className="w-1 h-1" style={{ backgroundColor: iconColor }}></div>
        <div className="w-1 h-1" style={{ backgroundColor: iconColor }}></div>
        <div className="w-1 h-1" style={{ backgroundColor: iconColor }}></div>
        <div className="w-1 h-1" style={{ backgroundColor: iconColor }}></div>
      </div>
      <div className="flex flex-col gap-0.5">
        <div className="w-1 h-1" style={{ backgroundColor: iconColor }}></div>
        <div className="w-1 h-1" style={{ backgroundColor: iconColor }}></div>
        <div className="w-1 h-1" style={{ backgroundColor: iconColor }}></div>
        <div className="w-1 h-1" style={{ backgroundColor: iconColor }}></div>
        <div className="w-1 h-1" style={{ backgroundColor: iconColor }}></div>
      </div>
    </div>
  );
}

function PixelCloseIcon({ theme }: { theme: Theme }) {
  const iconColor = theme === 'dark' ? '#FFFFFF' : '#000000';
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex gap-0.5">
        <div className="w-1 h-1" style={{ backgroundColor: iconColor }}></div>
        <div className="w-1 h-1 bg-transparent"></div>
        <div className="w-1 h-1 bg-transparent"></div>
        <div className="w-1 h-1 bg-transparent"></div>
        <div className="w-1 h-1" style={{ backgroundColor: iconColor }}></div>
      </div>
      <div className="flex gap-0.5">
        <div className="w-1 h-1 bg-transparent"></div>
        <div className="w-1 h-1" style={{ backgroundColor: iconColor }}></div>
        <div className="w-1 h-1 bg-transparent"></div>
        <div className="w-1 h-1" style={{ backgroundColor: iconColor }}></div>
        <div className="w-1 h-1 bg-transparent"></div>
      </div>
      <div className="flex gap-0.5">
        <div className="w-1 h-1 bg-transparent"></div>
        <div className="w-1 h-1 bg-transparent"></div>
        <div className="w-1 h-1" style={{ backgroundColor: iconColor }}></div>
        <div className="w-1 h-1 bg-transparent"></div>
        <div className="w-1 h-1 bg-transparent"></div>
      </div>
      <div className="flex gap-0.5">
        <div className="w-1 h-1 bg-transparent"></div>
        <div className="w-1 h-1" style={{ backgroundColor: iconColor }}></div>
        <div className="w-1 h-1 bg-transparent"></div>
        <div className="w-1 h-1" style={{ backgroundColor: iconColor }}></div>
        <div className="w-1 h-1 bg-transparent"></div>
      </div>
      <div className="flex gap-0.5">
        <div className="w-1 h-1" style={{ backgroundColor: iconColor }}></div>
        <div className="w-1 h-1 bg-transparent"></div>
        <div className="w-1 h-1 bg-transparent"></div>
        <div className="w-1 h-1 bg-transparent"></div>
        <div className="w-1 h-1" style={{ backgroundColor: iconColor }}></div>
      </div>
    </div>
  );
}

function PixelLeftArrow({ theme }: { theme: Theme }) {
  const iconColor = theme === 'dark' ? '#FFFFFF' : '#000000';
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex gap-0.5">
        <div className="w-1 h-1 bg-transparent"></div>
        <div className="w-1 h-1 bg-transparent"></div>
        <div className="w-1 h-1" style={{ backgroundColor: iconColor }}></div>
      </div>
      <div className="flex gap-0.5">
        <div className="w-1 h-1 bg-transparent"></div>
        <div className="w-1 h-1" style={{ backgroundColor: iconColor }}></div>
        <div className="w-1 h-1 bg-transparent"></div>
      </div>
      <div className="flex gap-0.5">
        <div className="w-1 h-1" style={{ backgroundColor: iconColor }}></div>
        <div className="w-1 h-1 bg-transparent"></div>
        <div className="w-1 h-1 bg-transparent"></div>
      </div>
      <div className="flex gap-0.5">
        <div className="w-1 h-1 bg-transparent"></div>
        <div className="w-1 h-1" style={{ backgroundColor: iconColor }}></div>
        <div className="w-1 h-1 bg-transparent"></div>
      </div>
      <div className="flex gap-0.5">
        <div className="w-1 h-1 bg-transparent"></div>
        <div className="w-1 h-1 bg-transparent"></div>
        <div className="w-1 h-1" style={{ backgroundColor: iconColor }}></div>
      </div>
    </div>
  );
}

function PixelRightArrow({ theme }: { theme: Theme }) {
  const iconColor = theme === 'dark' ? '#FFFFFF' : '#000000';
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex gap-0.5">
        <div className="w-1 h-1" style={{ backgroundColor: iconColor }}></div>
        <div className="w-1 h-1 bg-transparent"></div>
        <div className="w-1 h-1 bg-transparent"></div>
      </div>
      <div className="flex gap-0.5">
        <div className="w-1 h-1 bg-transparent"></div>
        <div className="w-1 h-1" style={{ backgroundColor: iconColor }}></div>
        <div className="w-1 h-1 bg-transparent"></div>
      </div>
      <div className="flex gap-0.5">
        <div className="w-1 h-1 bg-transparent"></div>
        <div className="w-1 h-1 bg-transparent"></div>
        <div className="w-1 h-1" style={{ backgroundColor: iconColor }}></div>
      </div>
      <div className="flex gap-0.5">
        <div className="w-1 h-1 bg-transparent"></div>
        <div className="w-1 h-1" style={{ backgroundColor: iconColor }}></div>
        <div className="w-1 h-1 bg-transparent"></div>
      </div>
      <div className="flex gap-0.5">
        <div className="w-1 h-1" style={{ backgroundColor: iconColor }}></div>
        <div className="w-1 h-1 bg-transparent"></div>
        <div className="w-1 h-1 bg-transparent"></div>
      </div>
    </div>
  );
}

export { PixelLeftArrow, PixelRightArrow };

// 添加动画样式
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse-pixels {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
  .animate-pulse-pixels {
    animation: pulse-pixels 1.5s ease-in-out infinite;
  }
`;
if (!document.querySelector('style[data-asset-card-animations]')) {
  style.setAttribute('data-asset-card-animations', 'true');
  document.head.appendChild(style);
}

function AudioWaveVisualization({ progress, theme }: { progress: number; theme: Theme }) {
  // Create a dot-matrix pattern for audio wave
  const waveHeights = [2, 4, 6, 8, 6, 4, 7, 5, 3, 6, 8, 7, 5, 4, 6, 8, 6, 4, 5, 7];
  
  const activeColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)';
  const inactiveColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)';
  
  return (
    <div className="flex items-end gap-1 h-10">
      {waveHeights.map((height, index) => {
        const barProgress = (index / waveHeights.length) * 100;
        const isPassed = progress >= barProgress;
        
        return (
          <div key={index} className="flex flex-col-reverse gap-0.5">
            {[...Array(Math.floor(height))].map((_, dotIndex) => (
              <div
                key={dotIndex}
                className="w-1 h-1 transition-all duration-200"
                style={{ 
                  borderRadius: 0,
                  backgroundColor: isPassed ? activeColor : inactiveColor
                }}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
