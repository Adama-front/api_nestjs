import { Inject, Injectable } from '@nestjs/common';
import { UpdateCategoryDto } from '../dto/category.upDate.dto';
import { ICategoryRepository } from '../iterface/category.interface';

@Injectable()
export class UpdateCategoryUseCase {
  constructor(
    @Inject('ICategoryRepository')
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(id: string, category: UpdateCategoryDto) {
    try {
      if (!id) {
        throw new Error('Category id is required');
      }
      const updatedCategory = await this.categoryRepository.updateCategory(
        id,
        category,
      );
      return updatedCategory;
    } catch (error) {
      throw new Error(
        `Failed to update category with id ${id}: ${error.message}`,
      );
    }
  }
}
