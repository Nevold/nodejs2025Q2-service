import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DatabaseModule } from '../database/database.module';
import { LoggingService } from '../logging/logging.service';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [UserService, LoggingService],
  exports: [UserService],
})
export class UserModule {}
