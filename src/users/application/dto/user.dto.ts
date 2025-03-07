import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/users/domain/enums/enum.role';

export class UserDto {
  @ApiProperty({
    example: 'John Doe',
    description: "Nom complet de l'utilisateur",
  })
  @Optional()
  name?: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: "Adresse email unique de l'utilisateur",
  })
  email: string;

  @ApiProperty({
    example: 'hashedpassword123',
    description: "Mot de passe hashé de l'utilisateur",
    writeOnly: true,
  })
  password: string;

  @ApiProperty({
    example: 'ADMIN',
    description: "Rôle de l'utilisateur",
    enum: UserRole,
  })
  role: UserRole;
}
