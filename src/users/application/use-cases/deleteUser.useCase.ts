import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/users/infrastructure/user.repository';
import { IUserRepository } from '../interface/user.interface.repository';

@Injectable()
export class DeleteUserUsecase {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) {}
  async execute(id: string): Promise<boolean> {
    await this.userRepository.deleteUser(id);
    return true;
  }
}
