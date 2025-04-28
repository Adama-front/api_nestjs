import { Inject, Injectable } from '@nestjs/common';
import { ICategoryRepository } from '../iterface/category.interface';

@Injectable()
export class DeleteCategoryUseCase {
  constructor(
    @Inject('ICategoryRepository')
    private readonly repository: ICategoryRepository,
  ) {}
  async execute(id: string): Promise<boolean> {
    await this.repository.deleteCategory(id);
    return true;
  }
}
