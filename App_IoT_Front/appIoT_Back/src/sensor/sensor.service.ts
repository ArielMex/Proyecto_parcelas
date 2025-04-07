import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SensorDataDto, SensorDataFilterDto } from './dto/sensor.dto';


@Injectable()
export class SensorDataService {
    constructor(private prisma: PrismaService) { }

    async getLatestSensorData(): Promise<SensorDataDto> {
        const data = await this.prisma.generalSensorData.findFirst({
            orderBy: { recordedAt: 'desc' },
        });
        if (!data) {
            throw new Error('No sensor data found');
        }
        return data;
    }

    async getSensorDataHistory(filter: SensorDataFilterDto): Promise<SensorDataDto[]> {
        return this.prisma.generalSensorData.findMany({
            where: {
                recordedAt: {
                    gte: filter.from,
                    lte: filter.to,
                },
            },
            orderBy: { recordedAt: 'desc' },
            take: 10,
        });
    }
}