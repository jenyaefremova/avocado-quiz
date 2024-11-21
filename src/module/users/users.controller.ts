import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Get,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Types } from 'mongoose';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  async createUser(
    @Body() createUserDto: { name: string; email: string; password: string },
  ) {
    try {
      return await this.usersService.createUser(createUserDto);
    } catch (error) {
      if (error.name === 'ValidationError') {
        //is it okay to handle errors like this?
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'ValidationError',
            message: error.message,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal Server Error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('all')
  async getAllUsers() {
    return await this.usersService.getAllUsers();
  }

  @Get('first')
  async getFirstUser() {
    return this.usersService.getFirstUser();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid user ID format',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.usersService.getUserById(id);
  }
}
