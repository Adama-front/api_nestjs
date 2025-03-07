import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.services';
import { UpdateUserDto } from '../application/dto/upDate.dto';
import { UserDto } from '../application/dto/user.dto';
import { IUserRepository } from '../application/interface/user.interface.repository';
import { User } from '../domain/entities/entity.users';
import { UserMapper } from '../domain/mapper/user.mapper';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: UserMapper,
  ) {}
  async createUser(user: UserDto): Promise<User> {
    const data = await this.mapper.toPersistent(user);
    const result = await this.prisma.user.create({ data });
    return this.mapper.toDomain(result);
  }

  async findUserById(id: string): Promise<User | null> {
    try {
      const result = await this.prisma.user.findUnique({ where: { id } });
      if (!result) return null; // Retourner null si l'utilisateur n'existe pas
      return Promise.resolve(this.mapper.toDomain(result));
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération de l'utilisateur: ${error}`,
      );
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const result = await this.prisma.user.findMany();
      return result.map((user) => this.mapper.toDomain(user));
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération de tous les utilisateurs: ${error}`,
      );
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      await this.prisma.user.delete({ where: { id } });
    } catch (error) {
      throw new Error(
        `Erreur lors de la suppression de l'utilisateur: ${error}`,
      );
    }
  }

  async updateUser(
    id: string,
    userDataUpdate: UpdateUserDto,
  ): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id: id } });
    if (!user) return null; // Retourner null si l'utilisateur n'existe pas
    const upDateData = await this.mapper.toUpdate(userDataUpdate);

    try {
      const userData = await this.prisma.user.update({
        where: { id },
        data: upDateData,
      });
      return this.mapper.toDomain(userData);
    } catch (error) {
      throw new Error(
        `Erreur lors de la mise à jour de l'utilisateur: ${error}`,
      );
    }
  }
}
