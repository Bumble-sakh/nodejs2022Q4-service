import { Injectable } from '@nestjs/common';
import { Album } from 'src/album/entities/album.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import { Track } from 'src/track/entities/track.entity';
import { store } from '../store/store';
import { Fav } from './entities/fav.entity';
import { validate } from 'uuid';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';

@Injectable()
export class FavsService {
  favorites: Fav;
  artists: Artist[];
  albums: Album[];
  tracks: Track[];

  constructor() {
    this.favorites = store.favorites;
    this.artists = store.artists;
    this.albums = store.albums;
    this.tracks = store.tracks;
  }

  findAll() {
    const artists = [];
    const albums = [];
    const tracks = [];
    const favorites = {
      artists,
      albums,
      tracks,
    };

    this.albums.forEach((album) => {
      if (this.favorites.albums.has(album.id)) {
        albums.push(album);
      }
    });

    this.artists.forEach((artist) => {
      if (this.favorites.artists.has(artist.id)) {
        artists.push(artist);
      }
    });

    this.tracks.forEach((track) => {
      if (this.favorites.tracks.has(track.id)) {
        tracks.push(track);
      }
    });

    return favorites;
  }

  addTrack(id: string) {
    const idIsValid = validate(id);

    if (!idIsValid) {
      throw new HttpException('Id is not uuid', HttpStatus.BAD_REQUEST);
    }

    const track = this.tracks.find((track) => track.id === id);

    if (track) {
      this.favorites.tracks.add(id);
      return track;
    } else {
      throw new HttpException(
        `Track doesn't exist`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  removeTrack(id: string) {
    const idIsValid = validate(id);

    if (!idIsValid) {
      throw new HttpException('Id is not uuid', HttpStatus.BAD_REQUEST);
    }

    const trackIsFavorite = this.favorites.tracks.has(id);
    const track = this.tracks.find((track) => track.id === id);

    if (trackIsFavorite) {
      this.favorites.tracks.delete(id);
      throw new HttpException(track, HttpStatus.NO_CONTENT);
    } else {
      throw new HttpException(`Track is not favorite`, HttpStatus.NOT_FOUND);
    }
  }

  addAlbum(id: string) {
    const idIsValid = validate(id);

    if (!idIsValid) {
      throw new HttpException('Id is not uuid', HttpStatus.BAD_REQUEST);
    }

    const album = this.albums.find((album) => album.id === id);

    if (album) {
      this.favorites.albums.add(id);
      return album;
    } else {
      throw new HttpException(
        `Album doesn't exist`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  removeAlbum(id: string) {
    const idIsValid = validate(id);

    if (!idIsValid) {
      throw new HttpException('Id is not uuid', HttpStatus.BAD_REQUEST);
    }

    const albumIsFavorite = this.favorites.albums.has(id);
    const album = this.albums.find((album) => album.id === id);

    if (albumIsFavorite) {
      this.favorites.albums.delete(id);
      throw new HttpException(album, HttpStatus.NO_CONTENT);
    } else {
      throw new HttpException(`Album is not favorite`, HttpStatus.NOT_FOUND);
    }
  }

  addArtist(id: string) {
    const idIsValid = validate(id);

    if (!idIsValid) {
      throw new HttpException('Id is not uuid', HttpStatus.BAD_REQUEST);
    }

    const artist = this.artists.find((artist) => artist.id === id);

    if (artist) {
      this.favorites.artists.add(id);
      return artist;
    } else {
      throw new HttpException(
        `Artist doesn't exist`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  removeArtist(id: string) {
    const idIsValid = validate(id);

    if (!idIsValid) {
      throw new HttpException('Id is not uuid', HttpStatus.BAD_REQUEST);
    }

    const artistIsFavorite = this.favorites.artists.has(id);
    const artist = this.artists.find((artist) => artist.id === id);

    if (artistIsFavorite) {
      this.favorites.artists.delete(id);
      throw new HttpException(artist, HttpStatus.NO_CONTENT);
    } else {
      throw new HttpException(`Artist is not favorite`, HttpStatus.NOT_FOUND);
    }
  }
}
