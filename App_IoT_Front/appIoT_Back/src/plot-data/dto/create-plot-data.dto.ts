import { IsNumber, IsNotEmpty, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlotDataDto {
  @ApiProperty({ example: 25.5, description: 'Temperatura registrada' })
  @IsNumber()
  @IsNotEmpty()
  temperature: number;

  @ApiProperty({ example: 60.0, description: 'Humedad registrada' })
  @IsNumber()
  @IsNotEmpty()
  humidity: number;

  @ApiProperty({ example: 10.0, description: 'Lluvia registrada' })
  @IsNumber()
  @IsNotEmpty()
  rain: number;

  @ApiProperty({ example: 500.0, description: 'Intensidad del sol registrada' })
  @IsNumber()
  @IsNotEmpty()
  sunIntensity: number;

  @ApiProperty({ example: '2025-03-18T06:31:31Z', description: 'Fecha y hora de registro' })
  @IsDate()
  @IsNotEmpty()
  recordedAt: Date;

  @ApiProperty({ example: 1, description: 'ID de la parcela asociada' })
  @IsNumber()
  @IsNotEmpty()
  plotId: number;
}