import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { store } from '../store/store';
import { Album } from './entities/album.entity';
import { v4 as uuid, validate } from 'uuid';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { Track } from 'src/track/entities/track.entity';

@Injectable()
export class AlbumService {
  albums: Album[];
  tracks: Track[];

  constructor() {
    this.albums = store.albums;
    this.tracks = store.tracks;
  }

  create(createAlbumDto: CreateAlbumDto) {
    if (
      !('name' in createAlbumDto) ||
      !('year' in createAlbumDto) ||
      !('artistId' in createAlbumDto)
    ) {
      throw new HttpException(
        'Request does not contain required fields',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      typeof createAlbumDto.name !== 'string' ||
      typeof createAlbumDto.year !== 'number' ||
      (typeof createAlbumDto.artistId !== 'string' &&
        createAlbumDto.artistId !== null)
    ) {
      throw new HttpException(
        'Request does not contain required fields',
        HttpStatus.BAD_REQUEST,
      );
    }

    const id = uuid();
    const { name, year, artistId } = createAlbumDto;
    const album = { id, name, year, artistId };

    this.albums.push(album);

    return album;
  }

  findAll() {
    return this.albums;
  }

  findOne(id: string) {
    const idIsValid = validate(id);

    if (!idIsValid) {
      throw new HttpException('Id is not uuid', HttpStatus.BAD_REQUEST);
    }

    const album = this.albums.find((album) => album.id === id);

    if (album) {
      return album;
    }

    throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const idIsValid = validate(id);

    if (!idIsValid) {
      throw new HttpException('Id is not uuid', HttpStatus.BAD_REQUEST);
    }

    if (
      !('name' in updateAlbumDto) ||
      !('year' in updateAlbumDto) ||
      !('artistId' in updateAlbumDto)
    ) {
      throw new HttpException(
        'Request does not contain required fields',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      typeof updateAlbumDto.name !== 'string' ||
      typeof updateAlbumDto.year !== 'number' ||
      (typeof updateAlbumDto.artistId !== 'string' &&
        updateAlbumDto.artistId !== null)
    ) {
      throw new HttpException(
        'Request does not contain required fields',
        HttpStatus.BAD_REQUEST,
      );
    }

    const index = this.albums.findIndex((album) => album.id === id);
    const album = this.albums[index];

    if (album) {
      const { name, year, artistId } = updateAlbumDto;

      Object.assign(album, { name, year, artistId });

      this.albums.splice(index, 1, album);

      return album;
    } else {
      throw new HttpException(`Album not found`, HttpStatus.NOT_FOUND);
    }
  }

  remove(id: string) {
    const idIsValid = validate(id);

    if (!idIsValid) {
      throw new HttpException('Id is not uuid', HttpStatus.BAD_REQUEST);
    }

    const index = this.albums.findIndex((album) => album.id === id);

    if (index !== -1) {
      this.tracks.forEach((track) => {
        if (track.albumId === id) {
          track.albumId = null;
        }
      });

      throw new HttpException(
        this.albums.splice(index, 1),
        HttpStatus.NO_CONTENT,
      );
    } else {
      throw new HttpException(`Album not found`, HttpStatus.NOT_FOUND);
    }
  }
}
