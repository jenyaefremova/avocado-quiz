import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type QuestionDocument = HydratedDocument<Question>;

@Schema({ timestamps: true })
export class Question {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, enum: ['multiple', 'boolean', 'open'] })
  type: string;

  @Prop({ required: true })
  question: string;

  @Prop({
    type: [String],
    required: true,
    validate: [
      (val: string) => val.length == 4,
      'Answers array must have 4 options.',
    ],
  })
  answers: string[];

  @Prop({ required: true })
  correctAnswer: string;

  @Prop({ required: true, enum: ['easy', 'medium', 'hard'] })
  difficulty: string;

  @Prop()
  category: string;

  @Prop({ default: false })
  isPlayed: boolean;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
