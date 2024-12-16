import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsController } from './questions.controller';
import { getModelToken } from '@nestjs/mongoose';
import { Question } from '../../schemas/question.schema';
import { QuestionsService } from 'src/module/questions/questions.service';

const mockMongooseTokens = [
  {
    provide: getModelToken(Question.name),
    useValue: Question,
  },
];

describe('QuestionsController', () => {
  let controller: QuestionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionsController],
      providers: [
        ...mockMongooseTokens,
        {
          provide: QuestionsService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<QuestionsController>(QuestionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
