import { Module } from '@nestjs/common';
import { FavoritesController } from './favorites.controller';
import { DatabaseModule } from '../database/database.module';
import { FavoritesService } from './favorites.service';

@Module({
  imports: [DatabaseModule],
  controllers: [FavoritesController],
  providers: [FavoritesService],
})
export class FavoritesModule {}
