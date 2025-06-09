import { Module } from '@nestjs/common';
import { TrackController } from './track.controller';
import { DatabaseModule } from '../database/database.module';
import { TrackService } from './track.service';

@Module({
  imports: [DatabaseModule],
  controllers: [TrackController],
  providers: [TrackService],
})
export class TrackModule {}
