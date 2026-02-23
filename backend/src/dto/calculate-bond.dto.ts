import { IsEnum, IsNumber, IsPositive, Max, Min } from 'class-validator';

export enum CouponFrequency {
    ANNUAL = 'annual',
    SEMI_ANNUAL = 'semi-annual',
}

export class CalculateBondDto {
    @IsNumber()
    @IsPositive()
    faceValue: number;

    @IsNumber()
    @Min(0)
    @Max(20)
    couponRate: number;

    @IsNumber()
    @IsPositive()
    marketPrice: number;

    @IsNumber()
    @IsPositive()
    yearsToMaturity: number;

    @IsEnum(CouponFrequency)
    frequency: CouponFrequency;
}
