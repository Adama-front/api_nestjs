import { Injectable } from '@nestjs/common';
import { User as UserPrisma } from '@prisma/client';
import { UpdateUserDto } from 'src/users/application/dto/upDate.dto';
import { UserDto } from 'src/users/application/dto/user.dto';
import { User } from '../entities/entity.users';
import { UserRole } from '../enums/enum.role';

@Injectable()
export class UserMapper {
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
  toPersistent(user: UserDto): any {
    return {
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role as UserRole,
    };
  }

  toUpdate(user: UpdateUserDto): any {
    const update: any = {};
    if (user.password) {
      update.password = user.password;
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
