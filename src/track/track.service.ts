import { Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { store } from '../store/store';
import { Track } from './entities/track.entity';
import { v4 as uuid, validate } from 'uuid';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { Fav } from 'src/favs/entities/fav.entity';

@Injectable()
export class TrackService {
  tracks: Track[];
  favorites: Fav;

  constructor() {
    this.tracks = store.tracks;
    this.favorites = store.favorites;
  }

  create(createTrackDto: CreateTrackDto) {
    if (
      !('name' in createTrackDto) ||
      !('duration' in createTrackDto) ||
      !('artistId' in createTrackDto) ||
      !('albumId' in createTrackDto)
    ) {
      throw new HttpException(
        'Request does not contain required fields',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      typeof createTrackDto.name !== 'string' ||
      typeof createTrackDto.duration !== 'number' ||
      (typeof createTrackDto.artistId !== 'string' &&
        createTrackDto.artistId !== null) ||
      (typeof createTrackDto.albumId !== 'string' &&
        createTrackDto.albumId !== null)
    ) {
      throw new HttpException(
        'Request does not contain required fields',
        HttpStatus.BAD_REQUEST,
      );
    }

    const id = uuid();
    const { name, artistId, albumId, duration } = createTrackDto;
    const track = { id, name, artistId, albumId, duration };

    this.tracks.push(track);

    return track;
  }

  findAll() {
    return this.tracks;
  }

  findOne(id: string) {
    const idIsValid = validate(id);

    if (!idIsValid) {
      throw new HttpException('Id is not uuid', HttpStatus.BAD_REQUEST);
    }

    const track = this.tracks.find((track) => track.id === id);

    if (track) {
      return track;
    }

    throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    const idIsValid = validate(id);

    if (!idIsValid) {
      throw new HttpException('Id is not uuid', HttpStatus.BAD_REQUEST);
    }

    if (
      !('name' in updateTrackDto) ||
      !('duration' in updateTrackDto) ||
      !('artistId' in updateTrackDto) ||
      !('albumId' in updateTrackDto)
    ) {
      throw new HttpException(
        'Request does not contain required fields',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      typeof updateTrackDto.name !== 'string' ||
      typeof updateTrackDto.duration !== 'number' ||
      (typeof updateTrackDto.artistId !== 'string' &&
        updateTrackDto.artistId !== null) ||
      (typeof updateTrackDto.albumId !== 'string' &&
        updateTrackDto.albumId !== null)
    ) {
      throw new HttpException(
        'Request does not contain required fields',
        HttpStatus.BAD_REQUEST,
      );
    }

    const index = this.tracks.findIndex((track) => track.id === id);
    const track = this.tracks[index];

    if (track) {
      const { name, artistId, albumId, duration } = updateTrackDto;

      Object.assign(track, { name, artistId, albumId, duration });

      this.tracks.splice(index, 1, track);

      return track;
    } else {
      throw new HttpException(`Track not found`, HttpStatus.NOT_FOUND);
    }
  }

  remove(id: string) {
    const idIsValid = validate(id);

    if (!idIsValid) {
      throw new HttpException('Id is not uuid', HttpStatus.BAD_REQUEST);
    }

    const index = this.tracks.findIndex((track) => track.id === id);

    if (index !== -1) {
      this.favorites.tracks.delete(id);

      throw new HttpException(
        this.tracks.splice(index, 1),
        HttpStatus.NO_CONTENT,
      );
    } else {
      throw new HttpException(`Track not found`, HttpStatus.NOT_FOUND);
    }
  }
}
