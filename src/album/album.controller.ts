import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { LoggingService } from '../logging/logging.service';

@Controller('album')
export class AlbumController {
  constructor(
    private readonly albumService: AlbumService,
    private readonly loggingService: LoggingService,
  ) {}

  @Get()
  async findAll() {
    await this.loggingService.log('Starting to fetch all albums');
    return this.albumService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    await this.loggingService.log(`Starting to fetch album with ID: ${id}`);
    return this.albumService.findOne(id);
  }

  @Post()
  async create(@Body() createAlbumDto: CreateAlbumDto) {
    await this.loggingService.log(
      `Starting to create album with name: ${createAlbumDto.name}`,
    );
    return this.albumService.create(createAlbumDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ) {
    await this.loggingService.log(`Starting to update album with ID: ${id}`);
    return this.albumService.update(id, updateAlbumDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.loggingService.log(`Starting to delete album with ID: ${id}`);
    return this.albumService.remove(id);
  }
}
