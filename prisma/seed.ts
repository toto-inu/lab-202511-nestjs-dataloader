import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  // Create 100 users with profiles
  for (let i = 1; i <= 100; i++) {
    await prisma.user.create({
      data: {
        name: `User ${i}`,
        profile: {
          create: {
            bio: `Bio for user ${i}. This is a sample biography.`,
            avatar: `https://i.pravatar.cc/150?img=${i}`,
          },
        },
      },
    });
  }

  console.log('✅ Seeding completed! Created 100 users with profiles.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
