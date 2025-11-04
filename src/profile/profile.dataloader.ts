import * as DataLoader from 'dataloader';
import { Injectable, Scope } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Profile } from '@prisma/client';

/**
 * ProfileDataLoader
 *
 * リクエストスコープで動作し、同一リクエスト内でのProfile取得をバッチ処理します。
 * これによりN+1問題を解決します。
 */
@Injectable({ scope: Scope.REQUEST })
export class ProfileDataLoader {
  private readonly loader: DataLoader<number, Profile | null>;

  constructor(private readonly profileService: ProfileService) {
    this.loader = new DataLoader<number, Profile | null>(
      async (userIds: readonly number[]) => {
        console.log('\x1b[35m%s\x1b[0m', '🚀 DataLoader batch function called');
        console.log('\x1b[35m%s\x1b[0m', `   Batching ${userIds.length} profile requests into 1 query`);

        // 一度に全てのプロフィールを取得
        const profiles = await this.profileService.findByUserIds([...userIds]);

        // userIdの順序に合わせて結果を並べ替え
        // DataLoaderは入力の順序と出力の順序が一致することを要求します
        const profileMap = new Map(profiles.map(p => [p.userId, p]));
        return userIds.map(userId => profileMap.get(userId) || null);
      },
      {
        // キャッシュを有効化（デフォルトで有効）
        cache: true,
      }
    );
  }

  /**
   * ユーザーIDからプロフィールを取得
   * DataLoaderが自動的にバッチ処理とキャッシュを行います
   */
  load(userId: number): Promise<Profile | null> {
    return this.loader.load(userId);
  }

  /**
   * 複数のユーザーIDからプロフィールを一度に取得
   */
  loadMany(userIds: number[]): Promise<(Profile | null)[]> {
    return this.loader.loadMany(userIds) as Promise<(Profile | null)[]>;
  }
}
