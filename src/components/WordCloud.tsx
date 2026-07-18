import React, { useMemo } from 'react';
import { SentimentData } from '../types';

interface WordCloudProps {
  words: SentimentData['wordCloud'];
}

export default function WordCloud({ words }: WordCloudProps) {
  const normalizedWords = useMemo(() => {
    if (!words || words.length === 0) return [];
    const maxWeight = Math.max(...words.map(w => w.weight));
    const minWeight = Math.min(...words.map(w => w.weight));
    
    return words.map(w => {
      // Normalize weight between 1 and 3 for em sizes
      const normalized = maxWeight === minWeight ? 1.5 : 1 + ((w.weight - minWeight) / (maxWeight - minWeight)) * 2;
      return {
        ...w,
        fontSize: `${normalized + 0.5}rem`
      };
    }).sort(() => Math.random() - 0.5); // Shuffle for a more organic look
  }, [words]);

  return (
    <div className="flex flex-wrap justify-center items-center gap-4 p-8 bg-white border border-gray-100 rounded-2xl shadow-sm">
      {normalizedWords.map((word, i) => (
        <span
          key={i}
          style={{ fontSize: word.fontSize }}
          className={`
            leading-none font-medium transition-transform hover:scale-110 cursor-default
            ${word.sentiment === 'positive' ? 'text-green-600' : ''}
            ${word.sentiment === 'negative' ? 'text-rose-600' : ''}
            ${word.sentiment === 'neutral' ? 'text-gray-500' : ''}
          `}
        >
          {word.word}
        </span>
      ))}
    </div>
  );
}
