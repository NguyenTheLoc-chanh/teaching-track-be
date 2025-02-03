import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '@/modules/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SubjectsModule }  from '@/modules/subjects/subjects.module';
import { LecturersModule } from '@/modules/lecturers/lecturers.module';
import { AuthModule } from '@/auth/auth.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthGuard } from './auth/passport/jwt-auth.guard';
import { TransformInterceptor } from './core/transform.interceptor';
import { QuotasModule } from '@/modules/quotas/quotas.module';
import { PayrollsheetModule } from '@/modules/payrollsheet/payrollsheet.module';
import { ClassroomsModule } from '@/modules/classrooms/classrooms.module';
import { TimetablesModule } from '@/modules/timetables/timetables.module';
import { TeachingLogsModule } from '@/modules/teaching_logs/teaching_logs.module';
import { AllowancesModule } from '@/modules/allowances/allowances.module';
import { AllowanceDetailsModule } from '@/modules/allowance-details/allowance-details.module';
import { CoefficientsModule } from '@/modules/coefficients/coefficients.module';
import { CoefficientDetailsModule } from '@/modules/coefficient_details/coefficient_details.module';

@Module({
  imports: [
    UsersModule, 
    SubjectsModule,
    LecturersModule,
    QuotasModule,
    PayrollsheetModule,
    ClassroomsModule,
    TimetablesModule,
    TeachingLogsModule,
    AllowancesModule,
    AllowanceDetailsModule,
    CoefficientsModule,
    CoefficientDetailsModule,
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
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
