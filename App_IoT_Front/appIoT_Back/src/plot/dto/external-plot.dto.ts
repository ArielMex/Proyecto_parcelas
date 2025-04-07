import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDate } from 'class-validator';

export class ExternalPlotDto {
  @ApiProperty({ example: '1', description: 'ID en el sistema externo' })
  @IsString()
  id: string;

  @ApiProperty({ example: 'Parcela 1', description: 'Nombre' })
  @IsString()
  nombre: string;

  @ApiProperty({ example: 'Zona norte', description: 'Ubicación' })
  @IsString()
  ubicacion: string;

  @ApiProperty({ example: 'Sebastian Mollinedo', description: 'Dueño' })
  @IsString()
  responsable: string;

  @ApiProperty({ example: 'Trigo', description: 'Tipo de cultivo' })
  @IsString()
  tipo_cultivo: string;

  @ApiProperty({ example: '2025-03-20T10:00:00Z', description: 'Último riego' })
  @IsDate()
  ultimo_riego: Date;

  @ApiProperty({ example: 25.6714, description: 'Latitud' })
  @IsNumber()
  latitud: number;

  @ApiProperty({ example: -100.309, description: 'Longitud' })
  @IsNumber()
  longitud: number;
  sensor: any;
}