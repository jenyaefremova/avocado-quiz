import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsService } from './questions.service';
import { getModelToken } from '@nestjs/mongoose';
import { Question } from 'src/schemas/question.schema';

const mockMongooseTokens = [
  {
    provide: getModelToken(Question.name),
    useValue: Question,
  },
];

describe('QuestionsService', () => {
  let service: QuestionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ...mockMongooseTokens,
        {
          provide: QuestionsService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<QuestionsService>(QuestionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
