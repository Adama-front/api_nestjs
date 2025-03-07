import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/users/domain/entities/entity.users';
import { UserRepository } from 'src/users/infrastructure/user.repository';
import { UserDto } from '../dto/user.dto';
import { IUserRepository } from '../interface/user.interface.repository';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('IUserRepository') private readonly repository: IUserRepository,
  ) {}
  async execute(userDto: UserDto): Promise<User> {
    return this.repository.createUser(userDto);
  }
}
