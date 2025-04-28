import { Injectable } from '@nestjs/common';
import { Category as CategoryPrisma } from '@prisma/client';
import { Category } from '../entities/entity.category';

@Injectable()
export class CategoryMapper {
  /**
   * Convertit un modèle Prisma Category en entité métier Category.
   * @param category Modèle Prisma de la catégorie.
   * @returns Entité Category pour la logique métier.
   */
  toDomain(category: CategoryPrisma): Category {
    return new Category(
      category.id,
      category.name,
      category.description,
      category.createdAt,
      category.updatedAt,
    );
  }

  /**
   * Convertit une entité Category en objet pour la persistance Prisma.
   * @param category Entité Category.
   * @returns Objet compatible avec Prisma pour créer une catégorie.
   */
  toPersistence(category: Category): Partial<CategoryPrisma> {
    return {
      name: category.getName(),
      description: category.getDescription(),
    };
  }

  /**
   * Prépare un objet pour la mise à jour d'une catégorie via Prisma.
   * Inclut uniquement les champs définis dans l'entité.
   * @param category Entité Category avec les champs à mettre à jour.
   * @returns Objet contenant les champs à mettre à jour.
   */
  toUpdate(category: Category): Partial<CategoryPrisma> {
    const update: Partial<CategoryPrisma> = {};

    const name = category.getName();
    if (name !== undefined) {
      update.name = name;
    }

    const description = category.getDescription();
    if (description !== undefined) {
      update.description = description;
    }

    return update;
  }
}
