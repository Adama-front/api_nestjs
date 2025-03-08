import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.services';
import { User } from 'src/users/domain/entities/entity.users';
import { UserMapper } from 'src/users/domain/mapper/user.mapper';
import { AuthDto } from '../application/dto/auth.dto';
import { IAuthRepository } from '../application/interface/auth.interface.repository';

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mapper: UserMapper,
  ) {}

  async validateUser(auth: AuthDto): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email: auth.email },
    });

    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(auth.password, user.password);
    if (!isPasswordValid) return null;

    return this.mapper.toDomain(user);
  }

  async generateToken(user: User): Promise<string> {
    const payload = {
      sub: user.getId(),
      email: user.getEmail(),
      role: user.getRole(),
    };

    return this.jwtService.sign(payload);
  }
}
