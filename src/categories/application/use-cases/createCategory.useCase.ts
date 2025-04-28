import { Inject, Injectable } from '@nestjs/common';
import { Category } from 'src/categories/domain/entities/entity.category';
import { CategoryDto } from '../dto/category.dto';
import { ICategoryRepository } from '../iterface/category.interface';

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    @Inject('ICategoryRepository')
    private readonly repository: ICategoryRepository,
  ) {}

  async execute(categoryDto: CategoryDto): Promise<Category> {
    return this.repository.createCategory(categoryDto);
  }
}
