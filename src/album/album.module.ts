import { Module } from '@nestjs/common';
import { AlbumController } from './album.controller';
import { DatabaseModule } from '../database/database.module';
import { AlbumService } from './album.service';

@Module({
  imports: [DatabaseModule],
  controllers: [AlbumController],
  providers: [AlbumService],
  // exports: [AlbumService],
})
export class AlbumModule {}
