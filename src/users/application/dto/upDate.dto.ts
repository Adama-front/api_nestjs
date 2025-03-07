import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/users/domain/enums/enum.role';

export class UpdateUserDto {
  @ApiProperty({
    example: 'John Doe',
    description: "Nom complet de l'utilisateur",
    required: false,
  })
  name?: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: "Adresse email unique de l'utilisateur",
    required: false,
  })
  email?: string;

  @ApiProperty({
    example: 'hashedpassword123',
    description: "Mot de passe hashé de l'utilisateur",
    writeOnly: true,
    required: false,
  })
  password?: string;

  @ApiProperty({
    example: 'ADMIN',
    description: "Rôle de l'utilisateur",
    required: false,
  })
  role?: UserRole;
}
