interface DotMatrixProps {
  dots: boolean[][];
  dotSize?: number;
  gap?: number;
  color?: string;
}

export function DotMatrix({ dots, dotSize = 6, gap = 4, color = "#FFFFFF" }: DotMatrixProps) {
  return (
    <div className="inline-block">
      {dots.map((row, rowIndex) => (
        <div key={rowIndex} className="flex" style={{ marginBottom: gap }}>
          {row.map((isDotOn, colIndex) => (
            <div
              key={colIndex}
              className="rounded-full transition-opacity duration-300"
              style={{
                width: dotSize,
                height: dotSize,
                marginRight: colIndex < row.length - 1 ? gap : 0,
                backgroundColor: isDotOn ? color : "transparent",
                opacity: isDotOn ? 1 : 0.15,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// Pre-defined dot matrix patterns for common icons and numbers
export const DotPatterns = {
  // Numbers
  "0": [
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
  ],
  "1": [
    [0, 1, 0],
    [1, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 1],
  ],
  "2": [
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 1],
  ],
  "3": [
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1],
  ],
  "4": [
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
    [0, 0, 1],
    [0, 0, 1],
  ],
  "5": [
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1],
  ],
  "7": [
    [1, 1, 1],
    [0, 0, 1],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
  ],
  "8": [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
  ],
  "°": [
    [1, 1],
    [1, 1],
  ],
  // Icons
  temperature: [
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [1, 1, 1, 1],
    [1, 1, 1, 1],
    [1, 1, 1, 1],
    [0, 1, 1, 0],
  ],
  music: [
    [0, 0, 0, 1, 1],
    [0, 1, 1, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 1, 1, 0],
    [0, 1, 1, 0, 0],
  ],
  flashlight: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 1],
  ],
  play: [
    [1, 0, 0],
    [1, 1, 0],
    [1, 1, 1],
    [1, 1, 0],
    [1, 0, 0],
  ],
  arrow: [
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ],
};

export function DotNumber({ value, color = "#FFFFFF" }: { value: string; color?: string }) {
  const chars = value.split("");
  
  return (
    <div className="flex items-center gap-2">
      {chars.map((char, index) => {
        const pattern = DotPatterns[char as keyof typeof DotPatterns];
        if (!pattern) return null;
        
        return (
          <DotMatrix 
            key={index} 
            dots={pattern.map(row => row.map(val => val === 1))} 
            dotSize={5}
            gap={3}
            color={color}
          />
        );
      })}
    </div>
  );
}
