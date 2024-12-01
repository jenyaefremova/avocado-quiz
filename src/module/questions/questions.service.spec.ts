import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsService } from './questions.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Question, QuestionSchema } from 'src/schemas/question.schema';

describe('QuestionsService', () => {
  let service: QuestionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuestionsService],
      imports: [
        MongooseModule.forFeature([
          { name: Question.name, schema: QuestionSchema },
        ]),
      ],
    }).compile();

    service = module.get<QuestionsService>(QuestionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
