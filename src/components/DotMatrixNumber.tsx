// Dot Matrix style numbers and letters inspired by Nothing Community font
interface DotMatrixProps {
  text: string;
}

export function DotMatrixNumber({ text }: DotMatrixProps) {
  const renderChar = (char: string) => {
    const dotSize = "w-1 h-1";
    const on = `${dotSize} bg-current rounded-[1px]`;
    const off = `${dotSize} bg-transparent`;

    // 5x7 dot matrix patterns
    const patterns: Record<string, string[][]> = {
      '3': [
        ['on', 'on', 'on'],
        ['off', 'off', 'on'],
        ['on', 'on', 'on'],
        ['off', 'off', 'on'],
        ['on', 'on', 'on'],
      ],
      '2': [
        ['on', 'on', 'on'],
        ['off', 'off', 'on'],
        ['on', 'on', 'on'],
        ['on', 'off', 'off'],
        ['on', 'on', 'on'],
      ],
      '6': [
        ['on', 'on', 'on'],
        ['on', 'off', 'off'],
        ['on', 'on', 'on'],
        ['on', 'off', 'on'],
        ['on', 'on', 'on'],
      ],
      '4': [
        ['on', 'off', 'on'],
        ['on', 'off', 'on'],
        ['on', 'on', 'on'],
        ['off', 'off', 'on'],
        ['off', 'off', 'on'],
      ],
      '1': [
        ['off', 'on', 'off'],
        ['on', 'on', 'off'],
        ['off', 'on', 'off'],
        ['off', 'on', 'off'],
        ['on', 'on', 'on'],
      ],
      '8': [
        ['on', 'on', 'on'],
        ['on', 'off', 'on'],
        ['on', 'on', 'on'],
        ['on', 'off', 'on'],
        ['on', 'on', 'on'],
      ],
      'p': [
        ['on', 'on', 'on'],
        ['on', 'off', 'on'],
        ['on', 'on', 'on'],
        ['on', 'off', 'off'],
        ['on', 'off', 'off'],
      ],
      'x': [
        ['on', 'off', 'on'],
        ['on', 'off', 'on'],
        ['off', 'on', 'off'],
        ['on', 'off', 'on'],
        ['on', 'off', 'on'],
      ],
    };

    const pattern = patterns[char.toLowerCase()];
    if (!pattern) return null;

    return (
      <div className="flex flex-col gap-1">
        {pattern.map((row, i) => (
          <div key={i} className="flex gap-1">
            {row.map((cell, j) => (
              <div key={j} className={cell === 'on' ? on : off} />
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex gap-1.5 items-center justify-center">
      {text.split('').map((char, i) => (
        <div key={i}>{renderChar(char)}</div>
      ))}
    </div>
  );
}
