import {
  Body,
  Controller,
  Delete,
  Get,
  Injectable,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from '../application/dto/upDate.dto';
import { UserDto } from '../application/dto/user.dto';
import { CreateUserUseCase } from '../application/use-cases/createUser.useCase';
import { DeleteUserUsecase } from '../application/use-cases/deleteUser.useCase';
import { FindByIdUseCase } from '../application/use-cases/findById.useCase';
import { GetAllUsersUseCase } from '../application/use-cases/getAllUsers.useCase';
import { UpdateUseUseCase } from '../application/use-cases/updateUse.usecase';
import { User } from '../domain/entities/entity.users';

@Injectable()
@Controller('users')
@ApiTags('Users') // Regroupe les endpoints sous "Users" dans Swagger
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly findByIdUseCase: FindByIdUseCase,
    private readonly getAllUsers: GetAllUsersUseCase,
    private readonly deleteUserUseCase: DeleteUserUsecase,
    private readonly updateUserUseCase: UpdateUseUseCase,
  ) {}

  @Post('/create')
  @ApiOperation({ summary: 'Créer un nouvel utilisateur' }) // Courte description
  @ApiResponse({
    status: 201,
    description: 'Utilisateur créé avec succès',
    type: UserDto,
  }) // Réponse en cas de succès
  @ApiResponse({ status: 400, description: 'Données invalides' }) // Cas d'erreur
  async createUser(@Body() userDto: UserDto): Promise<User> {
    return this.createUserUseCase.execute(userDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un utilisateur par son ID' }) // Courte description
  async findUserById(@Param('id') id: string): Promise<User | null> {
    return await this.findByIdUseCase.execute(id);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les utilisateurs' }) // Courte description
  @ApiResponse({
    status: 200,
    description: 'Liste des utilisateurs retournée avec succès',
    type: [User],
  })
  async findAllUsers(): Promise<User[]> {
    return await this.getAllUsers.execute();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un utilisateur par son ID' }) // Courte description
  @ApiResponse({ status: 204, description: 'Utilisateur supprimé avec succès' })
  async deleteUser(@Param('id') id: string): Promise<boolean> {
    await this.deleteUserUseCase.execute(id);
    return true;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour un utilisateur par son ID' }) // Courte description
  @ApiResponse({
    status: 200,
    description: 'Utilisateur mis à jour avec succès',
  })
  async updateUser(
    @Param('id') id: string,
    @Body() user: UpdateUserDto,
  ): Promise<User | null> {
    return await this.updateUserUseCase.execute(id, user);
  }
}
