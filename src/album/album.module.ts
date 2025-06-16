import { Module } from '@nestjs/common';
import { AlbumController } from './album.controller';
import { DatabaseModule } from '../database/database.module';
import { AlbumService } from './album.service';
import { LoggingService } from '../logging/logging.service';

@Module({
  imports: [DatabaseModule],
  controllers: [AlbumController],
  providers: [AlbumService, LoggingService],
  exports: [AlbumService],
})
export class AlbumModule {}
