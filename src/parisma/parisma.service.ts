import { Injectable } from '@nestjs/common';
import { CreateParismaDto } from './dto/create-parisma.dto';
import { UpdateParismaDto } from './dto/update-parisma.dto';

@Injectable()
export class ParismaService {
  create(createParismaDto: CreateParismaDto) {
    return 'This action adds a new parisma';
  }

  findAll() {
    return `This action returns all parisma`;
  }

  findOne(id: number) {
    return `This action returns a #${id} parisma`;
  }

  update(id: number, updateParismaDto: UpdateParismaDto) {
    return `This action updates a #${id} parisma`;
  }

  remove(id: number) {
    return `This action removes a #${id} parisma`;
  }
}
