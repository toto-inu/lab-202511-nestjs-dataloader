import { Injectable } from '@nestjs/common';
import { CreateInusInput } from './dto/create-inus.input';
import { UpdateInusInput } from './dto/update-inus.input';

@Injectable()
export class InusService {
  create(createInusInput: CreateInusInput) {
    return 'This action adds a new inus';
  }

  findAll() {
    return `This action returns all inus`;
  }

  findOne(id: number) {
    return `This action returns a #${id} inus`;
  }

  update(id: number, updateInusInput: UpdateInusInput) {
    return `This action updates a #${id} inus`;
  }

  remove(id: number) {
    return `This action removes a #${id} inus`;
  }
}
