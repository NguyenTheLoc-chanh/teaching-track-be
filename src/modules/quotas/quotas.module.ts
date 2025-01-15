import { Module } from '@nestjs/common';
import { QuotasService } from './quotas.service';
import { QuotasController } from './quotas.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Quota, QuotaSchema } from './schemas/quota.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Quota.name, schema: QuotaSchema }])],
  controllers: [QuotasController],
  providers: [QuotasService],
})
export class QuotasModule {}
