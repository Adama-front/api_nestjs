import { User } from 'src/users/domain/entities/entity.users';
import { UpdateUserDto } from '../dto/upDate.dto';
import { UserDto } from '../dto/user.dto';

export interface IUserRepository {
  createUser(user: UserDto): Promise<User>;
  findUserById(id: string): Promise<User | null>;
  getAllUsers(): Promise<User[]>;
  deleteUser(id: string): Promise<void>;
  updateUser(id: string, user: UpdateUserDto): Promise<User | null>;
}
