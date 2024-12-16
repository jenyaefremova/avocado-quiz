import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async createUser(createUserDto: {
    name: string;
    email: string;
    password: string;
  }): Promise<User> {
    const existingUser = await this.userModel
      .findOne({ email: createUserDto.email })
      .exec();
    if (existingUser) {
      throw new ConflictException(`User with this email already exists.`);
    }

    try {
      const newUser = new this.userModel(createUserDto);
      return await newUser.save();
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          error: 'ValidationError',
          message: Object.values(error.errors).map((err: any) => err.message),
        });
      }
    }

    throw new HttpException(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'UnexpectedError',
        message: 'An unexpected error occurred while creating the user.',
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  async getAllUsers(): Promise<User[]> {
    const users = await this.userModel.find().exec();
    if (users.length === 0) {
      throw new NotFoundException('No users found in the database');
    }
    return users;
  }

  async getUserById(id: string): Promise<User> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid user ID format');
    }

    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return user;
  }
}
