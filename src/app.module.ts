import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true,
      validate: (config: Record<string, unknown>) => {
        const requiredEnvVars = [
          'JWT_SECRET',
          'JWT_EXPIRATION',
          'DATABASE_URL',
        ];
        for (const envVar of requiredEnvVars) {
          if (!config[envVar]) {
            throw new Error(`Environment variable ${envVar} is required`);
          }
        }
        return config;
      },
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
