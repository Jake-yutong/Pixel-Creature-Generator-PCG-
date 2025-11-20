import { useEffect, useState } from "react";
import type { Theme } from "../App";

export function LoadingAnimation({ theme }: { theme: Theme }) {
  const [frame, setFrame] = useState(0);
  
  const colors = theme === 'dark' ? {
    matrixBg: '#1a1a1a',
    slimeBody: '#EAEAEA',
    slimeEye: '#000000',
    pixelBg: '#2a2a2a',
    text: '#999999',
  } : {
    matrixBg: '#FFFFFF',
    slimeBody: '#333333',
    slimeEye: '#FFFFFF',
    pixelBg: '#F0F0F0',
    text: '#666666',
  };
  
  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(prev => (prev + 1) % 8); // 8 frames for smooth jump cycle
    }, 150);
    
    return () => clearInterval(interval);
  }, []);

  // Define slime shape for different animation frames
  const getSlimePixels = (currentFrame: number) => {
    // Base slime shape (14x14 grid - smaller than before)
    const baseShape = {
      // Resting/Squished state (frames 0, 7)
      squished: [
        "00000000000000",
        "00000000000000",
        "00000000000000",
        "00000000000000",
        "00000000000000",
        "00000000000000",
        "00001111110000",
        "00111111111100",
        "01112111121110",
        "01112111121110",
        "01112111121110",
        "01111111111110",
        "00111111111100",
        "00001111110000",
      ],
      // Preparing to jump (frames 1, 2)
      compressed: [
        "00000000000000",
        "00000000000000",
        "00000000000000",
        "00000000000000",
        "00000000000000",
        "00000000000000",
        "00000000000000",
        "00011111111000",
        "01112111121110",
        "01112111121110",
        "01112111121110",
        "01111111111110",
        "01111111111110",
        "00011111111000",
      ],
      // Mid jump - stretched (frames 3, 4)
      stretched: [
        "00000000000000",
        "00001111110000",
        "00011111111000",
        "00112111121100",
        "00112111121100",
        "00112111121100",
        "00111111111100",
        "00111111111100",
        "00111111111100",
        "00111111111100",
        "00011111111000",
        "00001111110000",
        "00000000000000",
        "00000000000000",
      ],
      // Coming down (frames 5, 6)
      normal: [
        "00000000000000",
        "00000000000000",
        "00000000000000",
        "00000000000000",
        "00001111110000",
        "00111111111100",
        "01112111121110",
        "01112111121110",
        "01112111121110",
        "01111111111110",
        "01111111111110",
        "01111111111110",
        "00111111111100",
        "00001111110000",
      ],
    };

    // Map frames to shapes
    if (currentFrame === 0 || currentFrame === 7) return baseShape.squished;
    if (currentFrame === 1 || currentFrame === 2) return baseShape.compressed;
    if (currentFrame === 3 || currentFrame === 4) return baseShape.stretched;
    return baseShape.normal;
  };

  const slimePattern = getSlimePixels(frame);
  const slimeSize = 14; // Slime grid size
  const matrixSize = 16; // Background matrix size (smaller and tighter)
  const offset = Math.floor((matrixSize - slimeSize) / 2); // Center the slime

  // Create full matrix with slime in center
  const fullMatrix = Array(matrixSize).fill(0).map(() => Array(matrixSize).fill('0'));
  
  // Place slime in center of matrix
  slimePattern.forEach((row, rowIndex) => {
    row.split('').forEach((pixel, colIndex) => {
      fullMatrix[offset + rowIndex][offset + colIndex] = pixel;
    });
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] space-y-12">
      {/* Pixel Matrix with Slime */}
      <div className="relative">
        {/* Background Matrix Grid */}
        <div className="grid gap-[2px]" style={{
          gridTemplateColumns: `repeat(${matrixSize}, 1fr)`,
          gridTemplateRows: `repeat(${matrixSize}, 1fr)`,
          padding: '16px',
          backgroundColor: colors.matrixBg
        }}>
          {fullMatrix.map((row, rowIndex) => 
            row.map((pixel, colIndex) => {
              const isBody = pixel === '1';
              const isEye = pixel === '2';
              const isBackground = pixel === '0';
              
              let bgColor = colors.pixelBg;
              if (isBody) bgColor = colors.slimeBody;
              if (isEye) bgColor = colors.slimeEye;
              
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className="w-3 h-3 transition-all duration-100"
                  style={{ 
                    borderRadius: 0,
                    backgroundColor: bgColor
                  }}
                />
              );
            })
          )}
        </div>
      </div>

      {/* Loading Text */}
      <div className="font-['Press_Start_2P'] text-xs text-center" style={{ color: colors.text }}>
        [ Summoning creature... ]
      </div>
    </div>
  );
}
