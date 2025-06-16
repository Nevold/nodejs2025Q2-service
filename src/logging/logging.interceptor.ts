import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { LoggingService } from './logging.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly loggingService: LoggingService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, originalUrl, body, query } = request;

    this.logRequest(method, originalUrl, query, body).catch((e) =>
      console.error('Logging error:', e),
    );

    const now = Date.now();

    return new Observable((observer) => {
      next.handle().subscribe({
        next: (value) => {
          this.logResponse(method, originalUrl, context, now).catch((e) =>
            console.error('Logging error:', e),
          );
          observer.next(value);
          observer.complete();
        },
        error: (err) => {
          this.logError(method, originalUrl, err).catch((e) =>
            console.error('Logging error:', e),
          );
          observer.error(err);
        },
      });
    });
  }

  private async logRequest(method: string, url: string, query: any, body: any) {
    await this.loggingService.log(
      `Request: ${method} ${url} | Query: ${JSON.stringify(query)} | Body: ${JSON.stringify(body)}`,
    );
  }

  private async logResponse(
    method: string,
    url: string,
    context: ExecutionContext,
    startTime: number,
  ) {
    const response = context.switchToHttp().getResponse();
    const responseTime = Date.now() - startTime;
    await this.loggingService.log(
      `Response: ${method} ${url} | Status: ${response.statusCode} | Time: ${responseTime}ms`,
    );
  }

  private async logError(method: string, url: string, error: Error) {
    await this.loggingService.error(
      `Error: ${method} ${url} | ${error.message} | ${error.stack || 'No stack trace'}`,
    );
  }
}
