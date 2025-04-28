import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
export class UpdateCategoryDto {
  @ApiProperty({
    example: 'Électronique',
    description: 'Nouveau nom de la catégorie (facultatif)',
    required: false,
  })
  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'Appareils électroniques et gadgets',
    description: 'Nouvelle description de la catégorie (facultatif)',
    required: false,
  })
  @IsString({ message: 'La description doit être une chaîne de caractères' })
  @IsOptional()
  description?: string | null;
}
