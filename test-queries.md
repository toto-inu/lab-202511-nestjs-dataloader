# GraphQL Test Queries

## Basic User Query (Testing DataLoader)

This query will demonstrate the N+1 problem and DataLoader optimization.

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

## Expected Behavior

### Without DataLoader (`USE_DATALOADER=false`)

Console output should show:
```
📋 UserService.findAll() called
🔍 Database Query: SELECT * FROM users LIMIT 10

❌ ProfileService.findByUserId(1) - N+1 Query!
🔍 Database Query: SELECT * FROM profiles WHERE user_id = 1

❌ ProfileService.findByUserId(2) - N+1 Query!
🔍 Database Query: SELECT * FROM profiles WHERE user_id = 2

... (repeated 10 times)
```

**Total: 11 database queries** (1 for users + 10 for profiles)

### With DataLoader (`USE_DATALOADER=true`)

Console output should show:
```
📋 UserService.findAll() called
🔍 Database Query: SELECT * FROM users LIMIT 10

🚀 DataLoader batch function called
   Batching 10 profile requests into 1 query

✅ ProfileService.findByUserIds([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) - Optimized Query!
🔍 Database Query: SELECT * FROM profiles WHERE user_id IN (1,2,3,4,5,6,7,8,9,10)
```

**Total: 2 database queries** (1 for users + 1 for all profiles)

**Improvement: 82% reduction in queries (11 → 2)**

## Testing via cURL

```bash
# Test the query
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { users { id name profile { id bio avatar } } }"
  }'
```

## Testing in GraphQL Playground

1. Open http://localhost:3000/graphql
2. Paste the query above
3. Watch the server console logs to see the difference
