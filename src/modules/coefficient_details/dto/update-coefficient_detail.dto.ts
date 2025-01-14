import { PartialType } from '@nestjs/mapped-types';
import { CreateCoefficientDetailDto } from './create-coefficient_detail.dto';

export class UpdateCoefficientDetailDto extends PartialType(CreateCoefficientDetailDto) {}
