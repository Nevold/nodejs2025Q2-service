import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { DatabaseService } from 'src/database/database.service';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class ArtistService {
  constructor(
    private readonly database: DatabaseService,
    private readonly loggingService: LoggingService,
  ) {}

  async findAll(): Promise<Artist[]> {
    try {
      const artists = this.database.artists;
      await this.loggingService.log(`Retrieved ${artists.length} artists`);
      return artists;
    } catch (error) {
      await this.loggingService.error(
        `Failed to fetch artists: ${error.message}`,
      );
      throw error;
    }
  }

  async findOne(id: string): Promise<Artist> {
    try {
      if (!this.isValidUUID(id)) {
        await this.loggingService.warn(`Invalid UUID format: ${id}`);
        throw new BadRequestException('Invalid UUID');
      }

      const artist = this.database.artists.find((a) => a.id === id);
      if (!artist) {
        await this.loggingService.warn(`Artist not found with ID: ${id}`);
        throw new NotFoundException('Artist not found');
      }

      await this.loggingService.log(`Retrieved artist with ID: ${id}`);
      return artist;
    } catch (error) {
      await this.loggingService.error(
        `Failed to fetch artist ${id}: ${error.message}`,
      );
      throw error;
    }
  }

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    try {
      const newArtist: Artist = {
        id: randomUUID(),
        name: createArtistDto.name,
        grammy: createArtistDto.grammy,
      };

      this.database.artists.push(newArtist);
      await this.loggingService.log(
        `Created new artist with ID: ${newArtist.id}, name: ${newArtist.name}`,
      );
      return newArtist;
    } catch (error) {
      await this.loggingService.error(
        `Failed to create artist: ${error.message}`,
      );
      throw error;
    }
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    try {
      if (!this.isValidUUID(id)) {
        await this.loggingService.warn(`Invalid UUID format: ${id}`);
        throw new BadRequestException('Invalid UUID');
      }

      const artistIndex = this.database.artists.findIndex((a) => a.id === id);
      if (artistIndex === -1) {
        await this.loggingService.warn(`Artist not found with ID: ${id}`);
        throw new NotFoundException('Artist not found');
      }

      const updatedArtist: Artist = {
        ...this.database.artists[artistIndex],
        ...updateArtistDto,
      };

      this.database.artists[artistIndex] = updatedArtist;
      await this.loggingService.log(`Updated artist with ID: ${id}`);

      return updatedArtist;
    } catch (error) {
      await this.loggingService.error(
        `Failed to update artist ${id}: ${error.message}`,
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

      const artistIndex = this.database.artists.findIndex((a) => a.id === id);
      if (artistIndex === -1) {
        await this.loggingService.warn(`Artist not found with ID: ${id}`);
        throw new NotFoundException('Artist not found');
      }

      this.database.removeArtistId(id);
      this.database.artists.splice(artistIndex, 1);
      await this.loggingService.log(`Deleted artist with ID: ${id}`);
    } catch (error) {
      await this.loggingService.error(
        `Failed to delete artist ${id}: ${error.message}`,
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
