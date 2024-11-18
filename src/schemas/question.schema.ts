import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type QuestionDocument = HydratedDocument<Question>;

@Schema({ timestamps: true })
export class Question {
  @Prop({ type: [Types.ObjectId], ref: 'User', required: true })
  usersFinished: Types.ObjectId[];

  @Prop({ required: true, enum: ['multiple', 'boolean', 'open'] })
  type: string;

  @Prop({ required: true })
  question: string;

  @Prop({
    type: [String],
  })
  options: string[];

  @Prop({ required: true })
  correctAnswer: string;

  @Prop({ required: true, type: Number, min: 0 })
  score: number;

  @Prop()
  category: string;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
