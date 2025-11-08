import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Neko {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
