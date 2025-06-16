import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User } from './entities/user.entity';
import { DatabaseService } from '../database/database.service';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class UserService {
  constructor(
    private readonly database: DatabaseService,
    private readonly loggingService: LoggingService,
  ) {}

  async findAll(): Promise<Omit<User, 'password'>[]> {
    try {
      const users = this.database.users.map((user) => {
        return Object.fromEntries(
          Object.entries(user).filter(([key]) => key !== 'password'),
        ) as User;
      });
      await this.loggingService.log(
        `Retrieved all users (count: ${users.length})`,
      );
      return users;
    } catch (error) {
      await this.loggingService.error(
        `Failed to retrieve users: ${error.message}`,
      );
      throw error;
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      if (!this.isValidUUID(id)) {
        await this.loggingService.warn(`Invalid UUID format: ${id}`);
        throw new BadRequestException('Invalid UUID');
      }

      const user = this.database.users.find((u) => u.id === id);
      if (!user) {
        await this.loggingService.warn(`User not found with ID: ${id}`);
        throw new NotFoundException('User not found');
      }

      await this.loggingService.log(`Retrieved user with ID: ${id}`);
      return Object.fromEntries(
        Object.entries(user).filter(([key]) => key !== 'password'),
      ) as User;
    } catch (error) {
      await this.loggingService.error(
        `Failed to retrieve user ${id}: ${error.message}`,
      );
      throw error;
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const newUser: User = {
        id: randomUUID(),
        login: createUserDto.login,
        password: createUserDto.password,
        version: 1,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      this.database.users.push(newUser);
      await this.loggingService.log(
        `Created new user with ID: ${newUser.id} and login: ${newUser.login}`,
      );

      return Object.fromEntries(
        Object.entries(newUser).filter(([key]) => key !== 'password'),
      ) as User;
    } catch (error) {
      await this.loggingService.error(
        `Failed to create user: ${error.message}`,
      );
      throw error;
    }
  }

  async updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<User> {
    try {
      if (!this.isValidUUID(id)) {
        await this.loggingService.warn(`Invalid UUID format: ${id}`);
        throw new BadRequestException('Invalid UUID');
      }

      const userIndex = this.database.users.findIndex((u) => u.id === id);
      if (userIndex === -1) {
        await this.loggingService.warn(`User not found with ID: ${id}`);
        throw new NotFoundException('User not found');
      }

      const user = this.database.users[userIndex];
      if (user.password !== updatePasswordDto.oldPassword) {
        await this.loggingService.warn(
          `Incorrect old password for user ID: ${id}`,
        );
        throw new ForbiddenException('Old password is incorrect');
      }

      const updatedUser: User = {
        ...user,
        password: updatePasswordDto.newPassword,
        version: user.version + 1,
        updatedAt: Date.now(),
      };

      this.database.users[userIndex] = updatedUser;
      await this.loggingService.log(`Updated password for user ID: ${id}`);

      return Object.fromEntries(
        Object.entries(updatedUser).filter(([key]) => key !== 'password'),
      ) as User;
    } catch (error) {
      await this.loggingService.error(
        `Failed to update password for user ${id}: ${error.message}`,
      );
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      if (!this.isValidUUID(id)) {
        await this.loggingService.warn(`Invalid UUID format: ${id}`);
        throw new BadRequestException('Invalid UUID');
      }

      const userIndex = this.database.users.findIndex((u) => u.id === id);
      if (userIndex === -1) {
        await this.loggingService.warn(`User not found with ID: ${id}`);
        throw new NotFoundException('User not found');
      }

      this.database.users.splice(userIndex, 1);
      await this.loggingService.log(`Deleted user with ID: ${id}`);
    } catch (error) {
      await this.loggingService.error(
        `Failed to delete user ${id}: ${error.message}`,
      );
      throw error;
    }
  }

  private isValidUUID(id: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  }

  async findByLogin(login: string): Promise<User | undefined> {
    try {
      await this.loggingService.log(`Searching for user by login: ${login}`);
      return this.database.users.find((user) => user.login === login);
    } catch (error) {
      await this.loggingService.error(
        `Failed to find user by login ${login}: ${error.message}`,
      );
      throw error;
    }
  }
}
