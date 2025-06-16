import { ExceptionFilter, Catch, HttpException } from '@nestjs/common';
import { LoggingService } from './logging.service';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  constructor(private readonly loggingService: LoggingService) {}

  catch(exception: unknown, host: any) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = 500;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    }

    this.loggingService.error(
      `Error: ${message} | Path: ${request.url} | Status: ${status}`,
    );

    response.status(status).json({
      statusCode: status,
      message: message,
      path: request.url,
    });
  }
}
