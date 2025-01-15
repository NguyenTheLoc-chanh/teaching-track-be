import { Lecturer } from '@/modules/lecturers/schemas/lecturer.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type UserDocument = HydratedDocument<User>;

@Schema({timestamps: true})
export class User {
  @Prop({ default: () => uuidv4() })
  user_id: string; // Mã tài khoản (UUID hoặc tự sinh)

  @Prop({ required: true, unique: true })
  email: string; // Email người dùng

  @Prop({ required: true })
  password: string; // Mật khẩu (mã hóa)

  //@Prop({ type: mongoose.Schema.Types.ObjectId, ref: Lecturer.name })
  @Prop({ required: true })
  lecturer_id: string; // Mã giảng viên (tham chiếu bảng Lecturers)

  @Prop({ required: true, enum: ['Lecturer', 'Admin'], default: 'Lecturer' })
  role: string; // Vai trò người dùng

  @Prop({ required: true, enum: ['Active', 'Inactive'], default: 'Active' })
  status: string; // Trạng thái tài khoản
}

export const UserSchema = SchemaFactory.createForClass(User);
