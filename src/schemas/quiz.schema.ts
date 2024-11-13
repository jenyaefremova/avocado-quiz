import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type QuizDocument = HydratedDocument<Quiz>;

@Schema({ timestamps: true })
export class Quiz {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Question' }],
    required: true,
    validate: [arrayLimit, 'Quiz must contain exactly 10 questions.'],
  })
  questions: Types.ObjectId[];

  @Prop()
  completedAt: Date;
}

function arrayLimit(val: Types.ObjectId[]) {
  return val.length === 10;
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
