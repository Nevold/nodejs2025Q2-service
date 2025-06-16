import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { DatabaseService } from 'src/database/database.service';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class AlbumService {
  constructor(
    private readonly database: DatabaseService,
    private readonly loggingService: LoggingService,
  ) {}

  async findAll(): Promise<Album[]> {
    try {
      const albums = this.database.albums;
      await this.loggingService.log(`Retrieved ${albums.length} albums`);
      return albums;
    } catch (error) {
      await this.loggingService.error(
        `Failed to fetch albums: ${error.message}`,
      );
      throw error;
    }
  }

  async findOne(id: string): Promise<Album> {
    try {
      if (!this.isValidUUID(id)) {
        await this.loggingService.warn(`Invalid UUID format: ${id}`);
        throw new BadRequestException('Invalid UUID');
      }

      const album = this.database.albums.find((a) => a.id === id);
      if (!album) {
        await this.loggingService.warn(`Album not found with ID: ${id}`);
        throw new NotFoundException('Album not found');
      }

      await this.loggingService.log(`Retrieved album with ID: ${id}`);
      return album;
    } catch (error) {
      await this.loggingService.error(
        `Failed to fetch album ${id}: ${error.message}`,
      );
      throw error;
    }
  }

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    try {
      const newAlbum: Album = {
        id: randomUUID(),
        name: createAlbumDto.name,
        year: createAlbumDto.year,
        artistId: createAlbumDto.artistId || null,
      };

      this.database.albums.push(newAlbum);
      await this.loggingService.log(
        `Created new album with ID: ${newAlbum.id}, name: ${newAlbum.name}`,
      );
      return newAlbum;
    } catch (error) {
      await this.loggingService.error(
        `Failed to create album: ${error.message}`,
      );
      throw error;
    }
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    try {
      if (!this.isValidUUID(id)) {
        await this.loggingService.warn(`Invalid UUID format: ${id}`);
        throw new BadRequestException('Invalid UUID');
      }

      const albumIndex = this.database.albums.findIndex((a) => a.id === id);
      if (albumIndex === -1) {
        await this.loggingService.warn(`Album not found with ID: ${id}`);
        throw new NotFoundException('Album not found');
      }

      const updatedAlbum: Album = {
        ...this.database.albums[albumIndex],
        ...updateAlbumDto,
      };

      this.database.albums[albumIndex] = updatedAlbum;
      await this.loggingService.log(`Updated album with ID: ${id}`);

      return updatedAlbum;
    } catch (error) {
      await this.loggingService.error(
        `Failed to update album ${id}: ${error.message}`,
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

      const albumIndex = this.database.albums.findIndex((a) => a.id === id);
      if (albumIndex === -1) {
        await this.loggingService.warn(`Album not found with ID: ${id}`);
        throw new NotFoundException('Album not found');
      }

      this.database.removeAlbumId(id);
      this.database.albums.splice(albumIndex, 1);
      await this.loggingService.log(`Deleted album with ID: ${id}`);
    } catch (error) {
      await this.loggingService.error(
        `Failed to delete album ${id}: ${error.message}`,
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
