import { Controller, Post, Param, Body } from '@nestjs/common';
import { AnswersService } from './answers.service';

@Controller('answers')
export class AnswersController {
  constructor(private readonly answersService: AnswersService) {}

  @Post(':userId/:questionId')
  async submitAnswer(
    @Param('userId') userId: string,
    @Param('questionId') questionId: string,
    @Body() body: { answer: string },
  ) {
    const { answer } = body;
    return this.answersService.submitAnswer(userId, questionId, answer);
  }
}
