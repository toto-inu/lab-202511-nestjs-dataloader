import { CreateInusInput } from './create-inus.input';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateInusInput extends PartialType(CreateInusInput) {
  id: number;
}
