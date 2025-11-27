import { X } from "lucide-react";
import { AssetCard } from "./AssetCard";
import type { Theme } from "../App";

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
  favoritesData: Array<{id: number, image: string, audio: string}>;
  onToggleFavorite: (cardId: number, cardImage: string) => void;
  onDownload: (image: string, audio: string, id: number) => void;
}

export function FavoritesModal({ 
  isOpen, 
  onClose, 
  theme, 
  favoritesData,
  onToggleFavorite,
  onDownload
}: FavoritesModalProps) {
  if (!isOpen) return null;

  const colors = theme === 'dark' ? {
    bg: '#1a1a1a',
    text: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.6)',
    textTertiary: 'rgba(255, 255, 255, 0.4)',
    border: 'rgba(234, 234, 234, 0.3)',
    previewBg: '#2a2a2a',
  } : {
    bg: '#FAFAFA',
    text: '#000000',
    textSecondary: '#666666',
    textTertiary: '#999999',
    border: '#EAEAEA',
    previewBg: '#F5F5F5',
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 transition-all duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <div 
          className="pointer-events-auto w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col animate-modalScaleIn"
          style={{ 
            backgroundColor: colors.bg,
            borderRadius: '16px',
            border: `1px solid ${colors.border}`
          }}
        >
          {/* Header */}
          <div 
            className="flex items-center justify-between px-8 py-6"
            style={{ borderBottom: `1px solid ${colors.border}` }}
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2" style={{ backgroundColor: colors.text }}></div>
              <h2 className="tracking-wider font-['Inter']" style={{ color: colors.text }}>
                FAVORITES
              </h2>
              <span className="text-sm font-['Inter'] px-3 py-1 rounded-full" style={{ 
                color: colors.textSecondary,
                backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
              }}>
                {favoritesData.length}
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center transition-colors"
              style={{ 
                backgroundColor: 'transparent',
                borderRadius: '4px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <X className="w-5 h-5" style={{ color: colors.text }} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8">
            {favoritesData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
                <div 
                  className="text-6xl mb-4"
                  style={{ 
                    color: colors.textTertiary,
                    opacity: 0.3
                  }}
                >
                  ♡
                </div>
                <p 
                  className="font-['Inter'] text-center"
                  style={{ color: colors.textSecondary }}
                >
                  No favorites yet. Click the heart icon on any card to add it here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-6">
                {favoritesData.map((item, index) => (
                  <AssetCard
                    key={`${item.id}-${index}-${item.image.substring(0, 20)}`}
                    cardNumber={item.id}
                    isExpanded={false}
                    onExpand={() => {}}
                    theme={theme}
                    isFavorited={true}
                    onToggleFavorite={() => onToggleFavorite(item.id, item.image)}
                    generatedImage={item.image}
                    generatedAudio={item.audio}
                    onDownload={() => onDownload(item.image, item.audio, item.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
