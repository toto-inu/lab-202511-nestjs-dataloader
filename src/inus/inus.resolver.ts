import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { InusService } from './inus.service';
import { CreateInusInput } from './dto/create-inus.input';
import { UpdateInusInput } from './dto/update-inus.input';

@Resolver('Inus')
export class InusResolver {
  constructor(private readonly inusService: InusService) {}

  @Mutation('createInus')
  create(@Args('createInusInput') createInusInput: CreateInusInput) {
    return this.inusService.create(createInusInput);
  }

  @Query('inus')
  findAll() {
    return this.inusService.findAll();
  }

  @Query('inus')
  findOne(@Args('id') id: number) {
    return this.inusService.findOne(id);
  }

  @Mutation('updateInus')
  update(@Args('updateInusInput') updateInusInput: UpdateInusInput) {
    return this.inusService.update(updateInusInput.id, updateInusInput);
  }

  @Mutation('removeInus')
  remove(@Args('id') id: number) {
    return this.inusService.remove(id);
  }
}
