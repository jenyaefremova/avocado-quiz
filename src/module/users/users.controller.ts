import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  async createUser(
    @Body() createUserDto: { name: string; email: string; password: string },
  ) {
    return await this.usersService.createUser(createUserDto);
  }

  @Get('all')
  async getAllUsers() {
    return await this.usersService.getAllUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }
}
