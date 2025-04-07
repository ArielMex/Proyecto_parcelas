import { Controller, Get, Query } from '@nestjs/common';
import { SensorDataService } from './sensor.service';
import { SensorDataDto, SensorDataFilterDto } from './dto/sensor.dto';

@Controller('sensor-data')
export class SensorDataController {
  constructor(private readonly sensorDataService: SensorDataService) {}

  @Get('latest')
  async getLatest(): Promise<SensorDataDto> {
    return this.sensorDataService.getLatestSensorData();
  }

  @Get('history')
  async getHistory(@Query() filter: SensorDataFilterDto): Promise<SensorDataDto[]> {
    return this.sensorDataService.getSensorDataHistory(filter);
  }
}