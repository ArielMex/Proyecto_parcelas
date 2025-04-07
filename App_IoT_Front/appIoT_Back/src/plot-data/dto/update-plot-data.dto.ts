import { IsDate, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePlotDataDto {
  @ApiProperty({ example: 26.0, description: 'Temperatura registrada', required: false })
  @IsNumber()
  @IsOptional()
  temperature?: number;

  @ApiProperty({ example: 65.0, description: 'Humedad registrada', required: false })
  @IsNumber()
  @IsOptional()
  humidity?: number;

  @ApiProperty({ example: 15.0, description: 'Lluvia registrada', required: false })
  @IsNumber()
  @IsOptional()
  rain?: number;

  @ApiProperty({ example: 550.0, description: 'Intensidad del sol registrada', required: false })
  @IsNumber()
  @IsOptional()
  sunIntensity?: number;

  @ApiProperty({ example: '2025-03-18 06:31:31', description: 'Fecha y hora de registro' })
  @IsDate()
  @IsOptional()
  recordedAt?: Date;
}