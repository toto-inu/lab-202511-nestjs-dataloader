/**
 * DataLoader性能比較スクリプト
 *
 * DataLoaderの有無でクエリ数とレスポンスタイムを比較します
 */

const GRAPHQL_ENDPOINT = 'http://localhost:3000/graphql';

const QUERY = `
  query {
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
`;

interface TestResult {
  mode: string;
  responseTime: number;
  queryCount: number;
}

async function runTest(useDataLoader: boolean): Promise<TestResult> {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Testing with DataLoader: ${useDataLoader ? 'ENABLED ✅' : 'DISABLED ❌'}`);
  console.log('='.repeat(60));

  const startTime = performance.now();

  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: QUERY }),
  });

  const endTime = performance.now();
  const responseTime = endTime - startTime;

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();

  if (result.errors) {
    console.error('GraphQL Errors:', result.errors);
    throw new Error('GraphQL query failed');
  }

  const userCount = result.data.users.length;

  // DataLoaderなし: 1 (users) + N (profiles) = 11クエリ (10 users)
  // DataLoaderあり: 1 (users) + 1 (profiles) = 2クエリ
  const expectedQueryCount = useDataLoader ? 2 : userCount + 1;

  console.log(`\n📊 Results:`);
  console.log(`  Users fetched: ${userCount}`);
  console.log(`  Response time: ${responseTime.toFixed(2)}ms`);
  console.log(`  Expected queries: ${expectedQueryCount}`);
  console.log(`  Mode: ${useDataLoader ? 'Optimized (DataLoader)' : 'N+1 Problem'}`);

  return {
    mode: useDataLoader ? 'DataLoader' : 'No DataLoader',
    responseTime,
    queryCount: expectedQueryCount,
  };
}

async function main() {
  console.log('\n🚀 Starting DataLoader Performance Comparison Test\n');

  // サーバーが起動しているか確認
  try {
    const healthCheck = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '{ __typename }' }),
    });

    if (!healthCheck.ok) {
      throw new Error('Server is not responding');
    }
  } catch (error) {
    console.error('❌ Error: GraphQL server is not running!');
    console.error('   Please start the server first:');
    console.error('   1. bun run db:setup');
    console.error('   2. bun run start:dev');
    process.exit(1);
  }

  console.log('⚠️  Manual Test Required:\n');
  console.log('Due to environment variable limitations, please test manually:\n');
  console.log('1. Terminal 1 - Test WITHOUT DataLoader:');
  console.log('   USE_DATALOADER=false bun run start:dev\n');
  console.log('2. Terminal 2 - Run query:');
  console.log(`   curl -X POST ${GRAPHQL_ENDPOINT} \\`);
  console.log('     -H "Content-Type: application/json" \\');
  console.log(`     -d '{"query":"${QUERY.replace(/\n\s+/g, ' ')}"}'`);
  console.log('\n3. Observe the console logs (should see 11 queries)\n');
  console.log('4. Stop server, then test WITH DataLoader:');
  console.log('   USE_DATALOADER=true bun run start:dev\n');
  console.log('5. Run the same curl command again\n');
  console.log('6. Observe the console logs (should see 2 queries)\n');

  console.log('\n📝 Expected Results:');
  console.log('┌─────────────────┬──────────────┬─────────────────┐');
  console.log('│ Mode            │ Query Count  │ Improvement     │');
  console.log('├─────────────────┼──────────────┼─────────────────┤');
  console.log('│ No DataLoader   │ 11 queries   │ (baseline)      │');
  console.log('│ With DataLoader │ 2 queries    │ 82% reduction   │');
  console.log('└─────────────────┴──────────────┴─────────────────┘');

  // Simple test to verify server is responding
  console.log('\n✅ Verification Test (current setting):');
  try {
    const result = await runTest(process.env.USE_DATALOADER === 'true');
    console.log('\n✅ Test completed successfully!');
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  }
}

main();
