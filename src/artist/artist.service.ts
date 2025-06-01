import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { TrackService } from '../track/track.service';
import { AlbumService } from '../album/album.service';
import { FavoritesService } from '../favorites/favorites.service';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ArtistService {
  // private artists: Artist[] = [];

  constructor(
    // private readonly trackService: TrackService,
    // private readonly favoritesService: FavoritesService,
    // private readonly albumService: AlbumService,
    private readonly database: DatabaseService,
  ) {}
  // constructor(private readonly database: DatabaseService) {}

  findAll(): Artist[] {
    return this.database.artists;
  }

  findOne(id: string): Artist {
    if (!this.isValidUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }

    const artist = this.database.artists.find((a) => a.id === id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    return artist;
  }

  create(createArtistDto: CreateArtistDto): Artist {
    const newArtist: Artist = {
      id: uuidv4(),
      name: createArtistDto.name,
      grammy: createArtistDto.grammy,
    };

    this.database.artists.push(newArtist);
    return newArtist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto): Artist {
    if (!this.isValidUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }

    const artistIndex = this.database.artists.findIndex((a) => a.id === id);
    if (artistIndex === -1) {
      throw new NotFoundException('Artist not found');
    }

    const updatedArtist: Artist = {
      ...this.database.artists[artistIndex],
      ...updateArtistDto,
    };

    this.database.artists[artistIndex] = updatedArtist;
    return updatedArtist;
  }

  remove(id: string): void {
    if (!this.isValidUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }

    const artistIndex = this.database.artists.findIndex((a) => a.id === id);
    if (artistIndex === -1) {
      throw new NotFoundException('Artist not found');
    }

    // this.favoritesService.removeArtist(id);
    // this.trackService.removeArtistId(id);
    // this.albumService.removeArtistId(id);
    this.database.removeArtistId(id);

    this.database.artists.splice(artistIndex, 1);
  }

  private isValidUUID(id: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  }
}
