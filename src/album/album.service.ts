import { Injectable } from '@nestjs/common';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { validate } from 'uuid';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';

import { Prisma } from '@prisma/client';
import { Album } from './entities/album.entity';
import { PrismaService } from 'src/store/prisma.service';

@Injectable()
export class AlbumService {
  constructor(private prisma: PrismaService) {}

  async create(data: UpdateAlbumDto): Promise<Album> {
    if (!('name' in data) || !('year' in data) || !('artistId' in data)) {
      throw new HttpException(
        'Request does not contain required fields',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      typeof data.name !== 'string' ||
      typeof data.year !== 'number' ||
      (typeof data.artistId !== 'string' && data.artistId !== null)
    ) {
      throw new HttpException(
        'Request does not contain required fields',
        HttpStatus.BAD_REQUEST,
      );
    }

    const album = await this.prisma.album.create({ data });

    return album;
  }

  async findAll() {
    const albums = await this.prisma.album.findMany({});
    return albums;
  }

  async findOne(where: Prisma.AlbumWhereUniqueInput): Promise<Album | null> {
    const { id } = where;

    const idIsValid = validate(id);

    if (!idIsValid) {
      throw new HttpException('Id is not uuid', HttpStatus.BAD_REQUEST);
    }

    const album = await this.prisma.album.findUnique({
      where,
    });

    if (album) {
      return album;
    } else {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }
  }

  async update(params: {
    where: Prisma.AlbumWhereUniqueInput;
    data: UpdateAlbumDto;
  }): Promise<Album> {
    const { where, data } = params;
    const { id } = where;

    const idIsValid = validate(id);

    if (!idIsValid) {
      throw new HttpException('Id is not uuid', HttpStatus.BAD_REQUEST);
    }

    if (!('name' in data) || !('year' in data) || !('artistId' in data)) {
      throw new HttpException(
        'Request does not contain required fields',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      typeof data.name !== 'string' ||
      typeof data.year !== 'number' ||
      (typeof data.artistId !== 'string' && data.artistId !== null)
    ) {
      throw new HttpException(
        'Request does not contain required fields',
        HttpStatus.BAD_REQUEST,
      );
    }

    const updatedAlbum = await this.findOne({ id });

    if (updatedAlbum) {
      const album = await this.prisma.album.update({
        data,
        where,
      });

      return album;
    } else {
      throw new HttpException(`Album not found`, HttpStatus.NOT_FOUND);
    }
  }

  async remove(where: Prisma.AlbumWhereUniqueInput): Promise<Album> {
    const { id } = where;

    const idIsValid = validate(id);

    if (!idIsValid) {
      throw new HttpException('Id is not uuid', HttpStatus.BAD_REQUEST);
    }

    try {
      await this.prisma.album.delete({ where });
      //TODO Удалить из  альбомов, избранного

      return;
    } catch (error) {
      throw new HttpException(`Album not found`, HttpStatus.NOT_FOUND);
    }
  }
}
