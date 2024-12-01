import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Question, QuestionDocument } from 'src/schemas/question.schema';

@Injectable()
export class QuizService {
  constructor(
    @InjectModel(Question.name)
    private readonly questionModel: Model<QuestionDocument>,
  ) {}

  async getQuestionsForUser(userId: string): Promise<Question[]> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new NotFoundException('Invalid user ID format');
    }

    const questions = await this.questionModel
      .find({ usersFinished: { $ne: new Types.ObjectId(userId) } })
      .limit(3)
      .exec();

    if (!questions || questions.length === 0) {
      throw new NotFoundException('No questions available for this user');
    }

    return questions;
  }
}
