import { Inject, Injectable } from '@nestjs/common';
import { Category } from 'src/categories/domain/entities/entity.category';
import { ICategoryRepository } from '../iterface/category.interface';

@Injectable()
export class GetAllCategoriesUseCase {
  constructor(
    @Inject('ICategoryRepository')
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(): Promise<Category[]> {
    return await this.categoryRepository.getAllCategories();
  }
}
