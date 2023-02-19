import { Injectable } from '@nestjs/common';
import { Track } from './entities/track.entity';
import { validate } from 'uuid';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { PrismaService } from 'src/store/prisma.service';
import { Prisma } from '@prisma/client';
import { UpdateTrackDto } from './dto/update-track.dto';
import { CreateTrackDto } from './dto/create-track.dto';

@Injectable()
export class TrackService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateTrackDto): Promise<Track> {
    if (
      !('name' in data) ||
      !('duration' in data) ||
      !('artistId' in data) ||
      !('albumId' in data)
    ) {
      throw new HttpException(
        'Request does not contain required fields',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      typeof data.name !== 'string' ||
      typeof data.duration !== 'number' ||
      (typeof data.artistId !== 'string' && data.artistId !== null) ||
      (typeof data.albumId !== 'string' && data.albumId !== null)
    ) {
      throw new HttpException(
        'Request does not contain required fields',
        HttpStatus.BAD_REQUEST,
      );
    }

    const track = await this.prisma.track.create({ data });
    return track;
  }

  async findAll() {
    const tracks = await this.prisma.track.findMany({});
    return tracks;
  }

  async findOne(where: Prisma.TrackWhereUniqueInput): Promise<Track | null> {
    const { id } = where;

    const idIsValid = validate(id);

    if (!idIsValid) {
      throw new HttpException('Id is not uuid', HttpStatus.BAD_REQUEST);
    }

    const track = await this.prisma.track.findUnique({
      where,
    });

    if (track) {
      return track;
    } else {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }
  }

  async update(params: {
    where: Prisma.TrackWhereUniqueInput;
    data: UpdateTrackDto;
  }): Promise<Track> {
    const { where, data } = params;
    const { id } = where;

    const idIsValid = validate(id);

    if (!idIsValid) {
      throw new HttpException('Id is not uuid', HttpStatus.BAD_REQUEST);
    }

    if (
      !('name' in data) ||
      !('duration' in data) ||
      !('artistId' in data) ||
      !('albumId' in data)
    ) {
      throw new HttpException(
        'Request does not contain required fields',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      typeof data.name !== 'string' ||
      typeof data.duration !== 'number' ||
      (typeof data.artistId !== 'string' && data.artistId !== null) ||
      (typeof data.albumId !== 'string' && data.albumId !== null)
    ) {
      throw new HttpException(
        'Request does not contain required fields',
        HttpStatus.BAD_REQUEST,
      );
    }

    const updatedTrack = await this.findOne({ id });

    if (updatedTrack) {
      const track = await this.prisma.track.update({
        data,
        where,
      });

      return track;
    } else {
      throw new HttpException(`Track not found`, HttpStatus.NOT_FOUND);
    }
  }

  async remove(where: Prisma.TrackWhereUniqueInput): Promise<Track> {
    const { id } = where;

    const idIsValid = validate(id);

    if (!idIsValid) {
      throw new HttpException('Id is not uuid', HttpStatus.BAD_REQUEST);
    }

    try {
      await this.prisma.track.delete({ where });

      return;
    } catch (error) {
      throw new HttpException(`Track not found`, HttpStatus.NOT_FOUND);
    }
  }
}
