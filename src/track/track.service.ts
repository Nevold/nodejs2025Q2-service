import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
// import { FavoritesService } from '../favorites/favorites.service';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class TrackService {
  // private tracks: Track[] = [];

  // constructor(private readonly favoritesService: FavoritesService) {}
  constructor(private readonly database: DatabaseService) {}

  findAll(): Track[] {
    return this.database.tracks;
  }

  findOne(id: string): Track {
    if (!this.isValidUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }

    const track = this.database.tracks.find((t) => t.id === id);
    if (!track) {
      throw new NotFoundException('Track not found');
    }

    return track;
  }

  create(createTrackDto: CreateTrackDto): Track {
    const newTrack: Track = {
      id: uuidv4(),
      name: createTrackDto.name,
      artistId: createTrackDto.artistId || null,
      albumId: createTrackDto.albumId || null,
      duration: createTrackDto.duration,
    };

    this.database.tracks.push(newTrack);
    return newTrack;
  }

  update(id: string, updateTrackDto: UpdateTrackDto): Track {
    if (!this.isValidUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }

    const trackIndex = this.database.tracks.findIndex((t) => t.id === id);
    if (trackIndex === -1) {
      throw new NotFoundException('Track not found');
    }

    const updatedTrack: Track = {
      ...this.database.tracks[trackIndex],
      ...updateTrackDto,
    };

    this.database.tracks[trackIndex] = updatedTrack;
    return updatedTrack;
  }

  remove(id: string): void {
    if (!this.isValidUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }

    const trackIndex = this.database.tracks.findIndex((t) => t.id === id);
    if (trackIndex === -1) {
      throw new NotFoundException('Track not found');
    }

    // this.favoritesService.removeTrack(id);

    this.database.tracks.splice(trackIndex, 1);
  }

  // removeArtistId(artistId: string): void {
  //   this.database.tracks = this.database.tracks.map((track) => {
  //     if (track.artistId === artistId) {
  //       return { ...track, artistId: null };
  //     }
  //     return track;
  //   });
  // }

  removeAlbumId(albumId: string): void {
    this.database.tracks = this.database.tracks.map((track) => {
      if (track.albumId === albumId) {
        return { ...track, albumId: null };
      }
      return track;
    });
  }

  private isValidUUID(id: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  }
}
