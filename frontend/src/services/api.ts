import type { BondInputs, BondCalculationResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const bondService = {
    calculate: async (inputs: BondInputs): Promise<BondCalculationResponse> => {
        const response = await fetch(`${API_BASE_URL}/api/bond/calculate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(inputs),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `API Error: ${response.status} ${response.statusText}`);
        }

        return response.json();
    },
};
