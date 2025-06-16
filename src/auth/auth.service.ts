import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '../jwt/jwt.service';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly loggingService: LoggingService,
  ) {}

  async signup(login: string, password: string) {
    try {
      if (!login || !password) {
        throw new BadRequestException('Login and password are required');
      }

      const existingUser = await this.userService.findByLogin(login);
      if (existingUser) {
        throw new ConflictException('User with this login already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.userService.create({
        login,
        password: hashedPassword,
      });

      await this.loggingService.log(`User ${login} signed up successfully`);
      return user;
    } catch (error) {
      await this.loggingService.error(
        `Signup failed for ${login}: ${error.message}`,
      );
      throw error;
    }
  }

  async login(login: string, password: string) {
    try {
      if (!login || !password) {
        throw new BadRequestException('Login and password are required');
      }

      const user = await this.userService.findByLogin(login);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const accessToken = this.jwtService.createAccessToken(
        user.id,
        user.login,
      );
      const refreshToken = this.jwtService.createRefreshToken(
        user.id,
        user.login,
      );

      await this.loggingService.log(`User ${login} logged in successfully`);
      return { accessToken, refreshToken };
    } catch (error) {
      await this.loggingService.error(
        `Login failed for ${login}: ${error.message}`,
      );
      throw error;
    }
  }

  async refresh(refreshToken: string) {
    try {
      if (!refreshToken) {
        throw new BadRequestException('Refresh token is required');
      }

      const payload = this.jwtService.checkRefreshToken(refreshToken);
      const user = await this.userService.findOne(payload.userId);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const newAccessToken = this.jwtService.createAccessToken(
        user.id,
        user.login,
      );
      const newRefreshToken = this.jwtService.createRefreshToken(
        user.id,
        user.login,
      );

      await this.loggingService.log(`Tokens refreshed for user ${user.login}`);
      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      await this.loggingService.error(`Token refresh failed: ${error.message}`);
      throw error;
    }
  }
}
