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
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { LoggingService } from '../logging/logging.service';

@Controller('artist')
export class ArtistController {
  constructor(
    private readonly artistService: ArtistService,
    private readonly loggingService: LoggingService,
  ) {}

  @Get()
  async findAll() {
    await this.loggingService.log('Starting to fetch all artists');
    return this.artistService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    await this.loggingService.log(`Starting to fetch artist with ID: ${id}`);
    return this.artistService.findOne(id);
  }

  @Post()
  async create(@Body() createArtistDto: CreateArtistDto) {
    await this.loggingService.log(
      `Starting to create artist with name: ${createArtistDto.name}`,
    );
    return this.artistService.create(createArtistDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ) {
    await this.loggingService.log(`Starting to update artist with ID: ${id}`);
    return this.artistService.update(id, updateArtistDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.loggingService.log(`Starting to delete artist with ID: ${id}`);
    return this.artistService.remove(id);
  }
}
