'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Currency {
  code: string;
  name: string;
  flag: string;
}

interface ModernCurrencySelectorProps {
  currencies: Currency[];
  selectedCurrency: string;
  onCurrencyChange: (currency: string) => void;
  label: string;
  amount?: number;
  onAmountChange?: (amount: number) => void;
  showAmount?: boolean;
  value?: string | number;
}

export const ModernCurrencySelector: React.FC<ModernCurrencySelectorProps> = ({
  currencies,
  selectedCurrency,
  onCurrencyChange,
  label,
  amount,
  onAmountChange,
  showAmount = false,
  value,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedCurrencyInfo = currencies.find(c => c.code === selectedCurrency) || currencies[0];

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredCurrencies = searchQuery.trim() === '' 
    ? currencies
    : currencies.filter(currency => 
        currency.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
        currency.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <div className="flex flex-col">
      <label className="text-sm text-gray-300 mb-2">{label}</label>
      <div 
        ref={dropdownRef}
        className="relative"
      >
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className={`
            flex items-center justify-between p-4 
            bg-gradient-to-r from-[#3a3a60] to-[#2a2a40] 
            border border-[#4a4a70] rounded-xl
            cursor-pointer transition-all
            ${isOpen ? 'ring-2 ring-purple-500' : 'hover:bg-[#3a3a60]'}
          `}
        >
          <div className="flex items-center">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#4a4a70] mr-3">
              <span className="text-lg">{selectedCurrencyInfo.flag}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-medium">{selectedCurrencyInfo.code}</span>
              <span className="text-gray-400 text-xs">{selectedCurrencyInfo.name}</span>
            </div>
          </div>

          {showAmount ? (
            <input
              type="number"
              value={amount}
              onChange={(e) => onAmountChange && onAmountChange(parseFloat(e.target.value) || 0)}
              className="ml-auto text-right bg-transparent border-none text-white font-bold w-20 focus:outline-none"
              onClick={(e) => e.stopPropagation()}
            />
          ) : value ? (
            <span className="ml-auto text-right text-white font-bold w-20">{value}</span>
          ) : null}

          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`w-5 h-5 text-gray-400 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {isOpen && (
          <div className="absolute z-20 mt-2 w-full bg-[#2a2a40] border border-[#4a4a70] rounded-xl shadow-lg overflow-hidden">
            <div className="p-2">
              <input
                type="text"
                placeholder="Search currencies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 bg-[#3a3a60] text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {filteredCurrencies.length > 0 ? (
                filteredCurrencies.map((currency) => (
                  <div
                    key={currency.code}
                    className={`
                      flex items-center p-3 hover:bg-[#3a3a60] cursor-pointer
                      ${currency.code === selectedCurrency ? 'bg-purple-900/30' : ''}
                    `}
                    onClick={() => {
                      onCurrencyChange(currency.code);
                      setIsOpen(false);
                      setSearchQuery('');
                    }}
                  >
                    <span className="mr-3 text-lg">{currency.flag}</span>
                    <div className="flex flex-col">
                      <span className="text-white">{currency.code}</span>
                      <span className="text-gray-400 text-xs">{currency.name}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-3 text-gray-400 text-center">No currencies found</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 