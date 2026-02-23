export class CashFlowEntry {
    period: number;
    paymentDate: string;
    couponPayment: number;
    cumulativeInterest: number;
    remainingPrincipal: number;
}

export class BondCalculationResultDto {
    currentYield: number;
    yieldToMaturity: number;
    totalInterest: number;
    status: 'premium' | 'discount' | 'par';
    cashFlows: CashFlowEntry[];
}
