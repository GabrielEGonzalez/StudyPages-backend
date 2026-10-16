import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PagesService } from './pages.service.js';
import { CreatePageDto } from './dto/create-page.dto.js';

@Controller('subjects')
export class SubjectPagesController {
  constructor(private readonly pagesService: PagesService) {}

  // GET /subjects/:subjectId/pages
  @Get(':subjectId/pages')
  findPagesBySubject(@Param('subjectId', ParseUUIDPipe) subjectId: string) {
    return this.pagesService.findPagesBySubject(subjectId);
  }

  // POST /subjects/:subjectId/pages
  @Post(':subjectId/pages')
  create(
    @Param('subjectId', ParseUUIDPipe) subjectId: string,
    @Body() createPageDto: CreatePageDto,
  ) {
    return this.pagesService.create(subjectId, createPageDto);
  }
}