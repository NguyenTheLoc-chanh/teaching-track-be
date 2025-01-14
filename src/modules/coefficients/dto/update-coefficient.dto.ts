import { PartialType } from '@nestjs/mapped-types';
import { CreateCoefficientDto } from './create-coefficient.dto';

export class UpdateCoefficientDto extends PartialType(CreateCoefficientDto) {}
