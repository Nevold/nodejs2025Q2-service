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
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { LoggingService } from '../logging/logging.service';

@Controller('track')
export class TrackController {
  constructor(
    private readonly trackService: TrackService,
    private readonly loggingService: LoggingService,
  ) {}

  @Get()
  async findAll() {
    await this.loggingService.log('Starting to fetch all tracks');
    return this.trackService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    await this.loggingService.log(`Starting to fetch track with ID: ${id}`);
    return this.trackService.findOne(id);
  }

  @Post()
  async create(@Body() createTrackDto: CreateTrackDto) {
    await this.loggingService.log(
      `Starting to create track with name: ${createTrackDto.name}`,
    );
    return this.trackService.create(createTrackDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ) {
    await this.loggingService.log(`Starting to update track with ID: ${id}`);
    return this.trackService.update(id, updateTrackDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.loggingService.log(`Starting to delete track with ID: ${id}`);
    return this.trackService.remove(id);
  }
}
