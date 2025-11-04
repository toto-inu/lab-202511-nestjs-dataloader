import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Profile } from '../profile/profile.model';

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field(() => Profile, { nullable: true })
  profile?: Profile;
}
