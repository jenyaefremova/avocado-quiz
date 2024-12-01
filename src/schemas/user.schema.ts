import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

// TODO change validation to class-validations https://docs.nestjs.com/techniques/validation
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, minlength: 2, maxlength: 50 })
  name: string;

  @Prop({ required: true, unique: true, match: /.+\@.+\..+/ })
  email: string;

  @Prop({ required: true, minlength: 6 })
  password: string;

  @Prop({ required: true, default: 0 })
  score: number;

  @Prop({ default: 'user', enum: ['user', 'admin'] })
  role: string;

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
}

export const UserSchema = SchemaFactory.createForClass(User);
