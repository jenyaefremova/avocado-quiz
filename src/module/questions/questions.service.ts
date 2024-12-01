import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question, QuestionDocument } from 'src/schemas/question.schema';

@Injectable()
export class QuestionsService {
  private readonly questionLimit: number;

  constructor(
    @InjectModel(Question.name)
    private readonly questionModel: Model<QuestionDocument>,
    private readonly configService: ConfigService,
  ) {
    this.questionLimit = Number(this.configService.get('QUESTION_LIMIT')) || 3;
  }

  async create(createQuestionDto: Partial<Question>): Promise<Question> {
    try {
      const newQuestion = new this.questionModel(createQuestionDto);
      return await newQuestion.save();
    } catch (error) {
      throw new BadRequestException('Failed to create question', error.message);
    }
  }

  async createMany(
    createQuestionsDto: Partial<Question>[],
  ): Promise<Question[]> {
    try {
      const newQuestions = await this.questionModel.insertMany(
        createQuestionsDto,
        { ordered: true },
      );
      return newQuestions;
    } catch (error) {
      throw new BadRequestException(
        'Failed to create questions',
        error.message,
      );
    }
  }

  async findAll(): Promise<Partial<Question>[]> {
    return this.questionModel
      .find()
      .select('-usersFinished -correctAnswer')
      .exec();
  }

  async findByCategory(category: string): Promise<Question[]> {
    try {
      const questions = await this.questionModel
        .find({
          category: { $regex: new RegExp(`^${category}$`, 'i') }, // Case-insensitive match
        })
        .select('-usersFinished -correctAnswer')
        .exec();

      if (!questions || questions.length === 0) {
        throw new NotFoundException(
          `No questions found for category "${category}"`,
        );
      }

      return questions;
    } catch (error) {
      throw new BadRequestException(
        `Failed to fetch questions by category: ${error.message}`,
      );
    }
  }

  async delete(id: string): Promise<Question> {
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BadRequestException('Invalid question ID format');
    }

    const deletedQuestion = await this.questionModel
      .findByIdAndDelete(id)
      .exec();

    if (!deletedQuestion) {
      throw new NotFoundException(`Question with this ID not found`);
    }

    return deletedQuestion;
  }
}
