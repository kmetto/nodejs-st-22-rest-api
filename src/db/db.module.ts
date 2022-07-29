import { Module } from '@nestjs/common';
import { Global } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { DbUsers } from './services/db-users.service';

@Global()
@Module({
  providers: [PrismaService, DbUsers],
  exports: [DbUsers],
})
export class DbModule {}
