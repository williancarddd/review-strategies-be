import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, CreateUserSchema } from './dto/create-user.dto';
import { UpdateUserDto, UpdateUserSchema } from './dto/update-user.dto';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { GetUserSchema } from './dto/get-user.dto';
import { encryptPassword } from 'src/utils/crypto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const user = CreateUserSchema.parse(createUserDto);
    user.username = user.email.split('@')[0] + Math.floor(Math.random() * 1000);
    const transUser = await this.prisma.$transaction(async () => {
      const newUser = await this.prisma.user.create({
        data: {
          ...user,
          password: encryptPassword(user.password),
        }
      });
      return newUser;
    });
    
    return {
      ...transUser,
      password: undefined,
    }
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      ...user,
      password: undefined,
    }
  }

  async findByEmailOrUsername(emailOrUsername: string) {
    // check is email
    var emailFormat = /^[a-zA-Z0-9_.+]+(?<!^[0-9]*)@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    var isEmail = emailFormat.test(emailOrUsername);
    const user = isEmail
      ? await this.prisma.user.findUnique({ where: { email: emailOrUsername } })
      : await this.prisma.user.findUnique({ where: { username: emailOrUsername } });
      
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  

  async update(id: string, updateUserDto: UpdateUserDto) {

    const parseUser = UpdateUserSchema.parse(updateUserDto);
    const ifUpdatedPassword = parseUser.password
      ? { password: encryptPassword(parseUser.password) }
      : {};

    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...parseUser,
        password: ifUpdatedPassword.password,
      }
    });
    return user;
  }

  async remove(id: string) {
    const user = await this.prisma.user.delete({
      where: {
        id,
      },
    });

    return user;
  }
}
