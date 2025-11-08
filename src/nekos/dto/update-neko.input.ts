import { CreateNekoInput } from './create-neko.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateNekoInput extends PartialType(CreateNekoInput) {
  @Field(() => Int)
  id: number;
}
