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
      const existingQuestion = await this.questionModel
        .findOne({ question: createQuestionDto.question })
        .exec();
      if (existingQuestion) {
        throw new BadRequestException('Question already exists');
      }
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
      const questionsTexts = createQuestionsDto.map((q) => q.question);

      const existingQuestions = await this.questionModel
        .find({ question: { $in: questionsTexts } })
        .exec();

      if (existingQuestions.length > 0) {
        const existingQuestionTexts = existingQuestions.map((q) => q.question);
        throw new BadRequestException(
          `Questions already exist: ${existingQuestionTexts.join(', ')}`,
        );
      }

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
      .find({ deletedAt: null })
      .select('-usersFinished -correctAnswer')
      .exec();
  }

  async findByCategory(category: string): Promise<Question[]> {
    try {
      const questions = await this.questionModel
        .find({
          category: { $regex: new RegExp(`^${category}$`, 'i') }, // Case-insensitive match
          deletedAt: null,
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

    const updatedQuestion = await this.questionModel
      .findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true })
      .exec();

    if (!updatedQuestion) {
      throw new NotFoundException(`Question with this ID not found`);
    }

    return updatedQuestion;
  }
}
