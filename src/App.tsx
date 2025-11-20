import { useState } from "react";
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

export type Theme = 'dark' | 'light';

export default function App() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [expandedCardIndex, setExpandedCardIndex] = useState<number | null>(null);
  const [animationKey, setAnimationKey] = useState(0);
  const [theme, setTheme] = useState<Theme>('dark');
  const [favoriteCards, setFavoriteCards] = useState<Set<number>>(new Set());
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setIsPaused(false);
    setIsCompleted(false);
    // Simulate generation time
    setTimeout(() => {
      if (!isPaused) {
        setIsGenerating(false);
        setIsCompleted(true);
      }
    }, 5000); // 5 seconds for demo
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
    setIsCompleted(false);
    setIsPaused(false);
    setIsGenerating(true);
    // Simulate generation time
    setTimeout(() => {
      setIsGenerating(false);
      setIsCompleted(true);
    }, 5000); // 5 seconds for demo
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
    setFavoriteCards(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(cardNumber)) {
        newFavorites.delete(cardNumber);
      } else {
        newFavorites.add(cardNumber);
      }
      return newFavorites;
    });
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
            </div>
            
            <div className="flex items-center gap-4">
              {/* Favorites Button */}
              <button 
                onClick={() => setIsFavoritesOpen(true)}
                className="flex items-center gap-2 px-4 py-2 hover:opacity-70 transition-opacity"
              >
                <Heart className="w-4 h-4" style={{ color: colors.text }} />
                <span className="font-['Inter'] text-sm" style={{ color: colors.text }}>Favorites</span>
                {favoriteCards.size > 0 && (
                  <span 
                    className="px-2 py-0.5 rounded-full text-xs font-['Inter']"
                    style={{ 
                      backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                      color: colors.text
                    }}
                  >
                    {favoriteCards.size}
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
        favoriteCards={Array.from(favoriteCards).sort((a, b) => a - b)}
        onToggleFavorite={toggleFavorite}
        onExpandCard={(index) => setExpandedCardIndex(index)}
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
            {isGenerating ? (
              <LoadingAnimation theme={theme} />
            ) : (
              <div className="grid grid-cols-2 gap-6 animate-fadeIn">
                <AssetCard 
                  cardNumber={1}
                  isExpanded={false}
                  onExpand={() => setExpandedCardIndex(0)}
                  onClose={() => setExpandedCardIndex(null)}
                  theme={theme}
                  isFavorited={favoriteCards.has(1)}
                  onToggleFavorite={() => toggleFavorite(1)}
                />
                <AssetCard 
                  cardNumber={2}
                  isExpanded={false}
                  onExpand={() => setExpandedCardIndex(1)}
                  onClose={() => setExpandedCardIndex(null)}
                  theme={theme}
                  isFavorited={favoriteCards.has(2)}
                  onToggleFavorite={() => toggleFavorite(2)}
                />
                <AssetCard 
                  cardNumber={3}
                  isExpanded={false}
                  onExpand={() => setExpandedCardIndex(2)}
                  onClose={() => setExpandedCardIndex(null)}
                  theme={theme}
                  isFavorited={favoriteCards.has(3)}
                  onToggleFavorite={() => toggleFavorite(3)}
                />
                <AssetCard 
                  cardNumber={4}
                  isExpanded={false}
                  onExpand={() => setExpandedCardIndex(3)}
                  onClose={() => setExpandedCardIndex(null)}
                  theme={theme}
                  isFavorited={favoriteCards.has(4)}
                  onToggleFavorite={() => toggleFavorite(4)}
                />
              </div>
            )}
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
