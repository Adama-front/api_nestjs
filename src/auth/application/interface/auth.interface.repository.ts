import { User } from 'src/users/domain/entities/entity.users';
import { AuthDto } from '../dto/auth.dto';

export interface IAuthRepository {
  validateUser(auth: AuthDto): Promise<User | null>;
  generateToken(user: User): Promise<string>;
}
