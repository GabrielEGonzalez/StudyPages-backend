import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UserResponseDto } from './dto/user-response.dto.js';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) { }

  /** GET /users/:id */
  async findOne(id: string): Promise<UserResponseDto> {
    this.assertUuid(id);

    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }

    return UserResponseDto.fromEntity(user);
  }

  /** PATCH /users/:id */
  async update(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    this.assertUuid(id);

    // 1. Usuario debe existir
    const existing = await this.prisma.user.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }

    // 2. Si cambia el email, verificar que no esté duplicado
    if (dto.email && dto.email !== existing.email) {
      const duplicate = await this.prisma.user.findUnique({
        where: { email: dto.email },
        select: { id: true },
      });
      if (duplicate && duplicate.id !== id) {
        throw new ConflictException('El correo ya está registrado en otra cuenta');
      }
    }

    // 3. Actualizar solo campos permitidos
    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.email !== undefined && { email: dto.email }),
      },
    });

    return UserResponseDto.fromEntity(updated);
  }

  // ───────── helpers ─────────

  private assertUuid(id: string): void {
    if (!UUID_REGEX.test(id)) {
      throw new BadRequestException(`El id "${id}" no es un UUID válido`);
    }
  }
}