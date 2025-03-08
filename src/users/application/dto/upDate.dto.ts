import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from 'src/users/domain/enums/enum.role';

export class UpdateUserDto {
  @ApiProperty({
    example: 'John Doe',
    description: "Nom complet de l'utilisateur",
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  name?: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: "Adresse email unique de l'utilisateur",
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: "Format d'email invalide" })
  email?: string;

  @ApiProperty({
    example: 'password123',
    description: "Mot de passe de l'utilisateur",
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Le mot de passe doit être une chaîne de caractères' })
  @MinLength(6, {
    message: 'Le mot de passe doit contenir au moins 6 caractères',
  })
  password?: string;

  @ApiProperty({
    example: 'USER',
    description: "Rôle de l'utilisateur",
    enum: UserRole,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Rôle invalide' })
  role?: UserRole;
}
