import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Question, QuestionDocument } from 'src/schemas/question.schema';
import { Quiz, QuizDocument } from 'src/schemas/quiz.schema';

@Injectable()
export class QuizService {
  private readonly questionLimit: number;

  constructor(
    @InjectModel(Question.name)
    private readonly questionModel: Model<QuestionDocument>,
    @InjectModel(Quiz.name)
    private readonly quizModel: Model<QuizDocument>,
    private readonly configService: ConfigService,
  ) {
    this.questionLimit = Number(this.configService.get('QUESTION_LIMIT')) || 3;
  }

  async getQuestionsForUser(userId: string): Promise<Question[]> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new NotFoundException('Invalid user ID format');
    }

    const activeQuiz = await this.quizModel
      .findOne({ userID: userId, finishedAt: null })
      .populate<{ questions: Question[] }>('questions')
      .exec();

    if (activeQuiz) {
      return activeQuiz.questions;
    }

    const questions = await this.questionModel
      .aggregate([
        {
          $match: {
            usersFinished: { $ne: new Types.ObjectId(userId) },
            deletedAt: null,
          },
        },
        { $sample: { size: this.questionLimit } },
        { $project: { usersFinished: 0, correctAnswer: 0 } },
      ])
      .exec();

    if (!questions || questions.length < this.questionLimit) {
      throw new NotFoundException(
        'Not enough questions available for a new quiz',
      );
    }

    const newQuiz = new this.quizModel({
      userID: userId,
      questions: questions.map((q) => q._id),
    });
    await newQuiz.save();

    return questions;
  }

  async submitAnswer(
    userId: string,
    questionId: string,
    answer: string,
  ): Promise<{ isCorrect: boolean; unansweredCount: number }> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new NotFoundException('Invalid user ID format');
    }
    if (!Types.ObjectId.isValid(questionId)) {
      throw new NotFoundException('Invalid question ID format');
    }

    const quiz = await this.quizModel
      .findOne({ userID: userId, finishedAt: null })
      .exec();

    if (!quiz) {
      throw new NotFoundException('Active quiz not found for the user');
    }
    const question = await this.questionModel.findById(questionId).exec();
    if (!question) {
      throw new NotFoundException('Question not found');
    }

    const existingAnswer = quiz.answers.find(
      (a) => a.questionId.toString() === questionId,
    );

    if (existingAnswer) {
      throw new BadRequestException('Question has already been answered');
    }

    const isCorrect = question.correctAnswer === answer;

    quiz.answers.push({
      questionId: new Types.ObjectId(questionId),
      answer,
      isCorrect,
    });

    await quiz.save();

    if (!question.usersFinished.includes(new Types.ObjectId(userId))) {
      question.usersFinished.push(new Types.ObjectId(userId));
      await question.save();
    }

    const unansweredCount = quiz.questions.length - quiz.answers.length;

    if (unansweredCount === 0) {
      quiz.finishedAt = new Date();
      await quiz.save();
    }

    return { isCorrect, unansweredCount };
  }
}
