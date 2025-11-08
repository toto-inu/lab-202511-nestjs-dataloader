import { Injectable } from '@nestjs/common';
import { CreateNekoInput } from './dto/create-neko.input';
import { UpdateNekoInput } from './dto/update-neko.input';

@Injectable()
export class NekosService {
  create(createNekoInput: CreateNekoInput) {
    return 'This action adds a new neko';
  }

  findAll() {
    return `This action returns all nekos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} neko`;
  }

  update(id: number, updateNekoInput: UpdateNekoInput) {
    return `This action updates a #${id} neko`;
  }

  remove(id: number) {
    return `This action removes a #${id} neko`;
  }
}
