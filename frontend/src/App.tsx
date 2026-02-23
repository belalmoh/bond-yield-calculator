import React, { useState } from 'react';
import {
  Calculator,
  TrendingUp,
  Calendar,
  Info,
  AlertCircle,
  Sun,
  Moon,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { BondInputs, BondCalculationResponse, CouponFrequency } from './types';
import { bondService } from './services/api';
import { useTheme } from './contexts/ThemeContext';

const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [inputs, setInputs] = useState<BondInputs>({
    faceValue: 1000,
    couponRate: 5,
    marketPrice: 950,
    yearsToMaturity: 10,
    frequency: 'semi-annual'
  });

  const [results, setResults] = useState<BondCalculationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateInputs = (): string | null => {
    if (inputs.faceValue <= 0) return 'Face Value must be positive';
    if (inputs.marketPrice <= 0) return 'Market Price must be positive';
    if (inputs.couponRate < 0) return 'Coupon Rate cannot be negative';
    if (inputs.yearsToMaturity <= 0) return 'Years to Maturity must be positive';
    return null;
  };

  const handleCalculate = async () => {
    const errorMsg = validateInputs();
    if (errorMsg) {
      setError(errorMsg);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await bondService.calculate(inputs);
      setResults(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to calculate. Please check if the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof BondInputs, value: string | number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8 text-primary">
        {/* Header */}
        <header className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Bond Analytics</h1>
            <p className="text-slate-500 mt-1 dark:text-slate-400 font-medium">Professional Yield & Cash Flow Calculator</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm text-slate-600 dark:text-slate-400 active:scale-95"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm text-sm font-semibold text-slate-600 dark:text-slate-400 transition-colors">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Dashboard
            </div>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Inputs Section */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bento-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-finance-100 dark:bg-finance-500/10 text-finance-600 dark:text-finance-400 rounded-xl">
                  <Calculator size={20} />
                </div>
                <h2 className="font-bold text-lg">Bond Parameters</h2>
              </div>

              <div className="space-y-5">
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="error-banner"
                    >
                      <AlertCircle size={16} />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-2">
                  <label className="metric-label ml-1">Face Value ($)</label>
                  <input
                    type="number"
                    value={inputs.faceValue}
                    onChange={(e) => handleInputChange('faceValue', Number(e.target.value))}
                    className="input-field"
                    placeholder="1000"
                  />
                </div>

                <div className="space-y-2">
                  <label className="metric-label ml-1">Market Price ($)</label>
                  <input
                    type="number"
                    value={inputs.marketPrice}
                    onChange={(e) => handleInputChange('marketPrice', Number(e.target.value))}
                    className="input-field"
                    placeholder="950"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="metric-label ml-1">Coupon Rate (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={inputs.couponRate}
                      onChange={(e) => handleInputChange('couponRate', Number(e.target.value))}
                      className="input-field"
                      placeholder="5.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="metric-label ml-1">Maturity (Years)</label>
                    <input
                      type="number"
                      value={inputs.yearsToMaturity}
                      onChange={(e) => handleInputChange('yearsToMaturity', Number(e.target.value))}
                      className="input-field"
                      placeholder="10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="metric-label ml-1">Payment Frequency</label>
                  <div className="toggle-container">
                    {(['annual', 'semi-annual'] as CouponFrequency[]).map((freq) => (
                      <button
                        key={freq}
                        onClick={() => handleInputChange('frequency', freq)}
                        className={inputs.frequency === freq ? 'toggle-btn-active' : 'toggle-btn-inactive'}
                      >
                        {freq.charAt(0).toUpperCase() + freq.slice(1).replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  disabled={isLoading}
                  onClick={handleCalculate}
                  className={`w-full mt-4 py-4 bg-finance-600 hover:bg-finance-700 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98] ${theme === 'light' ? 'shadow-lg shadow-finance-200' : 'shadow-none'
                    }`}
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : <TrendingUp size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                  {isLoading ? 'Processing...' : 'Analyze Yields'}
                </button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-8 space-y-6">
            {!results && !isLoading ? (
              <div className="h-full min-h-[400px] bento-card dark:border-none flex flex-col items-center justify-center text-center p-8 border-slate-200 dark:border-slate-800">
                <div className="p-4 bg-slate-100 dark:bg-slate-900/40 text-slate-400 dark:text-slate-600 rounded-full mb-4">
                  <Calculator size={48} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200">Ready to Analyze</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-xs mt-2 font-medium">Enter the bond details and click the analysis button to view real-time yield and cash flow data.</p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={results ? 'results' : 'loading'}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {isLoading ? (
                    <div className="h-[200px] bento-card dark:border-none flex items-center justify-center">
                      <div className="flex flex-col items-center gap-4">
                        <Loader2 className="animate-spin text-finance-600" size={40} />
                        <p className="text-slate-500 dark:text-slate-400 font-bold tracking-tight">Crunching the numbers...</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bento-card p-6 bg-finance-950 border-none relative overflow-hidden group">
                          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform text-white">
                            <TrendingUp size={64} />
                          </div>
                          <p className="text-finance-300 text-xs font-bold uppercase tracking-widest mb-2">Yield To Maturity</p>
                          <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-white">{results?.yieldToMaturity.toFixed(2)}%</span>
                          </div>
                          <div className="mt-4 h-1 w-full bg-finance-900 rounded-full overflow-hidden">
                            <div className="h-full bg-finance-400 w-3/4 rounded-full" />
                          </div>
                        </div>

                        <div className="bento-card p-6 flex flex-col justify-between">
                          <div>
                            <p className="metric-label">Current Yield</p>
                            <h4 className="metric-value">{results?.currentYield.toFixed(2)}%</h4>
                          </div>
                          <div className="mt-4 flex items-center gap-2 text-slate-500 text-sm font-medium">
                            <Info size={14} />
                            Annual coupon / Price
                          </div>
                        </div>

                        <div className="bento-card p-6 flex flex-col justify-between">
                          <div>
                            <p className="metric-label">Premium/Discount</p>
                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold mt-1 ${results?.status === 'Discount'
                              ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                              : results?.status === 'Premium'
                                ? 'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400'
                              }`}>
                              {results?.status}
                            </div>
                          </div>
                          <h4 className="font-bold mt-4 text-sm leading-tight">
                            Trading at <span className={results?.status === 'Discount' ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'}>
                              ${Math.abs(inputs.faceValue - inputs.marketPrice).toLocaleString()} {results?.status === 'Discount' ? 'Below' : 'Above'} Par
                            </span>
                          </h4>
                        </div>
                      </div>

                      <div className="bento-card dark:border-none flex flex-col min-h-[400px]">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl">
                              <Calendar size={20} />
                            </div>
                            <h3 className="font-bold text-slate-800 dark:text-slate-200">Cash Flow Projection</h3>
                          </div>
                          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-tighter">
                            {results?.cashFlows.length} PAYMENTS
                          </div>
                        </div>

                        <div className="flex-1 overflow-auto p-0 scroll-smooth max-h-[400px]">
                          <table className="w-full text-left border-collapse">
                            <thead className="sticky top-0 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-md shadow-sm z-10 border-b border-slate-200 dark:border-slate-800">
                              <tr>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Period</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Payment Date</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] text-right">Coupon</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] text-right">Remaining</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                              {results?.cashFlows.map((flow) => (
                                <tr key={flow.period} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                                  <td className="px-6 py-4 font-bold text-slate-700 dark:text-100">{flow.period}</td>
                                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-medium text-sm">{flow.paymentDate}</td>
                                  <td className="px-6 py-4 text-right font-bold text-finance-600 dark:text-finance-400">${flow.payment.toFixed(2)}</td>
                                  <td className="px-6 py-4 text-right font-mono text-slate-400 dark:text-slate-500 text-xs">${flow.remainingPrincipal.toLocaleString()}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
