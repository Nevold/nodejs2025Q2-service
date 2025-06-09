import { Module } from '@nestjs/common';
import { ArtistController } from './artist.controller';
import { DatabaseModule } from '../database/database.module';
import { ArtistService } from './artist.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ArtistController],
  providers: [ArtistService],
})
export class ArtistModule {}
