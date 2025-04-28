import { Category } from 'src/categories/domain/entities/entity.category';
import { CategoryDto } from '../../application/dto/category.dto';
import { UpdateCategoryDto } from '../../application/dto/category.upDate.dto';

export interface ICategoryRepository {
  /**
   * Crée une nouvelle catégorie dans la base de données.
   * @param category Données de la catégorie à créer (sous forme de DTO).
   * @returns La catégorie créée, transformée en entité Category.
   */
  createCategory(category: CategoryDto): Promise<Category>;

  /**
   * Recherche une catégorie par son ID.
   * @param id L'ID de la catégorie.
   * @returns La catégorie trouvée (entité Category) ou null si non trouvée.
   */
  findCategoryById(id: string): Promise<Category | null>;

  /**
   * Récupère toutes les catégories.
   * @returns Un tableau de catégories (entités Category).
   */
  getAllCategories(): Promise<Category[]>;

  /**
   * Supprime une catégorie par son ID.
   * @param id L'ID de la catégorie à supprimer.
   * @returns Une promesse vide (void) indiquant que la suppression est terminée.
   */
  deleteCategory(id: string): Promise<void>;

  /**
   * Met à jour une catégorie existante.
   * @param id L'ID de la catégorie à mettre à jour.
   * @param category Données de mise à jour (sous forme de DTO partiel).
   * @returns La catégorie mise à jour (entité Category) ou null si non trouvée.
   */
  updateCategory(
    id: string,
    category: UpdateCategoryDto,
  ): Promise<Category | null>;
}
