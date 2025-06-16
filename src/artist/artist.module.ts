import { Module } from '@nestjs/common';
import { ArtistController } from './artist.controller';
import { DatabaseModule } from '../database/database.module';
import { ArtistService } from './artist.service';
import { LoggingService } from '../logging/logging.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ArtistController],
  providers: [ArtistService, LoggingService],
  exports: [ArtistService],
})
export class ArtistModule {}
