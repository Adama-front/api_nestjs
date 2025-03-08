import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3000;

  // Configuration de Swagger
  const config = new DocumentBuilder()
    .setTitle('API de Gestion des Utilisateurs')
    .setDescription(
      `
      API REST pour la gestion des utilisateurs avec authentification JWT.
      
      ## Fonctionnalités
      - Authentification des utilisateurs (JWT)
      - Gestion des utilisateurs (CRUD)
      - Gestion des rôles (USER, ADMIN)
      
      ## Sécurité
      - Tous les mots de passe sont hashés
      - Protection des routes sensibles
      - Validation des données
    `,
    )
    .setVersion('1.0')
    .addTag('Auth', "Endpoints d'authentification")
    .addTag('Users', 'Gestion des utilisateurs')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Entrez votre token JWT',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
    },
    customSiteTitle: 'API Documentation',
  });

  // Ajout des pipes de validation globaux
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      errorHttpStatusCode: 400,
    }),
  );

  // Ajout du filtre d'exception global
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Ajout de l'intercepteur de transformation
  app.useGlobalInterceptors(new TransformInterceptor());

  // Activation du CORS
  app.enableCors();

  try {
    await app.listen(port);

    const logger = new Logger('Bootstrap');
    logger.log(`🚀 Application running on: ${await app.getUrl()}/api/docs`);
    logger.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.log(`📡 Listening on port ${port}`);
  } catch (error) {
    const logger = new Logger('Bootstrap');
    logger.error('❌ Failed to start the server', error);
    process.exit(1);
  }
}
bootstrap();
