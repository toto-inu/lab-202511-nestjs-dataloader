import { Module } from '@nestjs/common';
import { InusService } from './inus.service';
import { InusResolver } from './inus.resolver';

@Module({
  providers: [InusResolver, InusService],
})
export class InusModule {}
