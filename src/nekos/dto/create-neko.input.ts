import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateNekoInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
