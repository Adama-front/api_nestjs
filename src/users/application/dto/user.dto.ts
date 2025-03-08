import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from 'src/users/domain/enums/enum.role';

export class UserDto {
  @ApiProperty({
    example: 'John Doe',
    description: "Nom complet de l'utilisateur",
  })
  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le nom est requis' })
  name: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: "Adresse email unique de l'utilisateur",
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

  @ApiProperty({
    example: 'USER',
    description: "Rôle de l'utilisateur",
    enum: UserRole,
  })
  @IsEnum(UserRole, { message: 'Rôle invalide' })
  @IsNotEmpty({ message: 'Le rôle est requis' })
  role: UserRole;
}
