import { Module } from '@nestjs/common';
import { AllowancesService } from './allowances.service';
import { AllowancesController } from './allowances.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Allowance, AllowanceSchema } from './schemas/allowance.schema';

@Module({
  imports: [MongooseModule.forFeature([
        { name: Allowance.name, schema: AllowanceSchema },
  ])],
  controllers: [AllowancesController],
  providers: [AllowancesService],
})
export class AllowancesModule {}
