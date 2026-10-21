import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // 1. Verificar si el email ya está registrado
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('El correo ya está registrado');
    }

    // 2. Hashear la contraseña (NUNCA guardar en texto plano)
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(registerDto.password, saltRounds);

    // 3. Crear el usuario en la BD
    const user = await this.usersService.create({
      name: registerDto.name,
      email: registerDto.email,
      passwordHash,
    });

    // 4. Devolver el usuario sin el hash (por seguridad)
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  async login(loginDto: LoginDto) {
    // 1. Buscar el usuario por email
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // 2. Comparar la contraseña con el hash
    const passwordValid = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );
    if (!passwordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // 3. Generar el token JWT
    const payload = { sub: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload);

    // 4. Devolver el token y los datos públicos del usuario
    return {
      accessToken: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
}