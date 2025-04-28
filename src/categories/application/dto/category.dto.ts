import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CategoryDto {
  @ApiProperty({
    example: 'Électronique',
    description: 'Nom de la catégorie (doit être unique)',
  })
  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le nom est requis' })
  name: string;

  @ApiProperty({
    example: 'Appareils électroniques et gadgets',
    description: 'Description facultative de la catégorie',
    required: false,
  })
  @IsString({ message: 'La description doit être une chaîne de caractères' })
  @IsOptional()
  description?: string | null;
}
