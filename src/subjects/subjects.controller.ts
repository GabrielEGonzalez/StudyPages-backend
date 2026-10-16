import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { SubjectsService } from './subjects.service.js';
import { UpdateSubjectDto } from './dto/update-subject.dto.js';
import { CreateSubjectDto } from './dto/create-subject.dto.js';

@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  // GET /subjects
  @Get()
  getSubjects() {
    return this.subjectsService.getListOfSubjects();
  }

  // GET /subjects/:id
  @Get(':id')
  getSubjectById(@Param('id', ParseUUIDPipe) id: string) {
    return this.subjectsService.getSubjectById(id);
  }

  // POST /subjects
  @Post()
  createSubject(@Body() data: CreateSubjectDto) {
    return this.subjectsService.createSubject(data);
  }

  // PATCH /subjects/:id
  @Patch(':id')
  updateSubject(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateSubjectDto,
  ) {
    return this.subjectsService.updateSubject(id, data);
  }

  // PATCH /subjects/:id/restore
  @Patch(':id/restore')
  restoreSubject(@Param('id', ParseUUIDPipe) id: string) {
    return this.subjectsService.restoreSubject(id);
  }

  // DELETE /subjects/:id
  @Delete(':id')
  deleteSubject(@Param('id', ParseUUIDPipe) id: string) {
    return this.subjectsService.deleteSubject(id);
  }
}