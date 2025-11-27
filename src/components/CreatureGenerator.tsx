import { useState } from "react";
import { Upload } from "lucide-react";
import { DotMatrixNumber } from "./DotMatrixNumber";
import type { Theme } from "../App";

interface CreatureGeneratorProps {
  onGenerate: (description: string, pixelSize: string, quantity: number) => void;
  isGenerating: boolean;
  isPaused: boolean;
  isCompleted: boolean;
  onPauseToggle: () => void;
  onRegenerate: () => void;
  theme: Theme;
}

export function CreatureGenerator({ 
  onGenerate, 
  isGenerating, 
  isPaused, 
  isCompleted, 
  onPauseToggle, 
  onRegenerate,
  theme
}: CreatureGeneratorProps) {
  const [pixelSize, setPixelSize] = useState("32px");
  const [quantity, setQuantity] = useState(4);
  const [description, setDescription] = useState("");
  // 图生图上传相关
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [referencePreview, setReferencePreview] = useState<string | null>(null);

  // 处理文件选择
  const handleReferenceImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setReferenceImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferencePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setReferencePreview(null);
    }
  };
  const colors = theme === 'dark' ? {
    cardBg: '#2a2a2a',
    text: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.6)',
    textTertiary: 'rgba(255, 255, 255, 0.3)',
    border: 'rgba(234, 234, 234, 0.3)',
    borderFocus: 'rgba(255, 255, 255, 0.5)',
    inputBg: 'transparent',
    sliderThumb: '#000000',
    sliderThumbBorder: '#FFFFFF',
  } : {
    cardBg: '#FFFFFF',
    text: '#000000',
    textSecondary: '#666666',
    textTertiary: '#CCCCCC',
    border: '#EAEAEA',
    borderFocus: '#000000',
    inputBg: '#FFFFFF',
    sliderThumb: '#FFFFFF',
    sliderThumbBorder: '#000000',
  };

  return (
    <div className="space-y-6">
      {/* H2 Heading with Pixel Font */}
      <h2 className="font-['Press_Start_2P'] text-sm leading-relaxed" style={{ color: colors.text }}>
        Creature Generator
      </h2>

      {/* Large Text Area */}
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe your creature (e.g., 'slime monster, glowing eyes, 3 horns')"
        className="w-full h-32 border p-4 font-['Inter'] resize-none focus:outline-none transition-all duration-300"
        style={{ 
          borderRadius: '12px',
          backgroundColor: colors.inputBg,
          borderColor: colors.border,
          color: colors.text,
          boxShadow: theme === 'dark' 
            ? '0 0 0 1px rgba(255, 255, 255, 0.1), 0 0 12px rgba(255, 255, 255, 0.05)' 
            : '0 0 0 1px rgba(0, 0, 0, 0.06), 0 0 12px rgba(0, 0, 0, 0.03)',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = colors.borderFocus;
          e.currentTarget.style.boxShadow = theme === 'dark'
            ? '0 0 0 1px rgba(255, 255, 255, 0.2), 0 0 20px rgba(255, 255, 255, 0.1), 0 0 40px rgba(255, 255, 255, 0.05)'
            : '0 0 0 1px rgba(0, 0, 0, 0.1), 0 0 20px rgba(0, 0, 0, 0.06), 0 0 40px rgba(0, 0, 0, 0.03)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = colors.border;
          e.currentTarget.style.boxShadow = theme === 'dark'
            ? '0 0 0 1px rgba(255, 255, 255, 0.1), 0 0 12px rgba(255, 255, 255, 0.05)'
            : '0 0 0 1px rgba(0, 0, 0, 0.06), 0 0 12px rgba(0, 0, 0, 0.03)';
        }}
      />

      {/* 图生图上传与预览 */}
      <div className="space-y-2">
        <label className="flex items-center gap-3 cursor-pointer transition-colors font-['Inter']" style={{ color: colors.textSecondary }}>
          <Upload />
          <span>Upload Reference Image</span>
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleReferenceImageChange}
          />
        </label>
        {referencePreview && (
          <div className="mt-2">
            <span style={{ color: colors.textTertiary, fontSize: '12px' }}>Preview:</span>
            <img src={referencePreview} alt="Reference Preview" style={{ maxWidth: '100%', maxHeight: '160px', borderRadius: '8px', marginTop: '4px', border: `1px solid ${colors.border}` }} />
          </div>
        )}
      </div>

      {/* Pixel Size */}
      <div className="space-y-3">
        <label className="block font-['Inter']" style={{ color: colors.text }}>Pixel Size</label>
        <div className="flex gap-3">
          {["32px", "64px", "128px"].map((size) => (
            <button
              key={size}
              onClick={() => setPixelSize(size)}
              className="flex-1 py-3 transition-colors font-mono text-center"
              style={{ 
                borderRadius: '9999px',
                letterSpacing: '0.05em',
                fontSize: '15px',
                backgroundColor: pixelSize === size ? (theme === 'dark' ? '#000000' : '#000000') : (theme === 'dark' ? '#FFFFFF' : '#FFFFFF'),
                color: pixelSize === size ? (theme === 'dark' ? '#FFFFFF' : '#FFFFFF') : (theme === 'dark' ? '#000000' : '#000000'),
                border: pixelSize === size ? 'none' : `1px solid ${colors.border}`
              }}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div className="space-y-3">
        <label className="block font-['Inter']" style={{ color: colors.text }}>Quantity</label>
        <div className="relative py-4">
          {/* Tick marks */}
          <div className="absolute top-1/2 -translate-y-1/2 w-full h-[2px] pointer-events-none" style={{ backgroundColor: colors.border }}>
            <div className="relative w-full h-full flex justify-between items-end">
              {Array.from({ length: 8 }).map((_, i) => {
                const tickPosition = (i / 7) * 7 + 1;
                const currentPosition = quantity;
                const distance = Math.abs(tickPosition - currentPosition);
                
                // Yellow concentrated within ~2 ticks
                const effectiveRange = 2;
                const normalizedDistance = Math.min(distance / effectiveRange, 1);
                
                // Use aggressive power curve for sharp transition
                const easedDistance = Math.pow(normalizedDistance, 3);
                
                // Color interpolation - different yellow for dark/light mode
                const yellow = theme === 'dark' 
                  ? { r: 255, g: 237, b: 0 }   // #FFED00 for dark mode
                  : { r: 253, g: 176, b: 34 }; // #FDB022 for light mode
                const gray = { r: 204, g: 204, b: 204 };
                
                const r = Math.round(yellow.r + (gray.r - yellow.r) * easedDistance);
                const g = Math.round(yellow.g + (gray.g - yellow.g) * easedDistance);
                const b = Math.round(yellow.b + (gray.b - yellow.b) * easedDistance);
                
                const color = `rgb(${r}, ${g}, ${b})`;
                
                // Height based on proximity
                const isActive = distance < 8;
                const height = isActive ? 12 : 6;
                
                return (
                  <div
                    key={i}
                    className="transition-all duration-200"
                    style={{
                      width: '2px',
                      height: `${height}px`,
                      backgroundColor: color,
                      borderRadius: 0,
                    }}
                  />
                );
              })}
            </div>
          </div>
          
          <input
            type="range"
            min="1"
            max="4"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="w-full h-0.5 bg-transparent appearance-none cursor-pointer relative z-10"
            style={{
              borderRadius: 0,
            }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-5 h-5 border-2 pointer-events-none z-20"
            style={{
              left: `calc(${((quantity - 1) / 3) * 100}% - 10px)`,
              borderRadius: 0,
              backgroundColor: colors.sliderThumb,
              borderColor: colors.sliderThumbBorder,
            }}
          />
          <div className="flex justify-between mt-4">
            <span className="text-xs font-['Press_Start_2P']" style={{ color: colors.textTertiary }}>1</span>
            <span className="text-xs font-['Press_Start_2P']" style={{ color: colors.text }}>{quantity}</span>
            <span className="text-xs font-['Press_Start_2P']" style={{ color: colors.textTertiary }}>4</span>
          </div>
        </div>
      </div>

      {/* Generate Button with Regenerate Arrow */}
      <div className="grid gap-3 items-center" style={{ gridTemplateColumns: (isGenerating || isPaused) ? ((isPaused || isCompleted) ? '1fr 1fr 1fr' : '1fr 1fr') : '1fr' }}>
        <button
          onClick={() => onGenerate(description, pixelSize, quantity)}
          disabled={isGenerating || isPaused || !description.trim()}
          className="text-black py-4 font-['Press_Start_2P'] text-xs relative overflow-hidden hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center w-full"
          style={{ 
            borderRadius: '9999px',
            backgroundColor: theme === 'dark' ? '#FFFF00' : '#FDB022',
            paddingLeft: '2rem',
            paddingRight: '2rem',
          }}
        >
          {/* Refresh animation during generation */}
          {(isGenerating || isPaused) && (
            <div
              className="absolute inset-0 animate-refresh"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)',
                backgroundSize: '200% 100%',
                animationPlayState: isPaused ? 'paused' : 'running'
              }}
            />
          )}
          
          <span className="relative z-10">
            {isGenerating || isPaused ? (isPaused ? "PAUSED" : "GENERATING") : "GENERATE"}
          </span>
          
          <style>{`
            @keyframes refresh {
              0% {
                background-position: -200% 0;
              }
              100% {
                background-position: 200% 0;
              }
            }
            .animate-refresh {
              animation: refresh 1.5s ease-in-out infinite;
            }
          `}</style>
        </button>

        {/* Pause Button - Show during generation or paused */}
        {(isGenerating || isPaused) && (
          <button
            onClick={onPauseToggle}
            className="bg-[#EAEAEA] hover:bg-[#D0D0D0] py-4 px-8 transition-colors flex items-center justify-center"
            style={{ borderRadius: '9999px' }}
            title={isPaused ? "Resume" : "Pause"}
          >
            <div className="w-4 h-4 bg-black" style={{ borderRadius: '3px' }}></div>
          </button>
        )}

        {/* Regenerate Button - Show when paused or completed */}
        {(isPaused || isCompleted) && (
          <button
            onClick={onRegenerate}
            className="bg-[#EAEAEA] hover:bg-[#D0D0D0] py-4 px-8 transition-colors flex items-center justify-center"
            style={{ borderRadius: '9999px' }}
            title="Regenerate"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C9.25022 4 6.82447 5.38734 5.38451 7.5"
                stroke="#000000"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M8 7.5H5.5V5"
                stroke="#000000"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>

      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: ${colors.sliderThumb};
          border: 2px solid ${colors.sliderThumbBorder};
          cursor: grab;
          border-radius: 0;
        }
        input[type="range"]::-webkit-slider-thumb:active {
          cursor: grabbing;
        }
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: ${colors.sliderThumb};
          border: 2px solid ${colors.sliderThumbBorder};
          cursor: grab;
          border-radius: 0;
        }
        input[type="range"]::-moz-range-thumb:active {
          cursor: grabbing;
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

function UploadIcon() {
  // Pixel-art upload icon using grid of dots
  return (
    <div className="inline-flex flex-col gap-0.5">
      <div className="flex gap-0.5">
        <div className="w-1 h-1 bg-transparent"></div>
        <div className="w-1 h-1 bg-transparent"></div>
        <div className="w-1 h-1 bg-current"></div>
        <div className="w-1 h-1 bg-transparent"></div>
        <div className="w-1 h-1 bg-transparent"></div>
      </div>
      <div className="flex gap-0.5">
        <div className="w-1 h-1 bg-transparent"></div>
        <div className="w-1 h-1 bg-current"></div>
        <div className="w-1 h-1 bg-current"></div>
        <div className="w-1 h-1 bg-current"></div>
        <div className="w-1 h-1 bg-transparent"></div>
      </div>
      <div className="flex gap-0.5">
        <div className="w-1 h-1 bg-current"></div>
        <div className="w-1 h-1 bg-current"></div>
        <div className="w-1 h-1 bg-current"></div>
        <div className="w-1 h-1 bg-current"></div>
        <div className="w-1 h-1 bg-current"></div>
      </div>
      <div className="flex gap-0.5">
        <div className="w-1 h-1 bg-transparent"></div>
        <div className="w-1 h-1 bg-transparent"></div>
        <div className="w-1 h-1 bg-current"></div>
        <div className="w-1 h-1 bg-transparent"></div>
        <div className="w-1 h-1 bg-transparent"></div>
      </div>
      <div className="flex gap-0.5">
        <div className="w-1 h-1 bg-transparent"></div>
        <div className="w-1 h-1 bg-transparent"></div>
        <div className="w-1 h-1 bg-current"></div>
        <div className="w-1 h-1 bg-transparent"></div>
        <div className="w-1 h-1 bg-transparent"></div>
      </div>
      <div className="flex gap-0.5">
        <div className="w-1 h-1 bg-transparent"></div>
        <div className="w-1 h-1 bg-transparent"></div>
        <div className="w-1 h-1 bg-current"></div>
        <div className="w-1 h-1 bg-transparent"></div>
        <div className="w-1 h-1 bg-transparent"></div>
      </div>
    </div>
  );
}
