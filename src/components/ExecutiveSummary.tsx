import React from 'react';
import { SentimentData } from '../types';
import { Target, AlertTriangle } from 'lucide-react';

interface ExecutiveSummaryProps {
  summary: string;
  actionableItems: string[];
}

export default function ExecutiveSummary({ summary, actionableItems }: ExecutiveSummaryProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 md:p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900 mb-4">Executive Summary</h2>
        <p className="text-gray-600 leading-relaxed text-lg mb-8">{summary}</p>
        
        <div className="bg-slate-50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <Target className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-slate-900">Top Areas for Improvement</h3>
          </div>
          
          <ul className="space-y-4">
            {actionableItems.map((item, idx) => (
              <li key={idx} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-sm font-semibold text-slate-600">
                  {idx + 1}
                </div>
                <p className="text-slate-700 leading-relaxed pt-1">{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
