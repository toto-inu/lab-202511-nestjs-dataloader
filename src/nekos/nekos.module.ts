import { Module } from '@nestjs/common';
import { NekosService } from './nekos.service';
import { NekosResolver } from './nekos.resolver';

@Module({
  providers: [NekosResolver, NekosService],
})
export class NekosModule {}
