import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Profile } from '@prisma/client';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  /**
   * N+1問題を引き起こすメソッド
   * ユーザー数分だけ個別にクエリが発行される
   */
  async findByUserId(userId: number): Promise<Profile | null> {
    console.log('\x1b[31m%s\x1b[0m', `❌ ProfileService.findByUserId(${userId}) - N+1 Query!`);
    return this.prisma.profile.findUnique({
      where: { userId },
    });
  }

  /**
   * DataLoader用の最適化されたメソッド
   * 複数のuserIdを一度にIN句で取得
   */
  async findByUserIds(userIds: number[]): Promise<Profile[]> {
    console.log('\x1b[32m%s\x1b[0m', `✅ ProfileService.findByUserIds([${userIds.join(', ')}]) - Optimized Query!`);
    return this.prisma.profile.findMany({
      where: {
        userId: {
          in: userIds,
        },
      },
    });
  }
}
