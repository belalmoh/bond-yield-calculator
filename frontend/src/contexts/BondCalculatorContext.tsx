import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { BondInputs, BondCalculationResponse } from '../types';
import { bondService } from '../services/api';

interface BondCalculatorContextType {
    inputs: BondInputs;
    results: BondCalculationResponse | null;
    isLoading: boolean;
    error: string | null;
    handleInputChange: (field: keyof BondInputs, value: string | number) => void;
    handleCalculate: () => Promise<void>;
}

const BondCalculatorContext = createContext<BondCalculatorContextType | undefined>(undefined);

export const useBondCalculator = () => {
    const context = useContext(BondCalculatorContext);
    if (!context) {
        throw new Error('useBondCalculator must be used within a BondCalculatorProvider');
    }
    return context;
};

export const BondCalculatorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [inputs, setInputs] = useState<BondInputs>({
        faceValue: 1000,
        couponRate: 5,
        marketPrice: 950,
        yearsToMaturity: 10,
        frequency: 'annual'
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
        <BondCalculatorContext.Provider
            value={{
                inputs,
                results,
                isLoading,
                error,
                handleInputChange,
                handleCalculate
            }}
        >
            {children}
        </BondCalculatorContext.Provider>
    );
};
