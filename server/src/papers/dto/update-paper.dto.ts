import { PartialType } from '@nestjs/mapped-types';
import { PaperDto } from './paper.dto';

export class UpdatePapertDto extends PartialType(PaperDto) {}