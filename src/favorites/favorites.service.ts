import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Favorites } from './entities/favorites.entity';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly database: DatabaseService) {}

  findAll(): Favorites {
    const favoriteArtists = this.database.artists.filter((artist) =>
      this.database.favorites.artists.some((ar) => ar.id === artist.id),
    );

    const favoriteAlbums = this.database.albums.filter((album) =>
      this.database.favorites.albums.some((al) => al.id === album.id),
    );

    const favoriteTracks = this.database.tracks.filter((track) =>
      this.database.favorites.tracks.some((tr) => tr.id === track.id),
    );

    return {
      artists: favoriteArtists,
      albums: favoriteAlbums,
      tracks: favoriteTracks,
    };
  }

  addTrack(id: string) {
    this.validateId(id);

    const trackToAdd = this.database.tracks.find((track) => track.id === id);

    if (!trackToAdd) {
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
    }

    return { message: 'Track added to favorites' };
  }

  removeTrack(id: string) {
    this.validateId(id);

    const initialLength = this.database.favorites.tracks.length;
    this.database.favorites.tracks = this.database.favorites.tracks.filter(
      (track) => track.id !== id,
    );

    if (this.database.favorites.tracks.length === initialLength) {
      throw new HttpException(
        'Track is not in favorites',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  addAlbum(id: string) {
    this.validateId(id);

    const albumToAdd = this.database.albums.find((album) => album.id === id);

    if (!albumToAdd) {
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
    }

    return { message: 'Album added to favorites' };
  }

  removeAlbum(id: string) {
    this.validateId(id);

    const initialLength = this.database.favorites.albums.length;
    this.database.favorites.albums = this.database.favorites.albums.filter(
      (album) => album.id !== id,
    );

    if (this.database.favorites.albums.length === initialLength) {
      throw new HttpException(
        'Album is not in favorites',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  addArtist(id: string) {
    this.validateId(id);

    const artistToAdd = this.database.artists.find(
      (artist) => artist.id === id,
    );

    if (!artistToAdd) {
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
    }

    return { message: 'Artist added to favorites' };
  }

  removeArtist(id: string) {
    this.validateId(id);

    const initialLength = this.database.favorites.artists.length;
    this.database.favorites.artists = this.database.favorites.artists.filter(
      (artist) => artist.id !== id,
    );

    if (this.database.favorites.artists.length === initialLength) {
      throw new HttpException(
        'Artist is not in favorites',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  private validateId(id: string): void {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST);
    }
  }
}
