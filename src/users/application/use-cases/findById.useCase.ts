import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/users/domain/entities/entity.users';
import { UserRepository } from 'src/users/infrastructure/user.repository';
import { IUserRepository } from '../interface/user.interface.repository';

@Injectable()
export class FindByIdUseCase {
  constructor(
    @Inject('IUserRepository') private readonly repository: IUserRepository,
  ) {}

  async execute(id: string): Promise<User | null> {
    return this.repository.findUserById(id);
  }
}
