import {
  Controller,
  Get,
  Post,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { LoggingService } from '../logging/logging.service';

@Controller('favs')
export class FavoritesController {
  constructor(
    private readonly favoritesService: FavoritesService,
    private readonly loggingService: LoggingService,
  ) {}

  @Get()
  async findAll() {
    await this.loggingService.log('Starting to fetch all favorites');
    return this.favoritesService.findAll();
  }

  @Post('track/:id')
  async addTrack(@Param('id') id: string) {
    await this.loggingService.log(`Starting to add track ${id} to favorites`);
    return this.favoritesService.addTrack(id);
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeTrack(@Param('id') id: string) {
    await this.loggingService.log(
      `Starting to remove track ${id} from favorites`,
    );
    return this.favoritesService.removeTrack(id);
  }

  @Post('album/:id')
  async addAlbum(@Param('id') id: string) {
    await this.loggingService.log(`Starting to add album ${id} to favorites`);
    return this.favoritesService.addAlbum(id);
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAlbum(@Param('id') id: string) {
    await this.loggingService.log(
      `Starting to remove album ${id} from favorites`,
    );
    return this.favoritesService.removeAlbum(id);
  }

  @Post('artist/:id')
  async addArtist(@Param('id') id: string) {
    await this.loggingService.log(`Starting to add artist ${id} to favorites`);
    return this.favoritesService.addArtist(id);
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeArtist(@Param('id') id: string) {
    await this.loggingService.log(
      `Starting to remove artist ${id} from favorites`,
    );
    return this.favoritesService.removeArtist(id);
  }
}
