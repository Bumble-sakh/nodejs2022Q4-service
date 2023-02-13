import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { validate } from 'uuid';
import { PrismaService } from '../store/prisma.service';
import { User as UserModel, Prisma } from '@prisma/client';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  users: User[];

  constructor(private prisma: PrismaService) {}

  private userAdapter(user: UserModel) {
    const { id, login, password, version, createdAt, updatedAt } = user;
    const created = createdAt.getTime();
    const updated = updatedAt.getTime();
    return new User({
      id,
      login,
      password,
      version,
      createdAt: created,
      updatedAt: updated,
    });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    if (!('login' in data) || !('password' in data)) {
      throw new HttpException(
        'Request does not contain required fields',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (typeof data.login !== 'string' || typeof data.password !== 'string') {
      throw new HttpException(
        'Request does not contain required fields',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.prisma.user.create({ data });
    return this.userAdapter(user);
  }

  async findUsers(): Promise<User[]> {
    const users = await this.prisma.user.findMany({});
    return users.map((user) => this.userAdapter(user));
  }

  async findUser(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
    const { id } = where;

    const idIsValid = validate(id);

    if (!idIsValid) {
      throw new HttpException('Id is not uuid', HttpStatus.BAD_REQUEST);
    }

    try {
      const user = await this.prisma.user.findUnique({
        where,
      });

      return this.userAdapter(user);
    } catch (error) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: UpdateUserDto;
  }): Promise<User> {
    const { where, data } = params;
    const { id } = where;

    const idIsValid = validate(id);

    if (!idIsValid) {
      throw new HttpException('Id is not uuid', HttpStatus.BAD_REQUEST);
    }

    if (!('oldPassword' in data) || !('newPassword' in data)) {
      throw new HttpException(
        'Request does not contain required fields',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      typeof data.oldPassword !== 'string' ||
      typeof data.newPassword !== 'string'
    ) {
      throw new HttpException(
        'Request does not contain required fields',
        HttpStatus.BAD_REQUEST,
      );
    }

    const updatedUser = await this.findUser({ id });

    if (updatedUser) {
      if (updatedUser.password !== data.oldPassword) {
        throw new HttpException(`Old password is wrong`, HttpStatus.FORBIDDEN);
      }

      const password = data.newPassword;
      const version = updatedUser.version + 1;

      const user = await this.prisma.user.update({
        data: { password, version },
        where,
      });
      return this.userAdapter(user);
    }
  }

  async removeUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    const { id } = where;
    const idIsValid = validate(id);

    if (!idIsValid) {
      throw new HttpException('Id is not uuid', HttpStatus.BAD_REQUEST);
    }

    try {
      await this.prisma.user.delete({ where });
      return;
    } catch (error) {
      throw new HttpException(`User not found`, HttpStatus.NOT_FOUND);
    }
  }
}
