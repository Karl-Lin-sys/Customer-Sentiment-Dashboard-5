/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import ReviewInput from './components/ReviewInput';
import ExecutiveSummary from './components/ExecutiveSummary';
import SentimentChart from './components/SentimentChart';
import WordCloud from './components/WordCloud';
import ChatAssistant from './components/ChatAssistant';
import { SentimentData } from './types';
import { BarChart3, MessageSquareQuote } from 'lucide-react';

export default function App() {
  const [data, setData] = useState<SentimentData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (text: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reviews: text }),
      });
      
      if (!response.ok) {
        throw new Error('Analysis failed to run.');
      }
      
      const result = await response.json();
      if (result.error) throw new Error(result.error);
      
      setData(result);
    } catch (err: any) {
      setError(err.message || 'An error occurred during analysis.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">Sentiment <span className="font-medium text-slate-500">Dashboard</span></h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
            {error}
          </div>
        )}

        {!data ? (
          <div className="max-w-3xl mx-auto mt-12 space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">Understand Your Customers</h2>
              <p className="text-lg text-slate-500">Upload bulk reviews and our AI will extract key themes, sentiment trends, and actionable insights instantly.</p>
            </div>
            <ReviewInput onAnalyze={handleAnalyze} isLoading={isLoading} />
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Top row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <ExecutiveSummary 
                  summary={data.executiveSummary} 
                  actionableItems={data.actionableItems} 
                />
              </div>
              <div className="lg:col-span-1 flex flex-col gap-4">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex-1 flex flex-col items-center justify-center text-center">
                  <MessageSquareQuote className="w-10 h-10 text-indigo-200 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Want to dig deeper?</h3>
                  <p className="text-gray-500 mb-6 text-sm">Open the AI Assistant to ask specific questions about these reviews.</p>
                  <button 
                    onClick={() => {
                      // Trigger clicking the floating chat button
                      document.querySelector<HTMLButtonElement>('.fixed.bottom-6.right-6')?.click();
                    }}
                    className="w-full py-2.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
                  >
                    Open Chat
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <SentimentChart data={data.timeline} />
              </div>
              <div className="flex flex-col gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Key Themes Word Cloud</h3>
                <WordCloud words={data.wordCloud} />
              </div>
            </div>
            
            <div className="flex justify-center pt-8 border-t border-slate-200">
              <button
                onClick={() => setData(null)}
                className="text-slate-500 hover:text-slate-800 font-medium transition-colors"
              >
                Start Over with New Reviews
              </button>
            </div>
          </div>
        )}
      </main>

      <ChatAssistant contextData={data} />
    </div>
  );
}

