import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreatePlotDto } from "./dto/create-plot.dto";
import { UpdatePlotDto } from "./dto/update-plot.dto";
import { ExternalPlotDto } from "./dto/external-plot.dto";
import { PlotDataService } from "src/plot-data/plot-data.service";
import { Cron } from "@nestjs/schedule";


@Injectable()
export class PlotService {
  private readonly logger = new Logger(PlotService.name);

  constructor(
    private prisma: PrismaService,
    private plotDataService: PlotDataService,
  ) { }

  async fetchExternalPlots(): Promise<{ parcelas: ExternalPlotDto[], sensores: any }> {
    try {
      const response = await fetch('https://moriahmkt.com/iotapp/updated/');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      this.logger.log(`API respondió con ${data.parcelas?.length || 0} parcelas`);
      return {
        parcelas: Array.isArray(data.parcelas) ? data.parcelas : [],
        sensores: data.sensores || null
      };
    } catch (error) {
      this.logger.error('Error obteniendo parcelas', error);
      throw new Error('Error al obtener las parcelas');
    }
  }

  async saveGeneralSensorData(sensorData: any) {
    if (!sensorData) return;

    return this.prisma.generalSensorData.create({
      data: {
        humidity: sensorData.humedad,
        temperature: sensorData.temperatura,
        rain: sensorData.lluvia,
        sunIntensity: sensorData.sol
      }
    });
  }

  async syncWithApi() {
    try {
      this.logger.log('Iniciando sincronización con API externa...');
      const { parcelas: externalPlots, sensores: generalSensors } = await this.fetchExternalPlots();
      const externalIds = externalPlots.map(p => Number(p.id));

      // Guardar datos generales de sensores
      await this.saveGeneralSensorData(generalSensors);

      for (const externalPlot of externalPlots) {
        const plot = await this.prisma.plot.upsert({
          where: { externalId: Number(externalPlot.id) },
          update: {
            name: externalPlot.nombre,
            location: externalPlot.ubicacion,
            owner: externalPlot.responsable,
            plotType: externalPlot.tipo_cultivo,
            lastWatered: new Date(externalPlot.ultimo_riego),
            latitude: externalPlot.latitud,
            longitude: externalPlot.longitud,
            isActive: true,
            deletedAt: null,
          },
          create: {
            externalId: Number(externalPlot.id),
            name: externalPlot.nombre,
            location: externalPlot.ubicacion,
            owner: externalPlot.responsable,
            plotType: externalPlot.tipo_cultivo,
            lastWatered: new Date(externalPlot.ultimo_riego),
            latitude: externalPlot.latitud,
            longitude: externalPlot.longitud,
            isActive: true,
          },
        });

        await this.plotDataService.createPlotData({
          temperature: externalPlot.sensor.temperatura,
          humidity: externalPlot.sensor.humedad,
          rain: externalPlot.sensor.lluvia,
          sunIntensity: externalPlot.sensor.sol,
          recordedAt: new Date(),
          plotId: plot.id,
        });
      }

      const updateResult = await this.prisma.plot.updateMany({
        where: {
          externalId: { notIn: externalIds.length ? externalIds : [-1] },
          isActive: true
        },
        data: {
          isActive: false,
          deletedAt: new Date()
        },
      });

      this.logger.log(`Sincronización completada. Parcelas activas: ${externalPlots.length}`);

    } catch (error) {
      this.logger.error('Error en syncWithApi', error.stack);
      throw new Error('Error durante la sincronización');
    }
  }

  @Cron('*/60 * * * * *')
  async handleCron() {
    this.logger.log('Iniciando sincronización con API updated...');
    try {
      await this.syncWithApi();
      this.logger.log('Sincronización completada');
    } catch (error) {
      this.logger.error('Error en sincronización programada', error.stack);
    }
  }

  async createPlot(data: CreatePlotDto) {
    return this.prisma.plot.create({
      data: {
        ...data,
        externalId: Number(data.externalId),
        lastWatered: new Date(data.lastWatered),
      },
    });
  }

  async getPlotById(id: number) {
    const plot = await this.prisma.plot.findUnique({ where: { id } });
    if (!plot) {
      throw new NotFoundException('Parcela no encontrada');
    }
    return plot;
  }

  async getAllPlots() {
    return this.prisma.plot.findMany();
  }

  async updatePlot(id: number, data: UpdatePlotDto) {
    const plot = await this.prisma.plot.findUnique({ where: { id } });
    if (!plot) {
      throw new NotFoundException('Parcela no encontrada');
    }
    return this.prisma.plot.update({
      where: { id },
      data: {
        ...data,
        externalId: data.externalId ? Number(data.externalId) : undefined
      }
    });
  }

  async deletePlot(id: number) {
    const plot = await this.prisma.plot.findUnique({ where: { id } });
    if (!plot) {
      throw new NotFoundException('Parcela no encontrada');
    }
    return this.prisma.plot.update({
      where: { id },
      data: { isActive: false, deletedAt: new Date() },
    });
  }
}

function handleCron() {
  throw new Error("Function not implemented.");
}