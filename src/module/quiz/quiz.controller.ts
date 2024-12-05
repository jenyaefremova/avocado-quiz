import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { QuizService } from './quiz.service';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get('questions/:userId')
  async getQuestionsForUser(@Param('userId') userId: string) {
    return this.quizService.getQuestionsForUser(userId);
  }

  @Post('answer/:userId/:questionId')
  async submitAnswer(
    @Param('userId') userId: string,
    @Param('questionId') questionId: string,
    @Body() body: { answer: string },
  ) {
    return this.quizService.submitAnswer(userId, questionId, body.answer);
  }
}
