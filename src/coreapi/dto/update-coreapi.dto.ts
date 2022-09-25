import { PartialType } from '@nestjs/mapped-types';
import { CreateCoreapiDto } from './create-coreapi.dto';

export class UpdateCoreapiDto extends PartialType(CreateCoreapiDto) {}
