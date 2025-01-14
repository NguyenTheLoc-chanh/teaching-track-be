import { PartialType } from '@nestjs/mapped-types';
import { CreateTeachingLogDto } from './create-teaching_log.dto';

export class UpdateTeachingLogDto extends PartialType(CreateTeachingLogDto) {}
