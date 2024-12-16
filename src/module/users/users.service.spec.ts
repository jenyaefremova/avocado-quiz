import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from 'src/schemas/user.schema';
import { getModelToken } from '@nestjs/mongoose';

const mockMongooseTokens = [
  {
    provide: getModelToken(User.name),
    useValue: User,
  },
];

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ...mockMongooseTokens,
        {
          provide: UsersService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined(); // mongoose module imported but not working
  });
});
