import { Injectable } from '@nestjs/common';
// import { Album } from 'src/album/entities/album.entity';
// import { Artist } from 'src/artist/entities/artist.entity';
// import { Track } from 'src/track/entities/track.entity';
// import { store } from '../store/store';
// import { Fav } from './entities/fav.entity';
import { validate } from 'uuid';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { PrismaService } from 'src/store/prisma.service';
import { Group, Prisma } from '@prisma/client';

@Injectable()
export class FavsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const favoriteArtists = await this.prisma.favorite.findMany({
      select: { itemId: true },
      where: { group: Group.artist },
    });

    const favoriteAlbums = await this.prisma.favorite.findMany({
      select: { itemId: true },
      where: { group: Group.album },
    });

    const favoriteTracks = await this.prisma.favorite.findMany({
      select: { itemId: true },
      where: { group: Group.track },
    });

    const artists = [];
    const albums = [];
    const tracks = [];

    for await (const item of favoriteArtists) {
      const { itemId } = item;

      const artist = await this.prisma.artist.findUnique({
        where: { id: itemId },
      });

      if (artist) {
        artists.push(artist);
      }
    }

    for await (const item of favoriteAlbums) {
      const { itemId } = item;

      const album = await this.prisma.album.findUnique({
        where: { id: itemId },
      });

      if (album) {
        albums.push(album);
      }
    }

    for await (const item of favoriteTracks) {
      const { itemId } = item;

      const track = await this.prisma.track.findUnique({
        where: { id: itemId },
      });

      if (track) {
        tracks.push(track);
      }
    }

    const favorites = {
      artists,
      albums,
      tracks,
    };

    return favorites;
  }

  async addTrack(data: Prisma.FavoriteCreateInput) {
    const { itemId } = data;

    const idIsValid = validate(itemId);

    if (!idIsValid) {
      throw new HttpException('Id is not uuid', HttpStatus.BAD_REQUEST);
    }

    const track = await this.prisma.track.findUnique({ where: { id: itemId } });

    if (track) {
      const favorite = await this.prisma.favorite.create({ data });

      return favorite;
    } else {
      throw new HttpException(
        `Track doesn't exist`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async addAlbum(data: Prisma.FavoriteCreateInput) {
    const { itemId } = data;

    const idIsValid = validate(itemId);

    if (!idIsValid) {
      throw new HttpException('Id is not uuid', HttpStatus.BAD_REQUEST);
    }

    const album = await this.prisma.album.findUnique({ where: { id: itemId } });

    if (album) {
      const favorite = await this.prisma.favorite.create({ data });

      return favorite;
    } else {
      throw new HttpException(
        `Album doesn't exist`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async addArtist(data: Prisma.FavoriteCreateInput) {
    const { itemId } = data;

    const idIsValid = validate(itemId);

    if (!idIsValid) {
      throw new HttpException('Id is not uuid', HttpStatus.BAD_REQUEST);
    }

    const artist = await this.prisma.artist.findUnique({
      where: { id: itemId },
    });

    if (artist) {
      const favorite = await this.prisma.favorite.create({ data });

      return favorite;
    } else {
      throw new HttpException(
        `Artist doesn't exist`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async remove(where: Prisma.FavoriteWhereUniqueInput) {
    const { itemId } = where;

    const idIsValid = validate(itemId);

    if (!idIsValid) {
      throw new HttpException('Id is not uuid', HttpStatus.BAD_REQUEST);
    }

    try {
      await this.prisma.favorite.delete({ where: { itemId } });

      return;
    } catch (error) {
      throw new HttpException(`Album not found`, HttpStatus.NOT_FOUND);
    }
  }
}
