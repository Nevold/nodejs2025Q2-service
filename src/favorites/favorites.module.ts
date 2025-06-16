import { Module } from '@nestjs/common';
import { FavoritesController } from './favorites.controller';
import { DatabaseModule } from '../database/database.module';
import { FavoritesService } from './favorites.service';
import { LoggingService } from '../logging/logging.service';

@Module({
  imports: [DatabaseModule],
  controllers: [FavoritesController],
  providers: [FavoritesService, LoggingService],
})
export class FavoritesModule {}
