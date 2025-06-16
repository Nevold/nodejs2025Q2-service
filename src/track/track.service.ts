import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { DatabaseService } from 'src/database/database.service';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class TrackService {
  constructor(
    private readonly database: DatabaseService,
    private readonly loggingService: LoggingService,
  ) {}

  async findAll(): Promise<Track[]> {
    try {
      const tracks = this.database.tracks;
      await this.loggingService.log(`Retrieved ${tracks.length} tracks`);
      return tracks;
    } catch (error) {
      await this.loggingService.error(
        `Failed to fetch tracks: ${error.message}`,
      );
      throw error;
    }
  }

  async findOne(id: string): Promise<Track> {
    try {
      if (!this.isValidUUID(id)) {
        await this.loggingService.warn(`Invalid UUID format: ${id}`);
        throw new BadRequestException('Invalid UUID');
      }

      const track = this.database.tracks.find((t) => t.id === id);
      if (!track) {
        await this.loggingService.warn(`Track not found with ID: ${id}`);
        throw new NotFoundException('Track not found');
      }

      await this.loggingService.log(`Retrieved track with ID: ${id}`);
      return track;
    } catch (error) {
      await this.loggingService.error(
        `Failed to fetch track ${id}: ${error.message}`,
      );
      throw error;
    }
  }

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    try {
      const newTrack: Track = {
        id: randomUUID(),
        name: createTrackDto.name,
        artistId: createTrackDto.artistId || null,
        albumId: createTrackDto.albumId || null,
        duration: createTrackDto.duration,
      };

      this.database.tracks.push(newTrack);
      await this.loggingService.log(
        `Created new track with ID: ${newTrack.id}, name: ${newTrack.name}`,
      );
      return newTrack;
    } catch (error) {
      await this.loggingService.error(
        `Failed to create track: ${error.message}`,
      );
      throw error;
    }
  }

  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<Track> {
    try {
      if (!this.isValidUUID(id)) {
        await this.loggingService.warn(`Invalid UUID format: ${id}`);
        throw new BadRequestException('Invalid UUID');
      }

      const trackIndex = this.database.tracks.findIndex((t) => t.id === id);
      if (trackIndex === -1) {
        await this.loggingService.warn(`Track not found with ID: ${id}`);
        throw new NotFoundException('Track not found');
      }

      const updatedTrack: Track = {
        ...this.database.tracks[trackIndex],
        ...updateTrackDto,
      };

      this.database.tracks[trackIndex] = updatedTrack;
      await this.loggingService.log(`Updated track with ID: ${id}`);

      return updatedTrack;
    } catch (error) {
      await this.loggingService.error(
        `Failed to update track ${id}: ${error.message}`,
      );
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      if (!this.isValidUUID(id)) {
        await this.loggingService.warn(`Invalid UUID format: ${id}`);
        throw new BadRequestException('Invalid UUID');
      }

      const trackIndex = this.database.tracks.findIndex((t) => t.id === id);
      if (trackIndex === -1) {
        await this.loggingService.warn(`Track not found with ID: ${id}`);
        throw new NotFoundException('Track not found');
      }

      this.database.tracks.splice(trackIndex, 1);
      await this.loggingService.log(`Deleted track with ID: ${id}`);
    } catch (error) {
      await this.loggingService.error(
        `Failed to delete track ${id}: ${error.message}`,
      );
      throw error;
    }
  }

  async removeAlbumId(albumId: string): Promise<void> {
    try {
      await this.loggingService.log(`Removing albumId ${albumId} from tracks`);
      this.database.tracks = this.database.tracks.map((track) => {
        if (track.albumId === albumId) {
          return { ...track, albumId: null };
        }
        return track;
      });
    } catch (error) {
      await this.loggingService.error(
        `Failed to remove albumId from tracks: ${error.message}`,
      );
      throw error;
    }
  }

  private isValidUUID(id: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  }
}
