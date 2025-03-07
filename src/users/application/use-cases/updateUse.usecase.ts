import { Inject, Injectable } from '@nestjs/common';
import { UpdateUserDto } from '../dto/upDate.dto';
import { IUserRepository } from '../interface/user.interface.repository';

@Injectable()
export class UpdateUseUseCase {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) {}
  async execute(id: string, user: UpdateUserDto) {
    try {
      if (!id) {
        throw new Error('User id is required');
      }
      const updatedUser = await this.userRepository.updateUser(id, user);
      return updatedUser;
    } catch (error) {
      throw new Error(`Failed to update user with id ${id}: ${error.message}`);
    }
  }
}
