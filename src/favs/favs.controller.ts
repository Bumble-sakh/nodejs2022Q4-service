import { Controller, Get, Post, Param, Delete } from '@nestjs/common';
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
    return this.favsService.addTrack(id);
  }

  @Delete('track/:id')
  removeTrack(@Param('id') id: string) {
    return this.favsService.removeTrack(id);
  }

  @Post('album/:id')
  addAlbum(@Param('id') id: string) {
    return this.favsService.addAlbum(id);
  }

  @Delete('album/:id')
  removeAlbum(@Param('id') id: string) {
    return this.favsService.removeAlbum(id);
  }

  @Post('artist/:id')
  addArtist(@Param('id') id: string) {
    return this.favsService.addArtist(id);
  }

  @Delete('artist/:id')
  removeArtist(@Param('id') id: string) {
    return this.favsService.removeArtist(id);
  }
}
