import { Module } from '@nestjs/common';
import { CoefficientsService } from './coefficients.service';
import { CoefficientsController } from './coefficients.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Coefficient, CoefficientSchema } from './schemas/coefficient.schema';

@Module({
  imports: [MongooseModule.forFeature([
      { name: Coefficient.name, schema: CoefficientSchema },
  ])],
  controllers: [CoefficientsController],
  providers: [CoefficientsService],
})
export class CoefficientsModule {}
