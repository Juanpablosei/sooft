import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRepository } from '../../domain/repositories/user.repository.port';
import { User } from '../../domain/entities/user.entity';
import { UserDocument } from '../schemas/user.schema';


@Injectable()
export class UserRepositoryMongoAdapter implements UserRepository {
  constructor(@InjectModel('User') private readonly userModel: Model<UserDocument>) {}

  async findByEmail(email:string): Promise<User | null> {
    const existingUser = await this.userModel.findOne({ email: email });
   if (!existingUser) {
    return null
   }
   return existingUser
  
  }

  async save(user: User): Promise<User | null> {

    const existingUser = await this.userModel.findOne({ email: user.email });
    if (existingUser) {
      return null; 
    }
  
    const createdUser = new this.userModel({
      email: user.email,
      password: user.password,
    });
    try {
      const savedUser = await createdUser.save();
      return new User(savedUser.email, savedUser.password);
    }
    catch (error) {
      console.error('Error saving user:', error);
      throw new Error('Failed to save user');
    }

  }

  async updateToken(email: string, token: string): Promise<void> {
    await this.userModel.updateOne( { token },{ email }).exec();
  }
}