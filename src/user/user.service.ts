import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { store } from '../store/store';
import { User } from './entities/user.entity';
import { v4 as uuid, validate } from 'uuid';

@Injectable()
export class UserService {
  users: User[];

  constructor() {
    this.users = store.users;
  }

  create(createUserDto: CreateUserDto) {
    if (!('login' in createUserDto) || !('password' in createUserDto)) {
      throw new HttpException(
        'Request does not contain required fields',
        HttpStatus.BAD_REQUEST,
      );
    }

    const id = uuid();
    const timestamp = Date.now();
    const { login, password } = createUserDto;
    const version = 1;
    const createdAt = timestamp;
    const updatedAt = timestamp;
    const user = { id, login, password, version, createdAt, updatedAt };

    this.users.push(user);

    return { id, login, version, createdAt, updatedAt };
  }

  findAll() {
    return this.users;
  }

  findOne(id: string) {
    const idIsValid = validate(id);

    if (!idIsValid) {
      throw new HttpException('Id is not uuid', HttpStatus.BAD_REQUEST);
    }

    const user = this.users.find((user) => user.id === id);

    if (user) {
      const { id, login, version, createdAt, updatedAt } = user;
      return { id, login, version, createdAt, updatedAt };
    }

    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const idIsValid = validate(id);

    if (!idIsValid) {
      throw new HttpException('Id is not uuid', HttpStatus.BAD_REQUEST);
    }

    if (
      !('oldPassword' in updateUserDto) ||
      !('newPassword' in updateUserDto)
    ) {
      throw new HttpException(
        'Request does not contain required fields',
        HttpStatus.BAD_REQUEST,
      );
    }

    const index = this.users.findIndex((user) => user.id === id);
    const user = this.users[index];

    if (user) {
      if (user.password !== updateUserDto.oldPassword) {
        throw new HttpException(`Old password is wrong`, HttpStatus.FORBIDDEN);
      }

      const timestamp = Date.now();
      const password = updateUserDto?.newPassword;
      const version = user.version + 1;
      const updatedAt = timestamp;

      Object.assign(user, { password, version, updatedAt });

      this.users.splice(index, 1, user);

      const { login, createdAt } = user;

      return { id, login, version, createdAt, updatedAt };
    } else {
      throw new HttpException(`User not found`, HttpStatus.NOT_FOUND);
    }
  }

  remove(id: string) {
    const idIsValid = validate(id);

    if (!idIsValid) {
      throw new HttpException('Id is not uuid', HttpStatus.BAD_REQUEST);
    }

    const index = this.users.findIndex((user) => user.id === id);

    if (index !== -1) {
      throw new HttpException(
        this.users.splice(index, 1),
        HttpStatus.NO_CONTENT,
      );
    } else {
      throw new HttpException(`User not found`, HttpStatus.NOT_FOUND);
    }
  }
}
