import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/module/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QuestionsModule } from 'src/module/questions/questions.module';
import { QuizModule } from './module/quiz/quiz.module';
import { AnswersModule } from './module/answers/answers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>(
          'MONGO_URI',
          'mongodb://localhost:27017/nest',
        ),
      }),
    }),
    UsersModule,
    QuestionsModule,
    QuizModule,
    AnswersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
