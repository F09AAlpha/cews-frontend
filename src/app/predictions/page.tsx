/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ConversionRateChart } from '@/components/PredictionDashboard/ConversionRateChart';
import { PredictionRateCard } from '@/components/PredictionDashboard/PredictionRateCard';
import { VolatilityAnalysis } from '@/components/PredictionDashboard/VolatilityAnalysis';
import { CorrelationHeatmap } from '@/components/PredictionDashboard/CorrelationHeatmap';
import { AnomalyDetectionChart } from '@/components/PredictionDashboard/AnomalyDetectionChart';
import PredictionAlertTile from '@/components/PredictionDashboard/PredictionAlertTile';
import { BackgroundWrapper } from '@/components/common/BackgroundWrapper';
import AppHeader from '@/components/common/AppHeader';
import { scrollToElement } from '@/utils/scrollUtils';
import { ModernCurrencySelector } from '@/components/PredictionDashboard/ModernCurrencySelector';
import { 
  fetchCurrencyPrediction, 
  fetchVolatilityAnalysis,
  fetchCorrelationAnalysis,
  fetchAnomalyDetection,
  CurrencyPrediction, 
  PredictionValue,
  VolatilityAnalysis as VolatilityAnalysisData,
  CorrelationAnalysis,
  AnomalyDetectionResult
} from '@/lib/api';

