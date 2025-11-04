import { Resolver, Query, ResolveField, Parent } from '@nestjs/graphql';
import { User } from './user.model';
import { Profile } from '../profile/profile.model';
import { UserService } from './user.service';
import { ProfileService } from '../profile/profile.service';
import { ProfileDataLoader } from '../profile/profile.dataloader';

@Resolver(() => User)
export class UserResolver {
  // 環境変数でDataLoaderの使用を切り替え
  private readonly useDataLoader = process.env.USE_DATALOADER === 'true';

  constructor(
    private readonly userService: UserService,
    private readonly profileService: ProfileService,
    private readonly profileDataLoader: ProfileDataLoader,
  ) {
    console.log('\x1b[33m%s\x1b[0m', `⚙️  DataLoader: ${this.useDataLoader ? 'ENABLED ✅' : 'DISABLED ❌'}`);
  }

  @Query(() => [User], { name: 'users' })
  async getUsers(): Promise<User[]> {
    console.log('\n\x1b[36m%s\x1b[0m', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\x1b[36m%s\x1b[0m', '📊 GraphQL Query: users { id, name, profile { bio, avatar } }');
    console.log('\x1b[36m%s\x1b[0m', `⚙️  DataLoader: ${this.useDataLoader ? 'ENABLED' : 'DISABLED'}`);
    console.log('\x1b[36m%s\x1b[0m', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    return this.userService.findAll();
  }

  @ResolveField(() => Profile, { nullable: true })
  async profile(@Parent() user: User): Promise<Profile | null> {
    if (this.useDataLoader) {
      // DataLoaderを使用（最適化版）
      return this.profileDataLoader.load(user.id);
    } else {
      // DataLoaderを使用しない（N+1問題が発生）
      return this.profileService.findByUserId(user.id);
    }
  }
}
