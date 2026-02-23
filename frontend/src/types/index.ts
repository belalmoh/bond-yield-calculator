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
    couponPayment: number;
    cumulativeInterest: number;
    remainingPrincipal: number;
}

export interface BondCalculationResponse {
    currentYield: number;
    yieldToMaturity: number;
    totalInterest: number;
    status: 'premium' | 'discount' | 'par';
    cashFlows: CashFlow[];
}

export interface ApiError {
    message: string;
    statusCode: number;
}
