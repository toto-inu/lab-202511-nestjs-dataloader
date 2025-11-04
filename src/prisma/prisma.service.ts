import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'stdout',
          level: 'error',
        },
        {
          emit: 'stdout',
          level: 'info',
        },
        {
          emit: 'stdout',
          level: 'warn',
        },
      ],
    });
  }

  async onModuleInit() {
    await this.$connect();

    // Log all queries for debugging N+1 issues
    this.$on('query' as never, (e: any) => {
      console.log('\x1b[36m%s\x1b[0m', '🔍 Database Query:');
      console.log('\x1b[90m%s\x1b[0m', e.query);
      console.log('\x1b[90m%s\x1b[0m', `Params: ${e.params}`);
      console.log('\x1b[90m%s\x1b[0m', `Duration: ${e.duration}ms`);
      console.log('');
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
