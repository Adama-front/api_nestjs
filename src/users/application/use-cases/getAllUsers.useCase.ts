import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/users/domain/entities/entity.users';
import { IUserRepository } from '../interface/user.interface.repository';

@Injectable()
export class GetAllUsersUseCase {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) {}

  async execute(): Promise<User[]> {
    return await this.userRepository.getAllUsers();
  }
}
