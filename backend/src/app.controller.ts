import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CalculateBondDto } from './dto/calculate-bond.dto';
import { BondCalculationResultDto } from './dto/bond-calculation-result.dto';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('bond/calculate')
  calculateBondYield(@Body() dto: CalculateBondDto): BondCalculationResultDto {
    return this.appService.calculateBondYield(dto);
  }
}
