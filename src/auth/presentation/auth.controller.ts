import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthDto, AuthResponseDto } from '../application/dto/auth.dto';
import { AuthUseCase } from '../application/use-cases/auth.usecase';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authUseCase: AuthUseCase) {}

  @Post('login')
  @ApiOperation({
    summary: 'Authentifier un utilisateur',
    description: `
      Authentifie un utilisateur avec son email et mot de passe.
      Retourne un token JWT et les informations de l'utilisateur.
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Authentification réussie',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides',
  })
  @ApiResponse({
    status: 401,
    description: 'Identifiants invalides',
  })
  async login(@Body() auth: AuthDto): Promise<AuthResponseDto> {
    return this.authUseCase.execute(auth);
  }
}
