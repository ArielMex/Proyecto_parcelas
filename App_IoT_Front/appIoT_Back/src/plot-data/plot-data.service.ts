import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlotDataDto } from './dto/create-plot-data.dto';
import { UpdatePlotDataDto } from './dto/update-plot-data.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PlotDataService {
    constructor(private prisma: PrismaService) { }

    async createPlotData(data: CreatePlotDataDto) {
        return this.prisma.plotData.create({ data });
    }

    async getPlotDataById(id: number) {
        const plotData = await this.prisma.plotData.findUnique({ where: { id } });
        if (!plotData) {
            throw new NotFoundException('Datos de parcela no encontrados');
        }
        return plotData;
    }

    async getAllPlotData() {
        return this.prisma.plotData.findMany();
    }

    async getPlotDataByPlotId(plotId: number) {
        return this.prisma.plotData.findMany({ where: { plotId } });
    }

    async updatePlotData(id: number, data: UpdatePlotDataDto) {
        const plotData = await this.prisma.plotData.findUnique({ where: { id } });
        if (!plotData) {
            throw new NotFoundException('Datos de parcela no encontrados');
        }
        return this.prisma.plotData.update({ where: { id }, data });
    }

    async deletePlotData(id: number) {
        const plotData = await this.prisma.plotData.findUnique({ where: { id } });
        if (!plotData) {
            throw new NotFoundException('Datos de parcela no encontrados');
        }
        return this.prisma.plotData.delete({ where: { id } });
    }

    // ✅ Nuevo método para agrupar datos por hora
    async getPlotDataGroupedByHour() {
        return this.prisma.plotData.groupBy({
            by: ['recordedAt'],
            _avg: {
                temperature: true,
                humidity: true,
                rain: true,
                sunIntensity: true
            },
            orderBy: {
                recordedAt: 'asc'
            }
        });
    }
}
