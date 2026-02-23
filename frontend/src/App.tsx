import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './contexts/ThemeContext';
import { BondCalculatorProvider } from './contexts/BondCalculatorContext';
import { BondParameters } from './components/BondParameters';
import { BondResults } from './components/BondResults';
import { cn } from './utils';

const App: React.FC = () => {
	const { theme, toggleTheme } = useTheme();

	return (
		<BondCalculatorProvider>
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
								className={cn(`p-3 rounded-2xl border transition-all shadow-sm active:scale-95`,
									theme === 'dark' && 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800',
									theme === 'light' && 'bg-white border-slate-200 text-indigo-600 hover:bg-slate-50'
								)}
								aria-label="Toggle Theme"
							>
								{theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
							</button>
						</div>
					</header>

					<main className="grid grid-cols-1 lg:grid-cols-12 gap-6">
						{/* Inputs Section */}
						<div className="lg:col-span-4 space-y-6">
							<BondParameters />
						</div>

						{/* Results Section */}
						<div className="lg:col-span-8 space-y-6">
							<BondResults />
						</div>
					</main>
				</div>
			</div>
		</BondCalculatorProvider>
	);
};

export default App;
