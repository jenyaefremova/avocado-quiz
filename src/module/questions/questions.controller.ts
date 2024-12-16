import { Controller, Get, Post, Param, Body, Delete } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { Question } from 'src/schemas/question.schema';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post('create')
  async create(@Body() createQuestionDto: Partial<Question>) {
    return await this.questionsService.create(createQuestionDto);
  }

  @Post('bulk-create')
  async createManyQuestions(@Body() createQuestionsDto: Partial<Question>[]) {
    return this.questionsService.createMany(createQuestionsDto);
  }

  @Get('all')
  async findAll() {
    return await this.questionsService.findAll();
  }

  @Get(':category')
  async findByCategory(@Param('category') category: string) {
    return await this.questionsService.findByCategory(category);
  }

  @Delete(':id')
  async deleteQuestion(@Param('id') id: string) {
    return this.questionsService.delete(id);
  }
}
