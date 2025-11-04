import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Profile {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  userId: number;

  @Field()
  bio: string;

  @Field()
  avatar: string;
}
