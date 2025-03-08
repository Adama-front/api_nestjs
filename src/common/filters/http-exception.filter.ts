import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Une erreur interne est survenue';
    let error = 'Internal Server Error';
    let details = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object') {
        const exceptionResponseObj = exceptionResponse as any;

        // Gestion des erreurs de validation
        if (
          exception instanceof BadRequestException &&
          Array.isArray(exceptionResponseObj.message)
        ) {
          message = 'Erreur de validation';
          details = exceptionResponseObj.message;
        } else {
          message = exceptionResponseObj.message || exception.message;
        }

        error = exceptionResponseObj.error || 'Error';
      } else {
        message = exception.message;
      }

      // Gestion spécifique des erreurs d'authentification
      if (exception instanceof UnauthorizedException) {
        message = "Vous n'êtes pas authentifié ou votre session a expiré";
        error = "Erreur d'authentification";
      }

      // Gestion spécifique des erreurs d'autorisation
      if (exception instanceof ForbiddenException) {
        message =
          "Vous n'avez pas les permissions nécessaires pour effectuer cette action";
        error = "Erreur d'autorisation";
      }
    }

    response.status(status).json({
      statusCode: status,
      message: message,
      error: error,
      details: details,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    });
  }
}
