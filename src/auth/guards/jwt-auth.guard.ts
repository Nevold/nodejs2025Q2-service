import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '../../jwt/jwt.service';
import { LoggingService } from '../../logging/logging.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly loggingService: LoggingService,
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) {
      this.loggingService.warn('No token provided');
      return false;
    }

    try {
      const payload = this.jwtService.checkAccessToken(token);
      request.user = payload;
      return true;
    } catch (error) {
      this.loggingService.warn(`Invalid token: ${error.message}`);
      return false;
    }
  }

  private extractToken(request: any): string | null {
    const [type, token] = request.headers?.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }
}
