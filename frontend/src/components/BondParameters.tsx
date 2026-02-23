import React from 'react';
import { Calculator, AlertCircle, TrendingUp, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBondCalculator } from '../contexts/BondCalculatorContext';
import { useTheme } from '../contexts/ThemeContext';
import type { CouponFrequency } from '../types';

export const BondParameters: React.FC = () => {
    const { inputs, error, isLoading, handleInputChange, handleCalculate } = useBondCalculator();
    const { theme } = useTheme();

    return (
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
    );
};
