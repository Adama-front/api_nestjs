import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.services';
import { CreateUserUseCase } from './application/use-cases/createUser.useCase';
import { DeleteUserUsecase } from './application/use-cases/deleteUser.useCase';
import { FindByIdUseCase } from './application/use-cases/findById.useCase';
import { GetAllUsersUseCase } from './application/use-cases/getAllUsers.useCase';
import { UpdateUseUseCase } from './application/use-cases/updateUse.usecase';
import { UserMapper } from './domain/mapper/user.mapper';
import { UserRepository } from './infrastructure/user.repository';
import { UserController } from './presentation/user.controller';

@Module({
  imports: [],

  controllers: [UserController],
  providers: [
    // serviec
    PrismaService,

    // use cases
    CreateUserUseCase,
    FindByIdUseCase,
    GetAllUsersUseCase,
    DeleteUserUsecase,
    UpdateUseUseCase,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },

    //   mappers
    UserMapper,
  ],
  exports: [],
})
export class UserModule {}
