import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, RequestMethod } from '@nestjs/common';
import { LoggingService } from './logging/logging.service';
import { CustomExceptionFilter } from './logging/exception.filter';
import { LoggingInterceptor } from './logging/logging.interceptor';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { JwtService } from './jwt/jwt.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const loggingService = app.get(LoggingService);
  const jwtService = app.get(JwtService);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new CustomExceptionFilter(loggingService));
  app.useGlobalInterceptors(new LoggingInterceptor(loggingService));

  const jwtAuthGuard = new JwtAuthGuard(jwtService, loggingService);

  app.use(async (req: any, res: any, next: () => void) => {
    const publicRoutes = [
      { path: '/auth/signup', method: RequestMethod.POST },
      { path: '/auth/login', method: RequestMethod.POST },
      { path: '/auth/refresh', method: RequestMethod.POST },
      { path: '/doc', method: RequestMethod.GET },
      { path: '/', method: RequestMethod.GET },
    ];

    const isPublic = publicRoutes.some(
      (route) =>
        req.path === route.path && req.method === RequestMethod[route.method],
    );

    if (isPublic) {
      return next();
    }

    try {
      const canActivate = await jwtAuthGuard.canActivate(
        new ExecutionContextHost([req, res, next]),
      );

      if (canActivate) {
        return next();
      }

      throw new Error('Unauthorized');
    } catch (error) {
      loggingService.warn(`Auth failed for ${req.path}: ${error.message}`);
      return res.status(401).json({
        statusCode: 401,
        message: 'Unauthorized',
        path: req.path,
      });
    }
  });

  process.on('uncaughtException', (error) => {
    loggingService.error(`Uncaught error: ${error.message}`);
    loggingService.error(error.stack);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason) => {
    loggingService.error(`Unhandled rejection: ${reason}`);
    if (reason instanceof Error) {
      loggingService.error(reason.stack);
    }
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);
  loggingService.log(`Server started on port ${port}`);
}

bootstrap();
