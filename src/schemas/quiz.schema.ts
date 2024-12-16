import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type QuizDocument = HydratedDocument<Quiz>;

@Schema({ timestamps: true })
export class Quiz {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userID: Types.ObjectId;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Question' }],
    required: true,
  })
  questions: Types.ObjectId[];

  @Prop({
    type: [
      {
        questionId: { type: Types.ObjectId, ref: 'Question', required: true },
        answer: { type: String, required: true },
        isCorrect: { type: Boolean, required: true },
      },
    ],
    default: [],
  })
  answers: {
    questionId: Types.ObjectId;
    answer: string;
    isCorrect: boolean;
  }[];

  @Prop({ type: Date, default: null })
  finishedAt: Date | null;
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
