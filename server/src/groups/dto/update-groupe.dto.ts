import { PartialType } from '@nestjs/mapped-types';
import { CreateGroupDto } from './create-groupe.dto';

export class UpdateGroupDto extends PartialType(CreateGroupDto) {}