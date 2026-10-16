import {Injectable,NotFoundException,BadRequestException} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Subject } from '../generated/prisma/client.js';
import { CreateSubjectDto } from './dto/create-subject.dto.js';
import { UpdateSubjectDto } from './dto/update-subject.dto.js';

@Injectable()
export class SubjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async getListOfSubjects(): Promise<Subject[]> {
    return this.prisma.subject.findMany({
      where: { deletedAt: null },
      orderBy: { position: 'asc' },
    });
  }

  async getSubjectById(id: string): Promise<Subject> {
    const subject = await this.prisma.subject.findFirst({
      where: { id, deletedAt: null },
    });
    if (!subject) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }
    return subject;
  }

  async createSubject(data: CreateSubjectDto): Promise<Subject> {
    // Verifica que el usuario existe antes de crear la asignatura
    const user = await this.prisma.user.findUnique({
      where: { id: data.userId },
    });
    if (!user) {
      throw new BadRequestException(`User with ID ${data.userId} not found`);
    }

    return this.prisma.subject.create({
      data: {
        userId: data.userId,
        name: data.name,
        description: data.description,
        color: data.color,
        icon: data.icon,
        position: data.position ?? 0,
      },
    });
  }

  async updateSubject(id: string, data: UpdateSubjectDto): Promise<Subject> {
    // Verifica que exista y no esté eliminado
    await this.getSubjectById(id);

    // Solo se permite actualizar estos campos; userId NO se puede cambiar
    return this.prisma.subject.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        color: data.color,
        icon: data.icon,
        position: data.position,
      },
    });
  }

  async deleteSubject(id: string): Promise<Subject> {
    await this.getSubjectById(id);

    return this.prisma.subject.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async restoreSubject(id: string): Promise<Subject> {
    const subject = await this.prisma.subject.findUnique({
      where: { id },
    });
    if (!subject) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }

    return this.prisma.subject.update({
      where: { id },
      data: { deletedAt: null },
    });
  }
}