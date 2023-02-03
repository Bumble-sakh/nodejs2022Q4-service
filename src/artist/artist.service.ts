import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { store } from '../store/store';
import { Artist } from './entities/artist.entity';
import { v4 as uuid, validate } from 'uuid';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';

@Injectable()
export class ArtistService {
  artists: Artist[];

  constructor() {
    this.artists = store.artists;
  }

  create(createArtistDto: CreateArtistDto) {
    if (!('name' in createArtistDto) || !('grammy' in createArtistDto)) {
      throw new HttpException(
        'Request does not contain required fields',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      typeof createArtistDto.name !== 'string' ||
      typeof createArtistDto.grammy !== 'boolean'
    ) {
      throw new HttpException(
        'Request does not contain required fields',
        HttpStatus.BAD_REQUEST,
      );
    }

    const id = uuid();
    const { name, grammy } = createArtistDto;
    const artist = { id, name, grammy };

    this.artists.push(artist);

    return artist;
  }

  findAll() {
    return this.artists;
  }

  findOne(id: string) {
    const idIsValid = validate(id);

    if (!idIsValid) {
      throw new HttpException('Id is not uuid', HttpStatus.BAD_REQUEST);
    }

    const artist = this.artists.find((artist) => artist.id === id);

    if (artist) {
      return artist;
    }

    throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    const idIsValid = validate(id);

    if (!idIsValid) {
      throw new HttpException('Id is not uuid', HttpStatus.BAD_REQUEST);
    }

    if (!('name' in updateArtistDto) || !('grammy' in updateArtistDto)) {
      throw new HttpException(
        'Request does not contain required fields',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      typeof updateArtistDto.name !== 'string' ||
      typeof updateArtistDto.grammy !== 'boolean'
    ) {
      throw new HttpException(
        'Request does not contain required fields',
        HttpStatus.BAD_REQUEST,
      );
    }

    const index = this.artists.findIndex((artist) => artist.id === id);
    const artist = this.artists[index];

    if (artist) {
      const { name, grammy } = updateArtistDto;

      Object.assign(artist, { name, grammy });

      this.artists.splice(index, 1, artist);

      return artist;
    } else {
      throw new HttpException(`Artist not found`, HttpStatus.NOT_FOUND);
    }
  }

  remove(id: string) {
    const idIsValid = validate(id);

    if (!idIsValid) {
      throw new HttpException('Id is not uuid', HttpStatus.BAD_REQUEST);
    }

    const index = this.artists.findIndex((artist) => artist.id === id);

    if (index !== -1) {
      //TODO should set track.artistId to null after deletion

      throw new HttpException(
        this.artists.splice(index, 1),
        HttpStatus.NO_CONTENT,
      );
    } else {
      throw new HttpException(`Artist not found`, HttpStatus.NOT_FOUND);
    }
  }
}
