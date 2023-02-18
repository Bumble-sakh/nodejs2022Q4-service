import { Injectable } from '@nestjs/common';

import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { validate } from 'uuid';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { PrismaService } from 'src/store/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ArtistService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.ArtistCreateInput): Promise<Artist> {
    if (!('name' in data) || !('grammy' in data)) {
      throw new HttpException(
        'Request does not contain required fields',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (typeof data.name !== 'string' || typeof data.grammy !== 'boolean') {
      throw new HttpException(
        'Request does not contain required fields',
        HttpStatus.BAD_REQUEST,
      );
    }

    // const id = uuid();
    // const { name, grammy } = createArtistDto;
    // const artist = { id, name, grammy };

    // this.artists.push(artist);

    // return artist;
    const artist = await this.prisma.artist.create({ data });
    return artist;
  }

  async findAll() {
    const artists = await this.prisma.artist.findMany({});
    // return artists.map((artist) => this.userAdapter(user));
    return artists;
  }

  async findOne(where: Prisma.ArtistWhereUniqueInput): Promise<Artist | null> {
    const { id } = where;

    const idIsValid = validate(id);

    if (!idIsValid) {
      throw new HttpException('Id is not uuid', HttpStatus.BAD_REQUEST);
    }

    const artist = await this.prisma.artist.findUnique({
      where,
    });

    if (artist) {
      return artist;
    } else {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }
  }

  async update(params: {
    where: Prisma.ArtistWhereUniqueInput;
    data: UpdateArtistDto;
  }): Promise<Artist> {
    const { where, data } = params;
    const { id } = where;

    const idIsValid = validate(id);

    if (!idIsValid) {
      throw new HttpException('Id is not uuid', HttpStatus.BAD_REQUEST);
    }

    if (!('name' in data) || !('grammy' in data)) {
      throw new HttpException(
        'Request does not contain required fields',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (typeof data.name !== 'string' || typeof data.grammy !== 'boolean') {
      throw new HttpException(
        'Request does not contain required fields',
        HttpStatus.BAD_REQUEST,
      );
    }

    const updatedArtist = await this.findOne({ id });

    if (updatedArtist) {
      const artist = await this.prisma.artist.update({
        data,
        where,
      });

      return artist;
    } else {
      throw new HttpException(`Artist not found`, HttpStatus.NOT_FOUND);
    }
  }

  async remove(where: Prisma.ArtistWhereUniqueInput): Promise<Artist> {
    const { id } = where;

    const idIsValid = validate(id);

    if (!idIsValid) {
      throw new HttpException('Id is not uuid', HttpStatus.BAD_REQUEST);
    }

    try {
      await this.prisma.artist.delete({ where });
      //TODO Удалить из треков, альбомов, избранного

      return;
    } catch (error) {
      throw new HttpException(`Artist not found`, HttpStatus.NOT_FOUND);
    }
  }
}
