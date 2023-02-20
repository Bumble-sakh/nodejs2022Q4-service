import { Controller, Get, Post, Param, Delete, HttpCode } from '@nestjs/common';
import { Group } from '@prisma/client';
import { FavsService } from './favs.service';

@Controller('favs')
export class FavsController {
  constructor(private readonly favsService: FavsService) {}

  @Get()
  findAll() {
    return this.favsService.findAll();
  }

  @Post('track/:id')
  addTrack(@Param('id') id: string) {
    const data = {
      group: Group.track,
      itemId: id,
    };

    return this.favsService.addTrack(data);
  }

  @Post('album/:id')
  addAlbum(@Param('id') id: string) {
    const data = {
      group: Group.album,
      itemId: id,
    };

    return this.favsService.addAlbum(data);
  }

  @Post('artist/:id')
  addArtist(@Param('id') id: string) {
    const data = {
      group: Group.artist,
      itemId: id,
    };

    return this.favsService.addArtist(data);
  }

  @Delete('track/:id')
  @HttpCode(204)
  removeTrack(@Param('id') id: string) {
    return this.favsService.remove({ itemId: id });
  }

  @Delete('album/:id')
  @HttpCode(204)
  removeAlbum(@Param('id') id: string) {
    return this.favsService.remove({ itemId: id });
  }

  @Delete('artist/:id')
  @HttpCode(204)
  removeArtist(@Param('id') id: string) {
    return this.favsService.remove({ itemId: id });
  }
}
