import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AuthDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: "Email de l'utilisateur",
  })
  @IsEmail({}, { message: "Format d'email invalide" })
  @IsNotEmpty({ message: "L'email est requis" })
  email: string;

  @ApiProperty({
    example: 'password123',
    description: "Mot de passe de l'utilisateur",
  })
  @IsString({ message: 'Le mot de passe doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  @MinLength(6, {
    message: 'Le mot de passe doit contenir au moins 6 caractères',
  })
  password: string;
}

export class AuthResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: "Token d'authentification",
  })
  access_token: string;

  @ApiProperty({
    example: {
      id: '1',
      email: 'john.doe@example.com',
      role: 'USER',
    },
    description: "Informations de l'utilisateur",
  })
  user: {
    id: string;
    email: string;
    role: string;
  };
}
