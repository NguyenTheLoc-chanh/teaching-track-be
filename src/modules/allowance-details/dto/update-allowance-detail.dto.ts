import { PartialType } from '@nestjs/mapped-types';
import { CreateAllowanceDetailDto } from './create-allowance-detail.dto';

export class UpdateAllowanceDetailDto extends PartialType(CreateAllowanceDetailDto) {}
