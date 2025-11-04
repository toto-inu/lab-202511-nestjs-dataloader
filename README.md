# NestJS GraphQL DataLoader 検証ラボ

このプロジェクトは、記事「NestJSのGraphQLで"ローダーって何？"をちゃんと理解する」の内容を実際に検証するための実装です。

## 概要

DataLoaderを使用することで、GraphQLのN+1問題を解決する様子を実際のコードとログで確認できます。

- **N+1問題の再現**: DataLoaderなしで11回のクエリが発生
- **最適化の実証**: DataLoaderありで2回のクエリに削減（82%削減）
- **環境変数で切り替え**: `USE_DATALOADER`で動作を比較可能

## 技術スタック

- **Runtime**: Bun
- **Framework**: NestJS
- **GraphQL**: Apollo Server
- **ORM**: Prisma
- **Database**: PostgreSQL (Docker)
- **DataLoader**: dataloader

## セットアップ

### 1. 依存関係のインストール

```bash
bun install
```

### 2. データベースのセットアップ

Dockerを使ってPostgreSQLを起動し、マイグレーションとシードデータを投入します：

```bash
bun run db:setup
```

このコマンドは以下を実行します：
- Docker ComposeでPostgreSQLコンテナを起動
- Prismaマイグレーションの実行
- 100件のユーザーとプロフィールデータを生成

### 3. Prisma Clientの生成

```bash
bun run prisma:generate
```

## 使い方

### DataLoaderなしで起動（N+1問題を確認）

```bash
USE_DATALOADER=false bun run start:dev
```

### DataLoaderありで起動（最適化を確認）

```bash
USE_DATALOADER=true bun run start:dev
```

### GraphQL Playgroundにアクセス

ブラウザで以下にアクセス：

```
http://localhost:3000/graphql
```

## テストクエリ

以下のクエリをGraphQL Playgroundで実行してください：

```graphql
query GetUsersWithProfiles {
  users {
    id
    name
    profile {
      id
      bio
      avatar
    }
  }
}
```

## 期待される結果

### DataLoaderなし（`USE_DATALOADER=false`）

コンソール出力：
```
📋 UserService.findAll() called
🔍 Database Query: SELECT * FROM users LIMIT 10

❌ ProfileService.findByUserId(1) - N+1 Query!
🔍 Database Query: SELECT * FROM profiles WHERE user_id = 1

❌ ProfileService.findByUserId(2) - N+1 Query!
🔍 Database Query: SELECT * FROM profiles WHERE user_id = 2

... (10回繰り返し)
```

**合計: 11回のクエリ** (ユーザー取得 1回 + プロフィール取得 10回)

### DataLoaderあり（`USE_DATALOADER=true`）

コンソール出力：
```
📋 UserService.findAll() called
🔍 Database Query: SELECT * FROM users LIMIT 10

🚀 DataLoader batch function called
   Batching 10 profile requests into 1 query

✅ ProfileService.findByUserIds([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) - Optimized Query!
🔍 Database Query: SELECT * FROM profiles WHERE user_id IN (1,2,3,4,5,6,7,8,9,10)
```

**合計: 2回のクエリ** (ユーザー取得 1回 + プロフィール一括取得 1回)

**改善率: 82%削減** (11 → 2クエリ)

## プロジェクト構成

```
.
├── prisma/
│   ├── schema.prisma          # データベーススキーマ
│   └── seed.ts                # シードデータ生成
├── src/
│   ├── prisma/
│   │   ├── prisma.module.ts   # Prismaモジュール
│   │   └── prisma.service.ts  # クエリログ付きPrismaサービス
│   ├── user/
│   │   ├── user.model.ts      # GraphQLスキーマ定義
│   │   ├── user.service.ts    # ユーザー取得ロジック
│   │   ├── user.resolver.ts   # GraphQLリゾルバー
│   │   └── user.module.ts     # ユーザーモジュール
│   ├── profile/
│   │   ├── profile.model.ts   # GraphQLスキーマ定義
│   │   ├── profile.service.ts # プロフィール取得ロジック
│   │   └── profile.dataloader.ts # DataLoader実装
│   ├── app.module.ts          # アプリケーションルート
│   └── main.ts                # エントリーポイント
├── scripts/
│   └── test-comparison.ts     # パフォーマンステスト
├── test-queries.md            # テストクエリ集
└── docker-compose.yml         # PostgreSQL設定
```

## 重要な実装ポイント

### 1. DataLoaderの実装 (src/profile/profile.dataloader.ts)

```typescript
@Injectable({ scope: Scope.REQUEST })
export class ProfileDataLoader {
  private readonly loader: DataLoader<number, Profile | null>;

  constructor(private readonly profileService: ProfileService) {
    this.loader = new DataLoader<number, Profile | null>(
      async (userIds: readonly number[]) => {
        // 一度に全てのプロフィールを取得
        const profiles = await this.profileService.findByUserIds([...userIds]);

        // userIdの順序に合わせて結果を並べ替え
        const profileMap = new Map(profiles.map(p => [p.userId, p]));
        return userIds.map(userId => profileMap.get(userId) || null);
      }
    );
  }

  load(userId: number): Promise<Profile | null> {
    return this.loader.load(userId);
  }
}
```

### 2. リゾルバーでの切り替え (src/user/user.resolver.ts)

```typescript
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
```

### 3. リクエストスコープ

DataLoaderは`Scope.REQUEST`で動作し、リクエストごとに新しいインスタンスが作成されます。これにより：
- 異なるリクエスト間でキャッシュが共有されない
- データの整合性が保たれる

## スクリプト一覧

```bash
# 開発サーバー起動
bun run start:dev

# データベースセットアップ
bun run db:setup

# Prismaマイグレーション
bun run prisma:migrate

# シードデータ投入
bun run prisma:seed

# Prisma Client生成
bun run prisma:generate

# パフォーマンステスト
bun run test:comparison
```

## トラブルシューティング

### データベースに接続できない

```bash
# Dockerコンテナの状態確認
docker-compose ps

# コンテナの再起動
docker-compose down
docker-compose up -d
```

### Prisma Clientが見つからない

```bash
bun run prisma:generate
```

### ポート3000が使用中

.envファイルを編集してポートを変更：
```
PORT=3001
```

## 参考資料

- [NestJS GraphQL Documentation](https://docs.nestjs.com/graphql/quick-start)
- [DataLoader GitHub](https://github.com/graphql/dataloader)
- [Prisma Documentation](https://www.prisma.io/docs)

## ライセンス

MIT
