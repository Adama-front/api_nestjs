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
import { UpdateUserDto } from '../application/dto/upDate.dto';
import { UserDto } from '../application/dto/user.dto';
import { CreateUserUseCase } from '../application/use-cases/createUser.useCase';
import { DeleteUserUsecase } from '../application/use-cases/deleteUser.useCase';
import { FindByIdUseCase } from '../application/use-cases/findById.useCase';
import { GetAllUsersUseCase } from '../application/use-cases/getAllUsers.useCase';
import { UpdateUseUseCase } from '../application/use-cases/updateUse.usecase';
import { User } from '../domain/entities/entity.users';
import { UserRole } from '../domain/enums/enum.role';

@Injectable()
@Controller('users')
@ApiTags('Users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly findByIdUseCase: FindByIdUseCase,
    private readonly getAllUsers: GetAllUsersUseCase,
    private readonly deleteUserUseCase: DeleteUserUsecase,
    private readonly updateUserUseCase: UpdateUseUseCase,
  ) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Créer un nouvel utilisateur (Admin uniquement)',
    description: `
      Crée un nouvel utilisateur dans le système.
      Seuls les administrateurs peuvent créer de nouveaux utilisateurs.
      Le mot de passe sera automatiquement hashé avant d'être stocké.
    `,
  })
  @ApiResponse({
    status: 201,
    description: 'Utilisateur créé avec succès',
    type: UserDto,
  })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @ApiResponse({
    status: 403,
    description: 'Accès interdit - Réservé aux administrateurs',
  })
  @ApiResponse({ status: 409, description: 'Email déjà utilisé' })
  async createUser(@Body() userDto: UserDto): Promise<User> {
    try {
      return await this.createUserUseCase.execute(userDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw error;
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Récupérer un utilisateur par son ID',
    description:
      "Retourne les informations détaillées d'un utilisateur spécifique.",
  })
  @ApiParam({
    name: 'id',
    description: "Identifiant unique de l'utilisateur",
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Utilisateur trouvé avec succès',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  async findUserById(@Param('id') id: string): Promise<User> {
    const user = await this.findByIdUseCase.execute(id);
    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} non trouvé`);
    }
    return user;
  }

  @Get()
  @ApiOperation({
    summary: 'Récupérer tous les utilisateurs',
    description: 'Retourne la liste complète des utilisateurs.',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des utilisateurs retournée avec succès',
    type: [User],
  })
  async findAllUsers(): Promise<User[]> {
    return await this.getAllUsers.execute();
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Supprimer un utilisateur par son ID (Admin uniquement)',
    description: 'Supprime définitivement un utilisateur du système.',
  })
  @ApiParam({
    name: 'id',
    description: "Identifiant unique de l'utilisateur à supprimer",
    type: 'string',
  })
  @ApiResponse({ status: 204, description: 'Utilisateur supprimé avec succès' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @ApiResponse({
    status: 403,
    description: 'Accès interdit - Réservé aux administrateurs',
  })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  async deleteUser(@Param('id') id: string): Promise<boolean> {
    try {
      await this.deleteUserUseCase.execute(id);
      return true;
    } catch (error) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} non trouvé`);
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Mettre à jour un utilisateur par son ID',
    description: `
      Met à jour les informations d'un utilisateur existant.
      Les champs non fournis resteront inchangés.
      Le mot de passe, s'il est fourni, sera automatiquement hashé.
    `,
  })
  @ApiParam({
    name: 'id',
    description: "Identifiant unique de l'utilisateur à mettre à jour",
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Utilisateur mis à jour avec succès',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @ApiResponse({ status: 403, description: 'Accès interdit' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  @ApiResponse({ status: 409, description: 'Email déjà utilisé' })
  async updateUser(
    @Param('id') id: string,
    @Body() user: UpdateUserDto,
  ): Promise<User> {
    try {
      const updatedUser = await this.updateUserUseCase.execute(id, user);
      if (!updatedUser) {
        throw new NotFoundException(`Utilisateur avec l'ID ${id} non trouvé`);
      }
      return updatedUser;
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
