import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ParismaService } from './parisma.service';
import { CreateParismaDto } from './dto/create-parisma.dto';
import { UpdateParismaDto } from './dto/update-parisma.dto';

@Controller('parisma')
export class ParismaController {
  constructor(private readonly parismaService: ParismaService) {}

  @Post()
  create(@Body() createParismaDto: CreateParismaDto) {
    return this.parismaService.create(createParismaDto);
  }

  @Get()
  findAll() {
    return this.parismaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.parismaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateParismaDto: UpdateParismaDto) {
    return this.parismaService.update(+id, updateParismaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.parismaService.remove(+id);
  }
}
