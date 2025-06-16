import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sign, verify } from 'jsonwebtoken';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class JwtService {
  constructor(
    private configService: ConfigService,
    private loggingService: LoggingService,
  ) {}

  createAccessToken(userId: string, login: string): string {
    try {
      const secret = this.configService.get('JWT_SECRET_KEY');
      const expiresIn = this.configService.get('TOKEN_EXPIRE_TIME') || '1h';

      const token = sign({ userId, login }, secret, { expiresIn });
      this.loggingService.log(
        `Access token created for user ${login} (expires in: ${expiresIn})`,
      );
      return token;
    } catch (error) {
      this.loggingService.error(
        `Failed to create access token: ${error.message}`,
      );
      throw error;
    }
  }

  createRefreshToken(userId: string, login: string): string {
    try {
      const secret = this.configService.get('JWT_SECRET_REFRESH_KEY');
      const expiresIn =
        this.configService.get('TOKEN_REFRESH_EXPIRE_TIME') || '24h';

      const token = sign({ userId, login }, secret, { expiresIn });
      this.loggingService.log(
        `Refresh token created for user ${login} (expires in: ${expiresIn})`,
      );
      return token;
    } catch (error) {
      this.loggingService.error(
        `Failed to create refresh token: ${error.message}`,
      );
      throw error;
    }
  }

  checkAccessToken(token: string): { userId: string; login: string } {
    try {
      const secret = this.configService.get('JWT_SECRET_KEY');
      const decoded = verify(token, secret) as {
        userId: string;
        login: string;
      };
      this.loggingService.log(
        `Access token verified for user ${decoded.login}`,
      );
      return decoded;
    } catch (error) {
      this.loggingService.warn(
        `Access token verification failed: ${error.message}`,
      );
      throw error;
    }
  }

  checkRefreshToken(token: string): { userId: string; login: string } {
    try {
      const secret = this.configService.get('JWT_SECRET_REFRESH_KEY');
      const decoded = verify(token, secret) as {
        userId: string;
        login: string;
      };
      this.loggingService.log(
        `Refresh token verified for user ${decoded.login}`,
      );
      return decoded;
    } catch (error) {
      this.loggingService.warn(
        `Refresh token verification failed: ${error.message}`,
      );
      throw error;
    }
  }
}
