import { Module } from '@nestjs/common';
import { PagesService } from './pages.service.js';
import { PagesController } from './pages.controller.js';
import { SubjectPagesController } from './subject-pages.controller.js';

@Module({
  controllers: [PagesController, SubjectPagesController],
  providers: [PagesService],
})
export class PagesModule {}
