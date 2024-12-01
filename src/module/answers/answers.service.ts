import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Question, QuestionDocument } from 'src/schemas/question.schema';
import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class AnswersService {
  constructor(
    @InjectModel(Question.name)
    private readonly questionModel: Model<QuestionDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async submitAnswer(
    userId: string,
    questionId: string,
    answer: string,
  ): Promise<{ isCorrect: boolean; correctAnswer: string }> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID format');
    }
    if (!Types.ObjectId.isValid(questionId)) {
      throw new BadRequestException('Invalid question ID format');
    }

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const question = await this.questionModel.findById(questionId);
    if (!question) {
      throw new NotFoundException('Question not found');
    }

    const isCorrect = question.correctAnswer === answer;

    if (!question.usersFinished.includes(new Types.ObjectId(userId))) {
      question.usersFinished.push(new Types.ObjectId(userId));
      await question.save();
    }

    user.answers.push({
      questionId: new Types.ObjectId(questionId),
      answer,
      isCorrect,
    });

    if (isCorrect) {
      user.score += question.score;
    }
    await user.save();

    return { isCorrect, correctAnswer: question.correctAnswer };
  }
}