// Currency options
const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
  { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
  { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦' },
  { code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭' },
  { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳' },
  { code: 'INR', name: 'Indian Rupee', flag: '🇮🇳' },
  { code: 'HKD', name: 'Hong Kong Dollar', flag: '🇭🇰' },
  { code: 'SGD', name: 'Singapore Dollar', flag: '🇸🇬' },
  { code: 'NZD', name: 'New Zealand Dollar', flag: '🇳🇿' },
  { code: 'MXN', name: 'Mexican Peso', flag: '🇲🇽' },
  { code: 'BRL', name: 'Brazilian Real', flag: '🇧🇷' },
  { code: 'ZAR', name: 'South African Rand', flag: '🇿🇦' },
  { code: 'SEK', name: 'Swedish Krona', flag: '🇸🇪' },
  { code: 'NOK', name: 'Norwegian Krone', flag: '🇳🇴' },
  { code: 'DKK', name: 'Danish Krone', flag: '🇩🇰' },
  { code: 'PLN', name: 'Polish Złoty', flag: '🇵🇱' },
  { code: 'THB', name: 'Thai Baht', flag: '🇹🇭' },
  { code: 'RUB', name: 'Russian Ruble', flag: '🇷🇺' },
  { code: 'TRY', name: 'Turkish Lira', flag: '🇹🇷' },
  { code: 'KRW', name: 'South Korean Won', flag: '🇰🇷' },
  { code: 'IDR', name: 'Indonesian Rupiah', flag: '🇮🇩' },
  { code: 'MYR', name: 'Malaysian Ringgit', flag: '🇲🇾' },
  { code: 'PHP', name: 'Philippine Peso', flag: '🇵🇭' },
  { code: 'TWD', name: 'Taiwan Dollar', flag: '🇹🇼' },
  { code: 'AED', name: 'UAE Dirham', flag: '🇦🇪' },
  { code: 'SAR', name: 'Saudi Riyal', flag: '🇸🇦' },
  { code: 'ILS', name: 'Israeli Shekel', flag: '🇮🇱' },
];

// Sample labels for correlation matrix - these will be replaced with real data
const defaultFactors = ['GDP Growth', 'Inflation', 'Interest Rates', 'News Sentiment', 'Trade Balance'];

export default function PredictionsPage() {
  // References for scroll sections
  const upperSectionRef = useRef<HTMLDivElement>(null);
  const lowerSectionRef = useRef<HTMLDivElement>(null);
  
  // State for animation
  const [showLowerSection, setShowLowerSection] = useState(false);
  
  // Currency selection state
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [targetCurrency, setTargetCurrency] = useState('AUD');
  const [amount, setAmount] = useState(1);
  
  // Prediction data state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<CurrencyPrediction | null>(null);
  
  // Correlation analysis state
  const [correlationAnalysis, setCorrelationAnalysis] = useState<CorrelationAnalysis | null>(null);
  const [correlationLoading, setCorrelationLoading] = useState(false);
  const [correlationError, setCorrelationError] = useState<string | null>(null);
  
  // Anomaly detection state
  const [anomalyData, setAnomalyData] = useState<AnomalyDetectionResult | null>(null);
  const [anomalyLoading, setAnomalyLoading] = useState(false);
  const [anomalyError, setAnomalyError] = useState<string | null>(null);
  
  // Volatility analysis state
  const [volatilityAnalysis, setVolatilityAnalysis] = useState<VolatilityAnalysisData | null>(null);
  const [volatilityLoading, setVolatilityLoading] = useState(false);
  const [volatilityError, setVolatilityError] = useState<string | null>(null);
  
  // Add state for showing historical data
  const [showHistoricalData, setShowHistoricalData] = useState(true);
  
  // Load prediction data when currencies change
  useEffect(() => {
    const loadPredictionData = async () => {
      if (baseCurrency === targetCurrency) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const result = await fetchCurrencyPrediction(baseCurrency, targetCurrency, {
          forecastHorizon: 7,
          model: 'auto',
          refresh: true,
          backtest: true // Request backtest data
        });
        
        // Force confidence score to be a number
        result.confidenceScore = Number(result.confidenceScore);
        
        console.log(`Page component: Received prediction with confidence score: ${result.confidenceScore} (type: ${typeof result.confidenceScore})`);
        
        setPrediction(result);
      } catch (err) {
        console.error('Error fetching prediction:', err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    
    loadPredictionData();
  }, [baseCurrency, targetCurrency]);
  
  // Load volatility analysis data when currencies change
  useEffect(() => {
    const loadVolatilityData = async () => {
      if (baseCurrency === targetCurrency) return;
      
      setVolatilityLoading(true);
      setVolatilityError(null);
      
      try {
        const result = await fetchVolatilityAnalysis(baseCurrency, targetCurrency, 30);
        setVolatilityAnalysis(result);
      } catch (err) {
        console.error('Error fetching volatility analysis:', err);
        setVolatilityError('Failed to load volatility data. Please try again.');
      } finally {
        setVolatilityLoading(false);
      }
    };
    
    loadVolatilityData();
  }, [baseCurrency, targetCurrency]);
  
  // Load correlation analysis data when currencies change
  useEffect(() => {
    const mounted = { current: true };
    
    const loadCorrelationData = async () => {
      if (baseCurrency === targetCurrency) return;
      
      setCorrelationLoading(true);
      setCorrelationError(null);
      
      try {
        const result = await fetchCorrelationAnalysis(baseCurrency, targetCurrency);
        
        // Prevent state updates if component unmounted
        if (!mounted.current) return;
        
        // Our improved fetchCorrelationAnalysis now always returns a valid structure
        // but we should still check if we actually have any factors to display
        if (!result.influencingFactors || result.influencingFactors.length === 0) {
          console.log('No correlation factors found for this currency pair');
          
          // Set the empty data to state with no error message 
          // (the UI will display an informative message based on the empty factors)
          setCorrelationAnalysis(result);
          setCorrelationError(null);
          setCorrelationLoading(false);
          return;
        }
        
        // Valid data with factors, update state
        setCorrelationAnalysis(result);
        setCorrelationError(null);
      } catch (err) {
        // This should rarely happen now since our API functions handle errors internally
        // But just in case, we'll handle any unexpected errors
        
        // Prevent state updates if component unmounted
        if (!mounted.current) return;
        
        console.error('Unexpected error in correlation data loading:', err);
        
        setCorrelationError('Failed to load correlation data. Please try again later.');
      } finally {
        // Prevent state updates if component unmounted
        if (mounted.current) {
          setCorrelationLoading(false);
        }
      }
    };
    
    loadCorrelationData();
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      mounted.current = false;
    };
  }, [baseCurrency, targetCurrency]);
  
  // Load anomaly detection data when currencies change
  useEffect(() => {
    const mounted = { current: true };
    
    const loadAnomalyData = async () => {
      if (baseCurrency === targetCurrency) return;
      
      setAnomalyLoading(true);
      setAnomalyError(null);
      
      try {
        // Our improved fetchAnomalyDetection function now always returns a valid data structure 
        // even if the API call fails, so we can just use the result directly without try/catch
        // Use 90 days instead of 30 to increase chance of finding anomalies
        const result = await fetchAnomalyDetection(baseCurrency, targetCurrency, 90);
        console.log("Loaded anomaly data:", result);
        
        // Prevent state updates if component unmounted
        if (!mounted.current) return;
        
        // Set the data - either real data or a fallback structure
        setAnomalyData(result);
        setAnomalyError(null);
      } catch (err) {
        // This should rarely happen now since fetchAnomalyDetection handles errors internally
        // But just in case there's some unexpected error:
        
        // Prevent state updates if component unmounted
        if (!mounted.current) return;
        
        console.error('Unexpected error in anomaly data loading:', err);
        setAnomalyError('Failed to load anomaly data. Please try again later.');
      } finally {
        // Prevent state updates if component unmounted
        if (mounted.current) {
          setAnomalyLoading(false);
        }
      }
    };
    
    loadAnomalyData();
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      mounted.current = false;
    };
  }, [baseCurrency, targetCurrency]);
  
  // Prepare correlation data for the heatmap
  const prepareCorrelationHeatmapData = () => {
    // Default empty state
    if (!correlationAnalysis || !correlationAnalysis.influencingFactors || !Array.isArray(correlationAnalysis.influencingFactors)) {
      return { data: [], rowLabels: defaultFactors, colLabels: ['Exchange Rate'] };
    }
    
    // Extract factors from the correlation analysis
    const factors = correlationAnalysis.influencingFactors.filter(factor => 
      factor && typeof factor.factor === 'string' && typeof factor.correlation === 'number'
    );
    
    // If no valid factors found, return default empty state
    if (factors.length === 0) {
      return { data: [], rowLabels: defaultFactors, colLabels: ['Exchange Rate'] };
    }
    
    // Get factor labels for rows - ensure they are strings and unique
    const factorLabels = [...new Set(factors.map(factor => factor.factor))];
    
    // Create heatmap cells - only create correlations between factors and exchange rate
    const heatmapData = [];
    
    // Add correlation between each factor and exchange rate
    for (const factor of factors) {
      heatmapData.push({
        row: factor.factor,
        col: 'Exchange Rate',
        value: factor.correlation
      });
    }
    
    return {
      data: heatmapData,
      rowLabels: factorLabels,
      colLabels: ['Exchange Rate']
    };
  };
  
  // Setup scroll observation
  useEffect(() => {
    // Set up the Intersection Observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        setShowLowerSection(entry.isIntersecting);
      });
    }, { threshold: 0.1 });
    
    // Start observing
    if (lowerSectionRef.current) {
      const currentRef = lowerSectionRef.current;
      observer.observe(currentRef);
    }
    
    return () => {
      // Save a reference to the current value for cleanup
      const currentRef = lowerSectionRef.current;
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);
  
  // Handle currency changes with validation
  const handleBaseCurrencyChange = (currency: string) => {
    if (currency === targetCurrency) {
      // Swap currencies if the same one is selected
      setTargetCurrency(baseCurrency);
    }
    setBaseCurrency(currency);
  };
  
  const handleTargetCurrencyChange = (currency: string) => {
    if (currency === baseCurrency) {
      // Swap currencies if the same one is selected
      setBaseCurrency(targetCurrency);
    }
    setTargetCurrency(currency);
  };
  
  // Toggle function for historical data display
  const toggleHistoricalData = () => {
    setShowHistoricalData(!showHistoricalData);
  };
  
  // Modified createChartData function to filter based on the toggle state
  const createChartData = (predictionValues: PredictionValue[], backtestValues?: PredictionValue[]) => {
    // Log data to verify backtest functionality
    console.log('Rendering chart with:');
    console.log('- Future predictions:', predictionValues?.length || 0);
    console.log('- Historical backtest data:', backtestValues?.length || 0);
    
    // Create data for future predictions
    const futureData = predictionValues.map((value) => ({
      date: new Date(value.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: value.mean,
      isHistorical: false
    }));
    
    // Create data for historical backtest if available and if toggle is enabled
    const historicalData = showHistoricalData && backtestValues ? backtestValues.map((value) => ({
      date: new Date(value.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: value.mean,
      isHistorical: true
    })) : [];
    
    // Combine and sort by date
    const combinedData = [...historicalData, ...futureData].sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
    
    console.log('Combined chart data:', combinedData);
    return combinedData;
  };
  
  // Create prediction rate data from prediction values
  const createPredictionRates = (predictionValues: PredictionValue[], backtestValues?: PredictionValue[]) => {
    // Only include both historical and future data if the toggle is on
    const valuesToUse = showHistoricalData && backtestValues 
      ? [...backtestValues, ...predictionValues].sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        )
      : predictionValues;
    
    return valuesToUse.map((value) => ({
      date: new Date(value.timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      high: value.upper_bound,
      mean: value.mean,
      low: value.lower_bound,
      isHistorical: !!value.isHistorical
    }));
  };
  
  // Handle scroll to lower section
  const handleScrollToLower = () => {
    scrollToElement('lower-section', 80);
  };
  
  // Handle scroll to upper section
  const handleScrollToUpper = () => {
    scrollToElement('upper-section', 80);
  };
  
  // Calculate converted amount
  const convertedAmount = prediction 
    ? amount * prediction.currentRate
    : 0;
  
  // Get heatmap data
  const heatmapProps = prepareCorrelationHeatmapData();
  
  return (
    <BackgroundWrapper>
      <AppHeader />
      <main className="pt-24 px-8 pb-8">
        <div className="max-w-6xl mx-auto relative">
          {/* Upper Section */}
          <section 
            id="upper-section"
            ref={upperSectionRef}
            className="min-h-screen flex flex-col justify-start py-6"
          >
            {/* Currency Converter Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
              {/* Currency Converter Tile */}
              <div className="lg:col-span-12 bg-[#2a2a40] rounded-2xl p-6 min-h-[180px]">
                <h2 className="text-xl font-bold text-white mb-5">Currency Prediction</h2>
                <div className="flex flex-col md:flex-row items-start justify-between w-full gap-6">
                  <div className="w-full md:w-5/12">
                    <ModernCurrencySelector
                      currencies={CURRENCIES}
                      selectedCurrency={baseCurrency}
                      onCurrencyChange={handleBaseCurrencyChange}
                      label="From Currency"
                      amount={amount}
                      onAmountChange={setAmount}
                      showAmount={true}
                    />
                  </div>
                  
                  <div className="flex items-center self-center mt-8">
                    <div className="p-3 rounded-full bg-[#4a4a70]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="w-full md:w-5/12">
                    <ModernCurrencySelector
                      currencies={CURRENCIES}
                      selectedCurrency={targetCurrency}
                      onCurrencyChange={handleTargetCurrencyChange}
                      label="To Currency"
                      value={prediction ? `${convertedAmount.toFixed(2)}` : '-'}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center py-24">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : error ? (
              <div className="bg-[#2a2a40] rounded-2xl p-6 text-center my-12">
                <div className="flex flex-col items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div className="text-xl font-semibold mb-2 text-white">Prediction Error</div>
                  
                  {error.includes('timeout') || error.includes('Gateway') ? (
                    <div className="mb-4 text-gray-300">
                      <p className="mb-2">The prediction request timed out. This could be due to:</p>
                      <ul className="text-left list-disc pl-5 mb-4">
                        <li>High server load</li>
                        <li>Complex prediction calculations for this currency pair</li>
                        <li>Temporary network issues</li>
                      </ul>
                      <p>Try using the statistical model which is faster, or try again later.</p>
                    </div>
                  ) : error.includes('500') ? (
                    <div className="mb-4 text-gray-300">
                      <p className="mb-2">The server encountered an error processing your request.</p>
                      <p>This might be a temporary issue. Please try again with different settings.</p>
                    </div>
                  ) : (
                    <div className="mb-4 text-gray-300">{error}</div>
                  )}
                  
                  <div className="flex flex-col sm:flex-row gap-3 mt-2">
                    <button 
                      onClick={() => {
                        setError(null);
                        setLoading(true);
                        fetchCurrencyPrediction(baseCurrency, targetCurrency, {
                          forecastHorizon: 7,
                          model: 'auto',
                          refresh: true,
                          backtest: true
                        })
                          .then(result => {
                            result.confidenceScore = Number(result.confidenceScore);
                            setPrediction(result);
                            setLoading(false);
                          })
                          .catch(err => {
                            console.error('Error retrying prediction fetch:', err);
                            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
                            setError(errorMessage);
                            setLoading(false);
                          });
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-white"
                    >
                      Try Again
                    </button>
                    
                    <button 
                      onClick={() => {
                        setError(null);
                        setLoading(true);
                        fetchCurrencyPrediction(baseCurrency, targetCurrency, {
                          forecastHorizon: 7,
                          model: 'statistical', // Use faster statistical model
                          refresh: true,
                          backtest: true
                        })
                          .then(result => {
                            result.confidenceScore = Number(result.confidenceScore);
                            setPrediction(result);
                            setLoading(false);
                          })
                          .catch(err => {
                            console.error('Error retrying prediction fetch with statistical model:', err);
                            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
                            setError(errorMessage);
                            setLoading(false);
                          });
                      }}
                      className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-white"
                    >
                      Try With Faster Model
                    </button>
                  </div>
                  
                  <div className="mt-4 text-xs text-gray-400">
                    If the issue persists, try a different currency pair or check back later.
                  </div>
                </div>
              </div>
            ) : prediction ? (
              <>
                {/* Chart and Prediction Rate Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
                  <div className="lg:col-span-8">
                    <div className="bg-[#2a2a40] rounded-2xl p-6">
                      <div className="font-medium text-lg text-white flex justify-between items-center">
                        <div className="text-white">{baseCurrency} to {targetCurrency} conversion chart</div>
                        <div className="text-purple-400 font-bold">
                          1 {baseCurrency} = <span className="text-pink-500">{prediction.currentRate.toFixed(5)}</span> {targetCurrency}
                        </div>
                      </div>
                      <div className="text-gray-400 text-sm mb-2">
                        Data range: {prediction.inputDataRange}
                      </div>
                      
                      {/* Historical data toggle switch */}
                      <div className="flex items-center mb-3">
                        <span className="text-gray-400 text-sm mr-2">Show past 7 days:</span>
                        <button 
                          onClick={toggleHistoricalData}
                          className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none ${
                            showHistoricalData ? 'bg-indigo-600' : 'bg-gray-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              showHistoricalData ? 'translate-x-7' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      
                      <div className="h-[300px]">
                        <ConversionRateChart 
                          data={createChartData(prediction.predictionValues, prediction.backtestValues)}
                          fromCurrency={baseCurrency}
                          toCurrency={targetCurrency}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="lg:col-span-4">
                    <PredictionRateCard 
                      predictions={createPredictionRates(prediction.predictionValues, prediction.backtestValues)}
                      initialIndex={0}
                    />
                  </div>
                </div>
                
                {/* Prediction Alert Tile */}
                <div className="mb-8">
                  <PredictionAlertTile 
                    baseCurrency={baseCurrency}
                    targetCurrency={targetCurrency}
                    predictedRates={prediction.predictionValues}
                  />
                </div>
              </>
            ) : null}
            
            {!loading && prediction && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleScrollToLower}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full flex items-center transition-all duration-300"
                >
                  View Analysis
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 ml-2 animate-bounce" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                </button>
              </div>
            )}
          </section>
          
          {/* Lower Section */}
          <section 
            id="lower-section"
            ref={lowerSectionRef}
            className={`min-h-screen transition-opacity duration-1000 ${showLowerSection ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className="pt-16">
              <button
                onClick={handleScrollToUpper}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full flex items-center mb-8 transition-all duration-300"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 mr-2" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" 
                    clipRule="evenodd" 
                  />
                </svg>
                Back to Predictions
              </button>
              
              <h2 className="text-3xl font-bold text-white mb-6">Currency Analysis</h2>
              
              <div className="text-gray-400 mb-8">
                Advanced analysis of the relationship between {baseCurrency} and {targetCurrency}, 
                showing volatility patterns and correlations with major economic factors.
              </div>
              
              {/* Volatility Analysis Section */}
              <div className="mb-10">
                <h3 className="text-2xl font-bold text-white mb-4">Volatility Analysis</h3>
                
                {volatilityLoading ? (
                  <div className="bg-[#2a2a40] rounded-2xl p-6 mb-8 flex justify-center items-center min-h-[200px]">
                    <div className="text-white">Loading volatility analysis...</div>
                  </div>
                ) : volatilityError ? (
                  <div className="bg-[#2a2a40] rounded-2xl p-6 mb-8">
                    <div className="text-red-400">{volatilityError}</div>
                  </div>
                ) : volatilityAnalysis ? (
                  <VolatilityAnalysis 
                    level={volatilityAnalysis.volatilityLevel === 'NORMAL' ? 'LOW' : volatilityAnalysis.volatilityLevel}
                    currentValue={volatilityAnalysis.currentVolatility}
                    averageValue={volatilityAnalysis.averageVolatility}
                    trend={volatilityAnalysis.trend}
                  />
                ) : (
                  <div className="bg-[#2a2a40] rounded-2xl p-6 mb-8">
                    <div className="text-white">No volatility data available</div>
                  </div>
                )}
              </div>
              
              {/* Correlation Analysis Section */}
              <div className="mb-10">
                <h3 className="text-2xl font-bold text-white mb-4">Correlation Analysis</h3>
                
                {correlationLoading ? (
                  <div className="bg-[#2a2a40] rounded-2xl p-6 mb-8 flex justify-center items-center min-h-[300px]">
                    <div className="text-white">Loading correlation analysis...</div>
                  </div>
                ) : correlationError ? (
                  <div className="bg-[#2a2a40] rounded-2xl p-6 mb-8">
                    <div className="flex flex-col items-center justify-center text-center py-8">
                      <div className="text-gray-400 text-lg mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v14a2 2 0 01-2 2z" />
                        </svg>
                        {correlationError}
                      </div>
                      <div className="text-gray-500 text-sm max-w-md">
                        This currency pair may not have sufficient correlation data available yet.
                        Try a different currency pair or check back later.
                      </div>
                    </div>
                  </div>
                ) : correlationAnalysis ? (
                  <div className="bg-[#2a2a40] rounded-2xl p-6 mb-8">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        <div className="text-2xl font-bold text-white mr-2">
                          Factors Affecting {baseCurrency}/{targetCurrency}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="text-gray-400 text-sm mr-4">
                          <span className="mr-2">Analysis Period:</span>
                          <span className="text-white">{correlationAnalysis.analysisPeriodDays} days</span>
                        </div>
                        <div className="text-gray-400 text-sm">
                          <span className="mr-2">Confidence:</span>
                          <span className="text-indigo-400 font-bold">{correlationAnalysis.confidenceScore}%</span>
                        </div>
                      </div>
                    </div>
                    
                    {correlationAnalysis.influencingFactors && correlationAnalysis.influencingFactors.length > 0 ? (
                      <>
                        <CorrelationHeatmap 
                          data={heatmapProps.data}
                          rowLabels={heatmapProps.rowLabels}
                          colLabels={heatmapProps.colLabels}
                        />
                        
                        <div className="mt-6 border-t border-gray-700 pt-4">
                          <div className="text-gray-300 text-sm">
                            The data above shows how different economic factors correlate with changes in the {baseCurrency}/{targetCurrency} exchange rate.
                            Factors with higher positive values tend to move in the same direction as the exchange rate, while 
                            those with negative values tend to move in the opposite direction.
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center py-8">
                        <div className="text-gray-400 mb-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v14a2 2 0 01-2 2z" />
                          </svg>
                          No correlation factors found for this currency pair.
                        </div>
                        <div className="text-gray-500 text-sm max-w-md">
                          This currency pair may not have sufficient historical data to establish strong correlations with economic factors.
                          Popular pairs like USD/EUR, USD/GBP, or USD/JPY typically have more correlation data available.
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-[#2a2a40] rounded-2xl p-6 mb-8">
                    <div className="text-white">No correlation data available</div>
                  </div>
                )}
              </div>

              {/* Anomaly Detection Section */}
              <div className="mb-10">
                <h3 className="text-2xl font-bold text-white mb-4">Anomaly Detection</h3>
                
                {anomalyLoading ? (
                  <div className="bg-[#2a2a40] rounded-2xl p-6 mb-8 flex justify-center items-center min-h-[300px]">
                    <div className="text-white">Loading anomaly detection...</div>
                  </div>
                ) : anomalyError ? (
                  <div className="bg-[#2a2a40] rounded-2xl p-6 mb-8">
                    <div className="flex flex-col items-center justify-center text-center py-8">
                      <div className="text-gray-400 text-lg mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        {anomalyError}
                      </div>
                      <div className="text-gray-500 text-sm max-w-md">
                        Anomaly detection data is not available for this currency pair.
                        Try a different currency pair or check back later.
                      </div>
                    </div>
                  </div>
                ) : anomalyData ? (
                  <div className="bg-[#2a2a40] rounded-2xl p-6 mb-8">
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-xl font-bold text-white">Anomaly Detection</div>
                      <div className="bg-[#3b3b60] px-3 py-1 rounded-full text-white text-sm">
                        <span className="text-pink-500 font-bold">{anomalyData.anomaly_count}</span> anomalies found
                      </div>
                    </div>
                    
                    {anomalyData.anomaly_count > 0 ? (
                      <>
                        <div className="text-gray-400 mb-4">
                          Detected <span className="text-pink-500 font-semibold">{anomalyData.anomaly_count}</span> unusual price movements that may indicate market volatility, trading opportunities, or significant economic events. These data points deviate significantly from typical exchange rate patterns based on statistical Z-score analysis.
                        </div>
                        <div className="h-[300px]">
                          <AnomalyDetectionChart 
                            anomalyPoints={anomalyData.anomaly_points}
                            baseCurrency={baseCurrency}
                            targetCurrency={targetCurrency}
                          />
                        </div>
                        <div className="mt-4 text-xs text-gray-500">
                          <span className="text-pink-400 font-semibold">Note:</span> Anomalies are detected using statistical methods that identify exchange rates with Z-scores beyond ±2 standard deviations from the mean, indicating rare price movements that occur in less than 5% of cases.
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center py-12">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-green-500 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="text-white text-lg mb-2">No Anomalies Detected</div>
                        <div className="text-gray-400 max-w-md">
                          We analyzed the recent exchange rate data for {baseCurrency}/{targetCurrency} 
                          over a {anomalyData.analysis_period_days}-day period and found no significant anomalies.
                        </div>
                        <div className="text-gray-500 text-sm mt-3 max-w-md">
                          This suggests that the exchange rate has been following expected patterns. 
                          Anomalies typically appear during major economic events, policy changes, or unexpected market shifts.
                        </div>
                        <div className="mt-4 text-xs text-indigo-400 p-2 border border-indigo-900/50 rounded-md max-w-md bg-indigo-900/20">
                          Try different currency pairs like USD/JPY, EUR/GBP, or USD/BTC which typically show higher volatility and more frequent anomalies due to their sensitivity to market events.
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-[#2a2a40] rounded-2xl p-6 mb-8">
                    <div className="text-white">No anomaly detection data available</div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </BackgroundWrapper>
  );
} 