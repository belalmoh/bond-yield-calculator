export type CouponFrequency = 'annual' | 'semi-annual';

export interface BondInputs {
    faceValue: number;
    couponRate: number;
    marketPrice: number;
    yearsToMaturity: number;
    frequency: CouponFrequency;
}

export interface CashFlow {
    period: number;
    paymentDate: string;
    payment: number;
    cumulativeInterest: number;
    remainingPrincipal: number;
}

export interface BondCalculationResponse {
    currentYield: number;
    yieldToMaturity: number;
    totalInterestEarned: number;
    status: 'Premium' | 'Discount' | 'Par';
    cashFlows: CashFlow[];
}

export interface ApiError {
    message: string;
    statusCode: number;
}
