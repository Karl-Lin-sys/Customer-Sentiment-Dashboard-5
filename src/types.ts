export interface SentimentData {
  timeline: {
    date: string;
    sentimentScore: number;
  }[];
  wordCloud: {
    word: string;
    weight: number;
    sentiment: 'positive' | 'negative' | 'neutral';
  }[];
  executiveSummary: string;
  actionableItems: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}
