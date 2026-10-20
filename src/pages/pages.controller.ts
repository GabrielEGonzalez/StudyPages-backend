import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PagesService } from './pages.service.js';
import { CreatePageDto } from './dto/create-page.dto.js';   
import { UpdatePageDto } from './dto/update-page.dto.js';

@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  // GET /pages/:id
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.pagesService.findOne(id);
  }

  // PATCH /pages/:id
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePageDto: UpdatePageDto,
  ) {
    return this.pagesService.update(id, updatePageDto);
  }

  // DELETE /pages/:id
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.pagesService.remove(id);
  }

  // PATCH /pages/:id/favorite
  @Patch(':id/favorite')
  toggleFavorite(@Param('id', ParseUUIDPipe) id: string) {
    return this.pagesService.toggleFavorite(id);
  }
}