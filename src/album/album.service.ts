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

@Injectable()
export class AlbumService {
  constructor(private readonly database: DatabaseService) {}

  findAll(): Album[] {
    return this.database.albums;
  }

  findOne(id: string): Album {
    if (!this.isValidUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }

    const album = this.database.albums.find((a) => a.id === id);
    if (!album) {
      throw new NotFoundException('Album not found');
    }

    return album;
  }

  create(createAlbumDto: CreateAlbumDto): Album {
    const newAlbum: Album = {
      id: randomUUID(),
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId: createAlbumDto.artistId || null,
    };

    this.database.albums.push(newAlbum);
    return newAlbum;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto): Album {
    if (!this.isValidUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }

    const albumIndex = this.database.albums.findIndex((a) => a.id === id);
    if (albumIndex === -1) {
      throw new NotFoundException('Album not found');
    }

    const updatedAlbum: Album = {
      ...this.database.albums[albumIndex],
      ...updateAlbumDto,
    };

    this.database.albums[albumIndex] = updatedAlbum;
    return updatedAlbum;
  }

  remove(id: string): void {
    if (!this.isValidUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }

    const albumIndex = this.database.albums.findIndex((a) => a.id === id);
    if (albumIndex === -1) {
      throw new NotFoundException('Album not found');
    }

    this.database.removeAlbumId(id);
    this.database.albums.splice(albumIndex, 1);
  }

  private isValidUUID(id: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  }
}
