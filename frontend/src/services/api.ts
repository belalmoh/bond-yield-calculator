import type { BondInputs, BondCalculationResponse } from '../types';

const API_BASE_URL = '/api';

export const bondService = {
    calculate: async (inputs: BondInputs): Promise<BondCalculationResponse> => {
        const response = await fetch(`${API_BASE_URL}/bond/calculate`, {
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
