import React, { useState } from 'react';
import { Upload, Loader2, Sparkles } from 'lucide-react';

interface ReviewInputProps {
  onAnalyze: (text: string) => Promise<void>;
  isLoading: boolean;
}

export default function ReviewInput({ onAnalyze, isLoading }: ReviewInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onAnalyze(text);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-50 rounded-lg">
          <Upload className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Upload Raw Reviews</h2>
          <p className="text-sm text-gray-500">Paste your customer feedback below to generate an AI report.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste reviews here... (e.g. 'The app is great but it crashes sometimes...')"
          className="w-full h-64 p-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all resize-none outline-none text-gray-700"
          disabled={isLoading}
        />
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!text.trim() || isLoading}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing Data...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Insights
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
