import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SensorDataController } from './sensor.controller';
import { SensorDataService } from './sensor.service';

@Module({
  controllers: [SensorDataController],
  providers: [SensorDataService, PrismaService],
})
export class SensorDataModule {}