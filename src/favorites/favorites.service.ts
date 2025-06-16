import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Favorites } from './entities/favorites.entity';
import { DatabaseService } from 'src/database/database.service';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class FavoritesService {
  constructor(
    private readonly database: DatabaseService,
    private readonly loggingService: LoggingService,
  ) {}

  async findAll(): Promise<Favorites> {
    try {
      const favoriteArtists = this.database.artists.filter((artist) =>
        this.database.favorites.artists.some((ar) => ar.id === artist.id),
      );

      const favoriteAlbums = this.database.albums.filter((album) =>
        this.database.favorites.albums.some((al) => al.id === album.id),
      );

      const favoriteTracks = this.database.tracks.filter((track) =>
        this.database.favorites.tracks.some((tr) => tr.id === track.id),
      );

      await this.loggingService.log(
        `Retrieved all favorites: ${favoriteArtists.length} artists, ${favoriteAlbums.length} albums, ${favoriteTracks.length} tracks`,
      );

      return {
        artists: favoriteArtists,
        albums: favoriteAlbums,
        tracks: favoriteTracks,
      };
    } catch (error) {
      await this.loggingService.error(
        `Failed to retrieve favorites: ${error.message}`,
      );
      throw error;
    }
  }

  async addTrack(id: string) {
    try {
      this.validateId(id);

      const trackToAdd = this.database.tracks.find((track) => track.id === id);

      if (!trackToAdd) {
        await this.loggingService.warn(
          `Track not found when trying to add to favorites: ${id}`,
        );
        throw new HttpException(
          'Track not found',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }

      const favoriteTrackIds = new Set(
        this.database.favorites.tracks.map((track) => track.id),
      );

      if (!favoriteTrackIds.has(id)) {
        this.database.favorites.tracks.push(trackToAdd);
        await this.loggingService.log(`Track ${id} added to favorites`);
      } else {
        await this.loggingService.log(
          `Track ${id} already in favorites, no action taken`,
        );
      }

      return { message: 'Track added to favorites' };
    } catch (error) {
      await this.loggingService.error(
        `Failed to add track ${id} to favorites: ${error.message}`,
      );
      throw error;
    }
  }

  async removeTrack(id: string) {
    try {
      this.validateId(id);

      const initialLength = this.database.favorites.tracks.length;
      this.database.favorites.tracks = this.database.favorites.tracks.filter(
        (track) => track.id !== id,
      );

      if (this.database.favorites.tracks.length === initialLength) {
        await this.loggingService.warn(
          `Track ${id} not found in favorites when trying to remove`,
        );
        throw new HttpException(
          'Track is not in favorites',
          HttpStatus.NOT_FOUND,
        );
      }

      await this.loggingService.log(`Track ${id} removed from favorites`);
    } catch (error) {
      await this.loggingService.error(
        `Failed to remove track ${id} from favorites: ${error.message}`,
      );
      throw error;
    }
  }

  async addAlbum(id: string) {
    try {
      this.validateId(id);

      const albumToAdd = this.database.albums.find((album) => album.id === id);

      if (!albumToAdd) {
        await this.loggingService.warn(
          `Album not found when trying to add to favorites: ${id}`,
        );
        throw new HttpException(
          'Album not found',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }

      const favoriteAlbumIds = new Set(
        this.database.favorites.albums.map((album) => album.id),
      );

      if (!favoriteAlbumIds.has(id)) {
        this.database.favorites.albums.push(albumToAdd);
        await this.loggingService.log(`Album ${id} added to favorites`);
      } else {
        await this.loggingService.log(
          `Album ${id} already in favorites, no action taken`,
        );
      }

      return { message: 'Album added to favorites' };
    } catch (error) {
      await this.loggingService.error(
        `Failed to add album ${id} to favorites: ${error.message}`,
      );
      throw error;
    }
  }

  async removeAlbum(id: string) {
    try {
      this.validateId(id);

      const initialLength = this.database.favorites.albums.length;
      this.database.favorites.albums = this.database.favorites.albums.filter(
        (album) => album.id !== id,
      );

      if (this.database.favorites.albums.length === initialLength) {
        await this.loggingService.warn(
          `Album ${id} not found in favorites when trying to remove`,
        );
        throw new HttpException(
          'Album is not in favorites',
          HttpStatus.NOT_FOUND,
        );
      }

      await this.loggingService.log(`Album ${id} removed from favorites`);
    } catch (error) {
      await this.loggingService.error(
        `Failed to remove album ${id} from favorites: ${error.message}`,
      );
      throw error;
    }
  }

  async addArtist(id: string) {
    try {
      this.validateId(id);

      const artistToAdd = this.database.artists.find(
        (artist) => artist.id === id,
      );

      if (!artistToAdd) {
        await this.loggingService.warn(
          `Artist not found when trying to add to favorites: ${id}`,
        );
        throw new HttpException(
          'Artist not found',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }

      const favoriteArtistIds = new Set(
        this.database.favorites.artists.map((artist) => artist.id),
      );

      if (!favoriteArtistIds.has(id)) {
        this.database.favorites.artists.push(artistToAdd);
        await this.loggingService.log(`Artist ${id} added to favorites`);
      } else {
        await this.loggingService.log(
          `Artist ${id} already in favorites, no action taken`,
        );
      }

      return { message: 'Artist added to favorites' };
    } catch (error) {
      await this.loggingService.error(
        `Failed to add artist ${id} to favorites: ${error.message}`,
      );
      throw error;
    }
  }

  async removeArtist(id: string) {
    try {
      this.validateId(id);

      const initialLength = this.database.favorites.artists.length;
      this.database.favorites.artists = this.database.favorites.artists.filter(
        (artist) => artist.id !== id,
      );

      if (this.database.favorites.artists.length === initialLength) {
        await this.loggingService.warn(
          `Artist ${id} not found in favorites when trying to remove`,
        );
        throw new HttpException(
          'Artist is not in favorites',
          HttpStatus.NOT_FOUND,
        );
      }

      await this.loggingService.log(`Artist ${id} removed from favorites`);
    } catch (error) {
      await this.loggingService.error(
        `Failed to remove artist ${id} from favorites: ${error.message}`,
      );
      throw error;
    }
  }

  private validateId(id: string): void {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      this.loggingService.warn(`Invalid ID format: ${id}`);
      throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST);
    }
  }
}
