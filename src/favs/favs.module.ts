import { Module } from '@nestjs/common';
import { FavsService } from './favs.service';
import { FavsController } from './favs.controller';
import { PrismaService } from 'src/store/prisma.service';

@Module({
  controllers: [FavsController],
  providers: [FavsService, PrismaService],
})
export class FavsModule {}
