import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log('\n');
  console.log('\x1b[36m%s\x1b[0m', '═══════════════════════════════════════════════════════════');
  console.log('\x1b[36m%s\x1b[0m', '  🚀 NestJS DataLoader Lab is running!');
  console.log('\x1b[36m%s\x1b[0m', '═══════════════════════════════════════════════════════════');
  console.log('\x1b[32m%s\x1b[0m', `  📍 GraphQL Playground: http://localhost:${port}/graphql`);
  console.log('\x1b[33m%s\x1b[0m', `  ⚙️  USE_DATALOADER: ${process.env.USE_DATALOADER}`);
  console.log('\x1b[36m%s\x1b[0m', '═══════════════════════════════════════════════════════════');
  console.log('\n');
}

bootstrap();
