import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Injectable,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/auth/infrastructure/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/infrastructure/guards/jwt.guard';
import { RolesGuard } from 'src/auth/infrastructure/guards/roles.guard';
import { UserRole } from 'src/users/domain/enums/enum.role';
import { CategoryDto } from '../application/dto/category.dto';
import { UpdateCategoryDto } from '../application/dto/category.upDate.dto';
import { CreateCategoryUseCase } from '../application/use-cases/createCategory.useCase';
import { DeleteCategoryUseCase } from '../application/use-cases/deleteCategory.useCase';
import { FindByIdUseCase } from '../application/use-cases/findById.useCase';
import { GetAllCategoriesUseCase } from '../application/use-cases/getAllCategories.useCase';
import { UpdateCategoryUseCase } from '../application/use-cases/updateCategory.useCase';
import { Category } from '../domain/entities/entity.category';

@Injectable()
@Controller('categories')
@ApiTags('Categories')
export class CategoryController {
  constructor(
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly deleteCategoryUseCase: DeleteCategoryUseCase,
    private readonly findByIdUseCase: FindByIdUseCase,
    private readonly getAllCategoriesUseCase: GetAllCategoriesUseCase,
    private readonly updateCategoryUseCase: UpdateCategoryUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Créer une nouvelle catégorie',
    description: 'Crée une nouvelle catégorie dans le système.',
  })
  @ApiResponse({
    status: 201,
    description: 'Catégorie créée avec succès',
    type: Category,
  })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @ApiResponse({ status: 403, description: 'Accès interdit' })
  @ApiResponse({ status: 409, description: 'Nom de catégorie déjà utilisé' })
  async createCategory(@Body() categoryDto: CategoryDto): Promise<Category> {
    try {
      return await this.createCategoryUseCase.execute(categoryDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw error;
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Récupérer une catégorie par son ID',
    description: "Retourne les informations d'une catégorie spécifique.",
  })
  @ApiParam({
    name: 'id',
    description: 'Identifiant unique de la catégorie',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Catégorie trouvée avec succès',
    type: Category,
  })
  @ApiResponse({ status: 404, description: 'Catégorie non trouvée' })
  async findCategoryById(@Param('id') id: string): Promise<Category> {
    const category = await this.findByIdUseCase.execute(id);
    if (!category) {
      throw new NotFoundException(`Catégorie avec l'ID ${id} non trouvée`);
    }
    return category;
  }

  @Get()
  @ApiOperation({
    summary: 'Récupérer toutes les catégories',
    description: 'Retourne la liste complète des catégories.',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des catégories retournée avec succès',
    type: [Category],
  })
  async findAllCategories(): Promise<Category[]> {
    return await this.getAllCategoriesUseCase.execute();
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Supprimer une catégorie par son ID',
    description: 'Supprime définitivement une catégorie du système.',
  })
  @ApiParam({
    name: 'id',
    description: 'Identifiant unique de la catégorie à supprimer',
    type: 'string',
  })
  @ApiResponse({ status: 204, description: 'Catégorie supprimée avec succès' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @ApiResponse({ status: 403, description: 'Accès interdit' })
  @ApiResponse({ status: 404, description: 'Catégorie non trouvée' })
  async deleteCategory(@Param('id') id: string): Promise<boolean> {
    try {
      await this.deleteCategoryUseCase.execute(id);
      return true;
    } catch (error) {
      throw new NotFoundException(`Catégorie avec l'ID ${id} non trouvée`);
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Mettre à jour une catégorie par son ID',
    description: "Met à jour les informations d'une catégorie existante.",
  })
  @ApiParam({
    name: 'id',
    description: 'Identifiant unique de la catégorie à mettre à jour',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Catégorie mise à jour avec succès',
    type: Category,
  })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @ApiResponse({ status: 403, description: 'Accès interdit' })
  @ApiResponse({ status: 404, description: 'Catégorie non trouvée' })
  @ApiResponse({ status: 409, description: 'Nom de catégorie déjà utilisé' })
  async updateCategory(
    @Param('id') id: string,
    @Body() category: UpdateCategoryDto,
  ): Promise<Category> {
    try {
      const updatedCategory = await this.updateCategoryUseCase.execute(
        id,
        category,
      );
      if (!updatedCategory) {
        throw new NotFoundException(`Catégorie avec l'ID ${id} non trouvée`);
      }
      return updatedCategory;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw error;
    }
  }
}
