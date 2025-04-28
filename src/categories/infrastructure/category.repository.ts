import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.services';
import { CategoryDto } from '../application/dto/category.dto';
import { UpdateCategoryDto } from '../application/dto/category.upDate.dto';
import { ICategoryRepository } from '../application/iterface/category.interface';
import { Category } from '../domain/entities/entity.category';
import { CategoryMapper } from '../domain/mapper/category.mapper';

@Injectable()
export class CategoryRepository implements ICategoryRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: CategoryMapper,
  ) {}

  async createCategory(categoryDto: CategoryDto): Promise<Category> {
    try {
      // Convertir CategoryDto en entité Category
      const categoryEntity = new Category(
        '', // ID sera généré par Prisma
        categoryDto.name,
        categoryDto.description ?? null,
        new Date(),
        new Date(),
      );

      // Transformer l'entité en données Prisma
      const data = this.mapper.toPersistence(categoryEntity);

      // Créer la catégorie dans la base de données
      const createdCategory = await this.prisma.category.create({
        data: {
          name: data.name!,
          description: data.description,
        },
      });

      // Retourner l'entité Category
      return this.mapper.toDomain(createdCategory);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            `Une catégorie avec le nom "${categoryDto.name}" existe déjà.`,
          );
        }
      }
      throw error;
    }
  }

  async findCategoryById(id: string): Promise<Category | null> {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id },
      });
      if (!category) return null;
      return this.mapper.toDomain(category);
    } catch (error) {
      throw new Error(`Erreur lors de la recherche de la catégorie: ${error}`);
    }
  }

  async getAllCategories(): Promise<Category[]> {
    try {
      const categories = await this.prisma.category.findMany();
      return categories.map((category) => this.mapper.toDomain(category));
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération des catégories: ${error}`,
      );
    }
  }

  async deleteCategory(id: string): Promise<void> {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id },
      });
      if (!category) {
        throw new NotFoundException(`Catégorie avec l'ID ${id} non trouvée`);
      }
      await this.prisma.category.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Catégorie avec l'ID ${id} non trouvée`);
        }
      }
      throw error;
    }
  }

  async updateCategory(
    id: string,
    categoryDto: UpdateCategoryDto,
  ): Promise<Category | null> {
    try {
      // Vérifier si la catégorie existe
      const existingCategory = await this.prisma.category.findUnique({
        where: { id },
      });
      if (!existingCategory) {
        throw new NotFoundException(`Catégorie avec l'ID ${id} non trouvée`);
      }

      // Mettre à jour la catégorie
      const updatedCategory = await this.prisma.category.update({
        where: { id },
        data: {
          name: categoryDto.name,
          description: categoryDto.description,
        },
      });

      return this.mapper.toDomain(updatedCategory);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            `Une catégorie avec le nom "${categoryDto.name}" existe déjà.`,
          );
        }
      }
      throw error;
    }
  }
}
