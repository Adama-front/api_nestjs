import { Injectable } from '@nestjs/common';
import { User as UserPrisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from 'src/users/application/dto/upDate.dto';
import { UserDto } from 'src/users/application/dto/user.dto';
import { User } from '../entities/entity.users';
import { UserRole } from '../enums/enum.role';

@Injectable()
export class UserMapper {
  private readonly SALT_ROUNDS = 10;

  toDomain(user: UserPrisma): User {
    return new User(
      user.id,
      user.name,
      user.email,
      user.password,
      user.role as UserRole,
      user.createdAt,
      user.updatedAt,
    );
  }

  async toPersistent(user: UserDto): Promise<any> {
    const hashedPassword = await bcrypt.hash(user.password, this.SALT_ROUNDS);

    return {
      name: user.name,
      email: user.email,
      password: hashedPassword,
      role: user.role as UserRole,
    };
  }

  async toUpdate(user: UpdateUserDto): Promise<any> {
    const update: any = {};

    if (user.password) {
      update.password = await bcrypt.hash(user.password, this.SALT_ROUNDS);
    }
    if (user.name) {
      update.name = user.name;
    }
    if (user.email) {
      update.email = user.email;
    }
    if (user.role) {
      update.role = user.role as UserRole;
    }

    return update;
  }
}
