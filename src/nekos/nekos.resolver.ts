import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { NekosService } from './nekos.service';
import { Neko } from './entities/neko.entity';
import { CreateNekoInput } from './dto/create-neko.input';
import { UpdateNekoInput } from './dto/update-neko.input';

@Resolver(() => Neko)
export class NekosResolver {
  constructor(private readonly nekosService: NekosService) {}

  @Mutation(() => Neko)
  createNeko(@Args('createNekoInput') createNekoInput: CreateNekoInput) {
    return this.nekosService.create(createNekoInput);
  }

  @Query(() => [Neko], { name: 'nekos' })
  findAll() {
    return this.nekosService.findAll();
  }

  @Query(() => Neko, { name: 'neko' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.nekosService.findOne(id);
  }

  @Mutation(() => Neko)
  updateNeko(@Args('updateNekoInput') updateNekoInput: UpdateNekoInput) {
    return this.nekosService.update(updateNekoInput.id, updateNekoInput);
  }

  @Mutation(() => Neko)
  removeNeko(@Args('id', { type: () => Int }) id: number) {
    return this.nekosService.remove(id);
  }
}
