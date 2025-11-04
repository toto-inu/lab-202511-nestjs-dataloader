import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { ProfileService } from '../profile/profile.service';
import { ProfileDataLoader } from '../profile/profile.dataloader';

@Module({
  providers: [UserService, UserResolver, ProfileService, ProfileDataLoader],
  exports: [UserService],
})
export class UserModule {}
