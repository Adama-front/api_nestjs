import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.services';
import { CreateCategoryUseCase } from './application/use-cases/createCategory.useCase';
import { DeleteCategoryUseCase } from './application/use-cases/deleteCategory.useCase';
import { FindByIdUseCase } from './application/use-cases/findById.useCase';
import { GetAllCategoriesUseCase } from './application/use-cases/getAllCategories.useCase';
import { UpdateCategoryUseCase } from './application/use-cases/updateCategory.useCase';
import { CategoryMapper } from './domain/mapper/category.mapper';
import { CategoryRepository } from './infrastructure/category.repository';
import { CategoryController } from './presentation/category.controller';

@Module({
  imports: [],
  controllers: [CategoryController],
  providers: [
    // service
    PrismaService,

    // use cases
    CreateCategoryUseCase,
    FindByIdUseCase,
    GetAllCategoriesUseCase,
    DeleteCategoryUseCase,
    UpdateCategoryUseCase,
    {
      provide: 'ICategoryRepository',
      useClass: CategoryRepository,
    },

    // mappers
    CategoryMapper,
  ],
  exports: [],
})
export class CategoryModule {}
