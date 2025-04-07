import { IsString, IsNumber, IsBoolean, IsOptional, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePlotDto {
  @IsString()
  externalId: string;
  
  @ApiProperty({ example: 'Parcela 1 Actualizada', description: 'Nombre de la parcela', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Ciudad de México', description: 'Ubicación de la parcela', required: false })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ example: 'Juan Perez', description: 'Dueño de la parcela', required: false })
  @IsString()
  @IsOptional()
  owner?: string;

  @ApiProperty({ example: 'Maíz', description: 'Tipo de cultivo de la parcela', required: false })
  @IsString()
  @IsOptional()
  plotType?: string;

  @ApiProperty({ example: '2025-03-18 06:31:31', description: 'Fecha de la última vez que se regó la parcela' })
  @IsDate()
  @IsOptional()
  lastWatered?: Date;

  @ApiProperty({ example: 19.4326, description: 'Latitud de la parcela', required: false })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiProperty({ example: -99.1332, description: 'Longitud de la parcela', required: false })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiProperty({ example: true, description: 'Estado activo de la parcela', required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}