import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { PlotDataService } from './plot-data.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreatePlotDataDto } from './dto/create-plot-data.dto';
import { UpdatePlotDataDto } from './dto/update-plot-data.dto';

@ApiTags('plot-data')
@Controller('plot-data')
export class PlotDataController {
    constructor(private readonly plotDataService: PlotDataService) { }

    @Post()
    @ApiOperation({ summary: 'Crear datos de parcela' })
    @ApiBody({ type: CreatePlotDataDto })
    @ApiResponse({ status: 201, description: 'Datos de parcela creados correctamente' })
    @ApiResponse({ status: 400, description: 'Datos inválidos' })
    async createPlotData(@Body() data: CreatePlotDataDto) {
        return this.plotDataService.createPlotData(data);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener datos de parcela por ID' })
    @ApiParam({ name: 'id', description: 'ID de los datos de parcela', type: Number })
    @ApiResponse({ status: 200, description: 'Datos de parcela encontrados' })
    @ApiResponse({ status: 404, description: 'Datos de parcela no encontrados' })
    async getPlotDataById(@Param('id') id: string) {
        return this.plotDataService.getPlotDataById(Number(id));
    }

    @Get('plot/:plotId')
    @ApiOperation({ summary: 'Obtener todos los datos de una parcela específica' })
    @ApiParam({ name: 'plotId', description: 'ID de la parcela', type: Number })
    @ApiResponse({ status: 200, description: 'Lista de datos de parcela' })
    async getPlotDataByPlotId(@Param('plotId') plotId: string) {
        return this.plotDataService.getPlotDataByPlotId(Number(plotId));
    }

    @Get()
    @ApiOperation({ summary: 'Obtener todos los datos de parcelas' })
    @ApiResponse({ status: 200, description: 'Lista de datos' })
    async getAllPlotData() {
        return this.plotDataService.getAllPlotData();
    }

    @Put(':id')
    @ApiOperation({ summary: 'Actualizar datos de parcela' })
    @ApiParam({ name: 'id', description: 'ID de los datos de parcela', type: Number })
    @ApiBody({ type: UpdatePlotDataDto })
    @ApiResponse({ status: 200, description: 'Datos de parcela actualizados' })
    @ApiResponse({ status: 404, description: 'Datos de parcela no encontrados' })
    async updatePlotData(@Param('id') id: string, @Body() data: UpdatePlotDataDto) {
        return this.plotDataService.updatePlotData(Number(id), data);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar datos de parcela' })
    @ApiParam({ name: 'id', description: 'ID de los datos de parcela', type: Number })
    @ApiResponse({ status: 200, description: 'Datos de parcela eliminados' })
    @ApiResponse({ status: 404, description: 'Datos de parcela no encontrados' })
    async deletePlotData(@Param('id') id: string) {
        return this.plotDataService.deletePlotData(Number(id));
    }

    // ✅ Nuevo endpoint para obtener datos agrupados por hora
    @Get('grouped/hourly')
    @ApiOperation({ summary: 'Obtener datos de parcela agrupados por hora' })
    @ApiResponse({ status: 200, description: 'Lista de datos agrupados por hora' })
    async getPlotDataGroupedByHour() {
        return this.plotDataService.getPlotDataGroupedByHour();
    }
}
