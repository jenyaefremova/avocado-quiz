import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question, QuestionDocument } from 'src/schemas/question.schema';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel(Question.name)
    private readonly questionModel: Model<QuestionDocument>,
  ) {}

  async create(createQuestionDto: Partial<Question>): Promise<Question> {
    try {
      const newQuestion = new this.questionModel(createQuestionDto);
      return await newQuestion.save();
    } catch (error) {
      throw new BadRequestException('Failed to create question', error.message);
    }
  }

  async findAll(): Promise<Question[]> {
    return this.questionModel.find().exec();
  }

  async findByCategory(category: string): Promise<Question[]> {
    try {
      const questions = await this.questionModel
        .find({
          category: { $regex: new RegExp(`^${category}$`, 'i') }, // Case-insensitive match
        })
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
}
