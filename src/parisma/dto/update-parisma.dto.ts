import { PartialType } from '@nestjs/mapped-types';
import { CreateParismaDto } from './create-parisma.dto';

export class UpdateParismaDto extends PartialType(CreateParismaDto) {}
