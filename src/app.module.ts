import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '@/modules/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SubjectsModule }  from '@/modules/subjects/subjects.module';
import { LecturersModule } from '@/modules/lecturers/lecturers.module';
import { Quota } from '@/modules/quotas/schemas/quota.schema';
import { Payrollsheet } from '@/modules/payrollsheet/schemas/payrollsheet.schema';
import { Classroom } from '@/modules/classrooms/schemas/classroom.schema';
import { Timetable } from '@/modules/timetables/schemas/timetable.schema';
import { TeachingLog } from '@/modules/teaching_logs/schemas/teaching_log.schema';
import { Allowance } from '@/modules/allowances/schemas/allowance.schema';
import { AllowanceDetail } from '@/modules/allowance-details/schemas/allowance-detail.schema';
import { Coefficient } from '@/modules/coefficients/schemas/coefficient.schema';
import { CoefficientDetail } from '@/modules/coefficient_details/schemas/coefficient_detail.schema';
import { AuthModule } from '@/auth/auth.module';

@Module({
  imports: [
    UsersModule, 
    SubjectsModule,
    LecturersModule,
    Quota,
    Payrollsheet,
    Classroom,
    Timetable,
    TeachingLog,
    Allowance,
    AllowanceDetail,
    Coefficient,
    CoefficientDetail,
    ConfigModule.forRoot({isGlobal: true,}),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
