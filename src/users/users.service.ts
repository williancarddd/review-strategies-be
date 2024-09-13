import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, CreateUserSchema } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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
    const transUser = await this.prisma.$transaction(async () => {
      const newUser = await this.prisma.user.create({
        data: {
          ...user,
          password: encryptPassword(user.password),
        }
      });

      return newUser;
    });
    return transUser;
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  

  async update(id: string, updateUserDto: UpdateUserDto) {

    const parseUser = GetUserSchema.parse(updateUserDto);
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
