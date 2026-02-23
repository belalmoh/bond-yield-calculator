import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CalculateBondDto, CouponFrequency } from './dto/calculate-bond.dto';
import { BondCalculationResultDto, CashFlowEntry } from './dto/bond-calculation-result.dto';

@Injectable()
export class AppService {
	calculateBondYield(dto: CalculateBondDto): BondCalculationResultDto {
		const { faceValue, couponRate, marketPrice, yearsToMaturity, frequency } = dto;

		const countPerYear = frequency === CouponFrequency.ANNUAL ? 1 : 2;
		const totalPeriods = yearsToMaturity * countPerYear;
		const couponPayment = (faceValue * (couponRate / 100)) / countPerYear;

		const currentYield = this.calculateCurrentYield(faceValue, couponRate, marketPrice);
		const ytm = this.calculateYTM(faceValue, marketPrice, totalPeriods, couponPayment, countPerYear);
		const totalInterest = this.calculateTotalInterest(faceValue, couponRate, yearsToMaturity);
		const status = this.getBondStatus(faceValue, marketPrice);
		const cashFlows = this.generateCashFlows(faceValue, totalPeriods, couponPayment, frequency);

		return {
			currentYield: Number(currentYield.toFixed(2)),
			yieldToMaturity: Number(ytm.toFixed(2)),
			totalInterest: Number(totalInterest.toFixed(2)),
			status,
			cashFlows,
		};
	}

	private calculateCurrentYield(faceValue: number, couponRate: number, marketPrice: number): number {
		return ((faceValue * (couponRate / 100)) / marketPrice) * 100;
	}

	/**
	 * Calculates Yield to Maturity (YTM) using Newton-Raphson iterative method.
	 * Target: Find YTM such that PV(Cash Flows) = Market Price
	 */
	private calculateYTM(
		faceValue: number,
		marketPrice: number,
		totalPeriods: number,
		couponPayment: number,
		countPerYear: number,
	): number {
		let ytm = 0.05; // Initial guess of 5%
		const maxIterations = 100;
		const precision = 0.0001;

		for (let i = 0; i < maxIterations; i++) {
			let pv = 0;
			let derivative = 0;

			// PV and Derivative calculation for each coupon payment
			for (let t = 1; t <= totalPeriods; t++) {
				const discountFactor = Math.pow(1 + ytm / countPerYear, t);
				pv += couponPayment / discountFactor;
				derivative += ((-t * couponPayment) / countPerYear) / (Math.pow(1 + ytm / countPerYear, t + 1));
			}

			// PV and Derivative calculation for the final face value payment
			const finalDiscountFactor = Math.pow(1 + ytm / countPerYear, totalPeriods);
			pv += faceValue / finalDiscountFactor;
			derivative += ((-totalPeriods * faceValue) / countPerYear) / (Math.pow(1 + ytm / countPerYear, totalPeriods + 1));

			const error = pv - marketPrice;

			if (Math.abs(error) < precision) {
				return ytm * 100;
			}

			ytm = ytm - error / derivative;
		}

		// If it doesn't converge, return the best guess or throw error
		return ytm * 100;
	}

	private calculateTotalInterest(faceValue: number, couponRate: number, yearsToMaturity: number): number {
		return faceValue * (couponRate / 100) * yearsToMaturity;
	}

	private getBondStatus(faceValue: number, marketPrice: number): 'premium' | 'discount' | 'par' {
		if (marketPrice > faceValue) return 'premium';
		if (marketPrice < faceValue) return 'discount';
		return 'par';
	}

	private generateCashFlows(
		faceValue: number,
		totalPeriods: number,
		couponPayment: number,
		frequency: CouponFrequency,
	): CashFlowEntry[] {
		const cashFlows: CashFlowEntry[] = [];
		let cumulativeInterest = 0;
		const today = new Date();
		const monthsInterval = frequency === CouponFrequency.ANNUAL ? 12 : 6;

		for (let i = 1; i <= totalPeriods; i++) {
			cumulativeInterest += couponPayment;
			const paymentDate = new Date(today);
			paymentDate.setMonth(today.getMonth() + i * monthsInterval);

			cashFlows.push({
				period: i,
				paymentDate: paymentDate.toISOString(),
				couponPayment: Number(couponPayment.toFixed(2)),
				cumulativeInterest: Number(cumulativeInterest.toFixed(2)),
				remainingPrincipal: i === totalPeriods ? faceValue : 0,
			});
		}

		return cashFlows;
	}
}
