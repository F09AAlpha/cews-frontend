'use client';

import React, { useState, useEffect } from 'react';
import { CurrencyConverter } from '@/components/CurrencyDashboard/CurrencyConverter';
import { ConversionChart } from '@/components/CurrencyDashboard/ConversionChart';
import { MarketNews } from '@/components/CurrencyDashboard/MarketNews';
import { PredictedRate } from '@/components/CurrencyDashboard/PredictedRate';
import { AlertSubscription } from '@/components/CurrencyDashboard/AlertSubscription';
import { fetchMarketNews } from '@/lib/api';

// Define interfaces for API response types
interface NewsArticle {
  title: string;
  urlToImage?: string;
  url: string;
  source?: {
    name?: string;
  };
  publishedAt?: string;
}

// Define interface for your component's news items
interface NewsItem {
  id: string;
  title: string;
  imageUrl: string;
  url?: string;
  source?: string;
  publishedAt?: string;
}

export default function Home() {
  const [amount, setAmount] = useState(1000);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Sample data - replace with real data from API
  const data = {
    from: 'USD',
    to: 'AUD',
    rate: 1.58692,
    amount: amount,
    convertedAmount: amount * 1.58692,
  };

  const chartData = [
    { date: 'Nov 1', value: 52 },
    { date: 'Nov 15', value: 48 },
    { date: 'Nov 30', value: 65 },
  ];

  const prediction = {
    day: 3,
    rate: 1.095,
    change: 1.75,
    confidence: 82.5,
  };

  useEffect(() => {
    const getNews = async () => {
      try {
        setIsLoading(true);
        const articles: NewsArticle[] = await fetchMarketNews();
        
        // Transform the API response to match your news component's expected format
        const formattedNews: NewsItem[] = articles.slice(0, 5).map((article: NewsArticle, index: number) => ({
          id: String(index + 1),
          title: article.title,
          imageUrl: article.urlToImage || '/news/placeholder.jpg',
          url: article.url,
          source: article.source?.name,
          publishedAt: article.publishedAt
        }));
        
        setNews(formattedNews);
      } catch (err) {
        console.error('Failed to fetch news:', err);
        setError('Failed to load market news');
        // Fallback to default news items in case of API failure

      } finally {
        setIsLoading(false);
      }
    };

    getNews();
  }, []);

  return (
    <main className="min-h-screen bg-[#1a1a2e] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-[#2a2a40] rounded-2xl p-6">
              <CurrencyConverter data={data} onAmountChange={setAmount} />
              <ConversionChart data={chartData} rate={data.rate} />
            </div>
          </div>
          <div className="lg:col-span-1 space-y-6">
            {error && <div className="bg-red-500 bg-opacity-10 text-red-300 p-4 rounded-lg">{error}</div>}
            {isLoading ? (
              <div className="bg-[#2a2a40] rounded-2xl p-6 text-center">
                <p className="text-gray-300">Loading market news...</p>
              </div>
            ) : (
              <MarketNews news={news} />
            )}
            <PredictedRate prediction={prediction} />
          </div>
        </div>
        
        <AlertSubscription />
      </div>
    </main>
  );
}