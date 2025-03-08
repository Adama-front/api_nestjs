import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.services';
import { UserMapper } from 'src/users/domain/mapper/user.mapper';
import { AuthUseCase } from './application/use-cases/auth.usecase';
import { AuthRepository } from './infrastructure/auth.repository';
import { RolesGuard } from './infrastructure/guards/roles.guard';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { AuthController } from './presentation/auth.controller';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const secret = configService.getOrThrow<string>('JWT_SECRET');
        const expiration = configService.getOrThrow<string>('JWT_EXPIRATION');

        return {
          secret,
          signOptions: {
            expiresIn: expiration,
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    PrismaService,
    AuthUseCase,
    UserMapper,
    JwtStrategy,
    RolesGuard,
    {
      provide: 'IAuthRepository',
      useClass: AuthRepository,
    },
  ],
  exports: [RolesGuard],
})
export class AuthModule {}
