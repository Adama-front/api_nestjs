import { Inject, Injectable } from '@nestjs/common';
import { ICategoryRepository } from '../iterface/category.interface';
import { Category } from 'src/categories/domain/entities/entity.category';

@Injectable()
export class FindByIdUseCase {
  constructor(
    @Inject('ICategoryRepository')
    private readonly repository: ICategoryRepository,
  ) {}
  async execute(id: string): Promise<Category | null> {
    return this.repository.findCategoryById(id);
  }
}
