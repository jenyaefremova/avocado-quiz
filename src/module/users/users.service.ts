import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';

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

    const newUser = new this.userModel(createUserDto);
    return newUser.save();
  }

  async getAllUsers(): Promise<User[]> {
    const users = await this.userModel.find().exec();
    if (users.length === 0) {
      throw new NotFoundException('No users found in the database');
    }
    return users;
  }

  async getFirstUser(): Promise<User> {
    const firstUser = await this.userModel
      .findOne()
      .sort({ createdAt: 1 })
      .exec();
    if (!firstUser) {
      throw new NotFoundException('No users found in the database');
    }
    return firstUser;
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }
}
