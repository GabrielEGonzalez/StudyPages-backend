import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePageDto } from './dto/create-page.dto.js';
import { UpdatePageDto } from './dto/update-page.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class PagesService {
  constructor(private readonly prisma: PrismaService) {}

  // GET /subjects/:subjectId/pages
  async findPagesBySubject(subjectId: string) {
    return this.prisma.page.findMany({
      where: {
        subjectId,
        deletedAt: null,
      },
      orderBy: { position: 'asc' },
    });
  }

  // POST /subjects/:subjectId/pages
  async create(subjectId: string, createPageDto: CreatePageDto) {
    const subject = await this.prisma.subject.findFirst({
      where: { id: subjectId, deletedAt: null },
    });

    if (!subject) {
      throw new NotFoundException(`Subject ${subjectId} not found`);
    }

    return this.prisma.page.create({
      data: {
        title: createPageDto.title,
        content: createPageDto.content ?? '',
        position: createPageDto.position ?? 0,
        isFavorite: createPageDto.isFavorite ?? false,
        subject: {
          connect: { id: subjectId },
        },
      },
    });
  }

  // GET /pages/:id
  async findOne(id: string) {
    const page = await this.prisma.page.findFirst({
      where: { id, deletedAt: null },
    });

    if (!page) {
      throw new NotFoundException(`Page ${id} not found`);
    }

    return page;
  }

  // PATCH /pages/:id
  async update(id: string, updatePageDto: UpdatePageDto) {
    await this.findOne(id);

    return this.prisma.page.update({
      where: { id },
      data: {
        title: updatePageDto.title,
        content: updatePageDto.content,
        position: updatePageDto.position,
        isFavorite: updatePageDto.isFavorite,
      },
    });
  }

  // DELETE /pages/:id  → borrado lógico
  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.page.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  // PATCH /pages/:id/favorite  → toggle real
  async toggleFavorite(id: string) {
    const page = await this.findOne(id);

    return this.prisma.page.update({
      where: { id },
      data: {
        isFavorite: !page.isFavorite,
      },
    });
  }

  // Por si lo necesitas en algún momento (ya no está en rutas)
  async findAll() {
    return this.prisma.page.findMany({
      where: { deletedAt: null },
    });
  }
}