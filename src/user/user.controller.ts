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
  ParseUUIDPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { LoggingService } from '../logging/logging.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly loggingService: LoggingService,
  ) {}

  @Get()
  async findAll() {
    await this.loggingService.log('Starting to fetch all users');
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.loggingService.log(`Starting to fetch user with ID: ${id}`);
    return this.userService.findOne(id);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    await this.loggingService.log(
      `Starting to create user with login: ${createUserDto.login}`,
    );
    return this.userService.create(createUserDto);
  }

  @Put(':id')
  async updatePassword(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    await this.loggingService.log(
      `Starting to update password for user ID: ${id}`,
    );
    return this.userService.updatePassword(id, updatePasswordDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.loggingService.log(`Starting to delete user with ID: ${id}`);
    return this.userService.remove(id);
  }
}
