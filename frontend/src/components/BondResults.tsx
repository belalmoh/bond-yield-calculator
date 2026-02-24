import React from 'react';
import { Calculator, TrendingUp, Info, Calendar, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBondCalculator } from '../contexts/BondCalculatorContext';

export const BondResults: React.FC = () => {
    const { inputs, results, isLoading } = useBondCalculator();

    if (!results && !isLoading) {
        return (
            <div className="h-full min-h-[400px] bento-card dark:border-none flex flex-col items-center justify-center text-center p-8 border-slate-200 dark:border-slate-800">
                <div className="p-4 bg-slate-100 dark:bg-slate-900/40 text-slate-400 dark:text-slate-600 rounded-full mb-4">
                    <Calculator size={48} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200">Ready to Analyze</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-xs mt-2 font-medium">Enter the bond details and click the analysis button to view real-time yield and cash flow data.</p>
            </div>
        );
    }

    return (
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
                            <p className="text-slate-500 dark:text-slate-100 font-bold tracking-tight">Crunching the numbers...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

                            <div className="bento-card p-6 flex flex-col justify-between dark:border-none">
                                <div>
                                    <p className="metric-label">Current Yield</p>
                                    <h4 className="metric-value">{results?.currentYield.toFixed(2)}%</h4>
                                </div>
                                <div className="mt-4 flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
                                    <Info size={14} />
                                    Annual coupon / Price
                                </div>
                            </div>

                            <div className="bento-card p-6 flex flex-col justify-between dark:border-none">
                                <div>
                                    <p className="metric-label">Premium/Discount</p>
                                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold mt-1 ${results?.status === 'discount'
                                        ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                                        : results?.status === 'premium'
                                            ? 'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400'
                                        }`}>
                                        {results?.status ? results.status.charAt(0).toUpperCase() + results.status.slice(1) : ''}
                                    </div>
                                </div>
                                <h4 className="font-bold mt-4 text-sm leading-tight">
                                    Trading at <span className={results?.status === 'discount' ? 'text-emerald-600 dark:text-emerald-400' : results?.status === 'premium' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300'}>
                                        ${Math.abs(inputs.faceValue - inputs.marketPrice).toLocaleString()} {results?.status === 'discount' ? 'Below' : results?.status === 'premium' ? 'Above' : 'At'} Par
                                    </span>
                                </h4>
                            </div>

                            <div className="bento-card p-6 flex flex-col justify-between dark:border-none">
                                <div>
                                    <p className="metric-label">Total Interest Earned</p>
                                    <h4 className="metric-value">${results?.totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h4>
                                </div>
                                <div className="mt-4 flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
                                    <Info size={14} />
                                    Over total maturity
                                </div>
                            </div>
                        </div>

                        <div className="bento-card dark:border-none flex flex-col min-h-[400px]">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900">
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
                                    <thead className="sticky top-0 bg-slate-50 dark:bg-slate-900 backdrop-blur-md shadow-sm z-10 border-b border-slate-200 dark:border-slate-800">
                                        <tr>
                                            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 dark:text-slate-200 uppercase tracking-[0.2em]">Period</th>
                                            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 dark:text-slate-200 uppercase tracking-[0.2em]">Payment Date</th>
                                            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 dark:text-slate-200 uppercase tracking-[0.2em] text-right">Coupon</th>
                                            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 dark:text-slate-200 uppercase tracking-[0.2em] text-right">Cumulative Interest</th>
                                            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 dark:text-slate-200 uppercase tracking-[0.2em] text-right">Remaining</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {results?.cashFlows.map((flow) => (
                                            <tr key={flow.period} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="px-6 py-4 font-bold text-slate-700 dark:text-slate-200">{flow.period}</td>
                                                <td className="px-6 py-4 text-slate-500 dark:text-slate-300 font-medium text-sm">
                                                    {new Intl.DateTimeFormat('en-GB').format(new Date(flow.paymentDate))}
                                                </td>
                                                <td className="px-6 py-4 text-right font-bold text-finance-600 dark:text-finance-400">${flow.couponPayment.toFixed(2)}</td>
                                                <td className="px-6 py-4 text-right font-mono text-emerald-600 dark:text-emerald-400 text-sm font-semibold">${flow.cumulativeInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                                <td className="px-6 py-4 text-right font-mono text-slate-400 dark:text-slate-400 text-xs">${flow.remainingPrincipal.toLocaleString()}</td>
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
    );
};
