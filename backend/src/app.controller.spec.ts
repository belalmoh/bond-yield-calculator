import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CalculateBondDto, CouponFrequency } from './dto/calculate-bond.dto';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('calculateBondYield', () => {
    it('should return bond calculation result for a discount bond', () => {
      const dto: CalculateBondDto = {
        faceValue: 1000,
        couponRate: 5,
        marketPrice: 950,
        yearsToMaturity: 10,
        frequency: CouponFrequency.SEMI_ANNUAL,
      };

      const result = appController.calculateBondYield(dto);

      expect(result).toHaveProperty('currentYield');
      expect(result).toHaveProperty('yieldToMaturity');
      expect(result).toHaveProperty('totalInterest');
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('cashFlows');
      expect(result.status).toBe('discount');
      expect(result.totalInterest).toBe(500);
      expect(result.cashFlows).toHaveLength(20); // 10 years × 2 periods/year
    });

    it('should return "premium" status when market price exceeds face value', () => {
      const dto: CalculateBondDto = {
        faceValue: 1000,
        couponRate: 5,
        marketPrice: 1050,
        yearsToMaturity: 5,
        frequency: CouponFrequency.ANNUAL,
      };

      const result = appController.calculateBondYield(dto);

      expect(result.status).toBe('premium');
      expect(result.cashFlows).toHaveLength(5); // 5 years × 1 period/year
    });

    it('should return "par" status when market price equals face value', () => {
      const dto: CalculateBondDto = {
        faceValue: 1000,
        couponRate: 5,
        marketPrice: 1000,
        yearsToMaturity: 5,
        frequency: CouponFrequency.ANNUAL,
      };

      const result = appController.calculateBondYield(dto);

      expect(result.status).toBe('par');
    });
  });
});
