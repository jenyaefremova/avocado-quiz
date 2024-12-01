import { Controller, Get, Param } from '@nestjs/common';
import { QuizService } from './quiz.service';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get('questions/:userId')
  async getQuestionsForUser(@Param('userId') userId: string) {
    return this.quizService.getQuestionsForUser(userId);
  }
}
