import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { User } from 'src/schemas/user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { UsersService } from 'src/module/users/users.service';

const mockMongooseTokens = [
  {
    provide: getModelToken(User.name),
    useValue: User,
  },
];

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        ...mockMongooseTokens,
        {
          provide: UsersService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
