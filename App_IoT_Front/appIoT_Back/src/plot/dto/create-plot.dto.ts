import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsOptional, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlotDto {
    @ApiProperty({ example: '12345', description: 'ID único de la parcela en el sistema externo' })
    @IsString()
    @IsNotEmpty()
    @IsString()
    externalId: string;

    @ApiProperty({ example: 'Parcela 1', description: 'Nombre de la parcela' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'Ciudad de México', description: 'Ubicación de la parcela' })
    @IsString()
    @IsNotEmpty()
    location: string;

    @ApiProperty({ example: 'Juan Perez', description: 'Dueño de la parcela' })
    @IsString()
    @IsNotEmpty()
    owner: string;

    @ApiProperty({ example: 'Maíz', description: 'Tipo de cultivo de la parcela' })
    @IsString()
    @IsNotEmpty()
    plotType: string;

    @ApiProperty({ example: '2025-03-18T06:31:31Z', description: 'Fecha de la última vez que se regó la parcela' })
    @IsDate()
    @IsNotEmpty()
    lastWatered: Date;

    @ApiProperty({ example: 19.4326, description: 'Latitud de la parcela' })
    @IsNumber()
    @IsNotEmpty()
    latitude: number;

    @ApiProperty({ example: -99.1332, description: 'Longitud de la parcela' })
    @IsNumber()
    @IsNotEmpty()
    longitude: number;

    @ApiProperty({ example: true, description: 'Estado activo de la parcela', required: false })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}