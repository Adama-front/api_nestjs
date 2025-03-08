import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto, AuthResponseDto } from '../dto/auth.dto';
import { IAuthRepository } from '../interface/auth.interface.repository';

@Injectable()
export class AuthUseCase {
  constructor(
    @Inject('IAuthRepository')
    private readonly authRepository: IAuthRepository,
  ) {}

  async execute(auth: AuthDto): Promise<AuthResponseDto> {
    const user = await this.authRepository.validateUser(auth);

    if (!user) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    const token = await this.authRepository.generateToken(user);

    return {
      access_token: token,
      user: {
        id: user.getId(),
        email: user.getEmail(),
        role: user.getRole(),
      },
    };
  }
}
