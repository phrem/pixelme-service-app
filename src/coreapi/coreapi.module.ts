import { Module } from '@nestjs/common';
import { CoreapiService } from './coreapi.service';
import { CoreapiController } from './coreapi.controller';
import { PrismaService } from '../prisma.service';
@Module({
  controllers: [CoreapiController],
  providers: [CoreapiService, PrismaService],
})
export class CoreapiModule {}
