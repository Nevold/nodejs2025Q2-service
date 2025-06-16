import { Module } from '@nestjs/common';
import { TrackController } from './track.controller';
import { DatabaseModule } from '../database/database.module';
import { TrackService } from './track.service';
import { LoggingService } from '../logging/logging.service';

@Module({
  imports: [DatabaseModule],
  controllers: [TrackController],
  providers: [TrackService, LoggingService],
  exports: [TrackService],
})
export class TrackModule {}
