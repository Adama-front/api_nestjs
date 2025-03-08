import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
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
    try {
      // Vérifie d'abord si l'email existe déjà
      const existingUser = await this.prisma.user.findUnique({
        where: { email: user.email },
      });

      if (existingUser) {
        throw new ConflictException(
          `Un utilisateur avec l'email ${user.email} existe déjà`,
        );
      }

      const data = await this.mapper.toPersistent(user);
      const result = await this.prisma.user.create({ data });
      return this.mapper.toDomain(result);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            `Un utilisateur avec l'email ${user.email} existe déjà`,
          );
        }
      }
      throw error;
    }
  }

  async findUserById(id: string): Promise<User | null> {
    try {
      const result = await this.prisma.user.findUnique({ where: { id } });
      if (!result) return null;
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
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) return null;

      // Vérifie si le nouvel email existe déjà pour un autre utilisateur
      if (userDataUpdate.email) {
        const existingUser = await this.prisma.user.findFirst({
          where: {
            email: userDataUpdate.email,
            NOT: {
              id: id,
            },
          },
        });

        if (existingUser) {
          throw new ConflictException(
            `Un utilisateur avec l'email ${userDataUpdate.email} existe déjà`,
          );
        }
      }

      const upDateData = await this.mapper.toUpdate(userDataUpdate);
      const userData = await this.prisma.user.update({
        where: { id },
        data: upDateData,
      });
      return this.mapper.toDomain(userData);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            `Un utilisateur avec cet email existe déjà`,
          );
        }
      }
      throw new Error(
        `Erreur lors de la mise à jour de l'utilisateur: ${error}`,
      );
    }
  }
}
