import { Controller, Post, Body, Get, Param, Put, Delete, BadRequestException } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from "@nestjs/swagger";
import { PlotService } from "./plot.service";
import { CreatePlotDto } from "./dto/create-plot.dto";
import { UpdatePlotDto } from "./dto/update-plot.dto";

@ApiTags('plots')
@Controller('plots')
export class PlotController {
    constructor(private readonly plotService: PlotService) { }

    @Post('sync')
    @ApiOperation({ summary: 'Sincronizar parcelas con API externa' })
    @ApiResponse({ status: 200, description: 'Sincronizacion completada' })
    async syncWithApi() {
        return this.plotService.syncWithApi();
    }

    @Post()
    @ApiOperation({ summary: 'Crear una parcela' })
    @ApiBody({ type: CreatePlotDto })
    @ApiResponse({ status: 201, description: 'Parcela creada correctamente' })
    @ApiResponse({ status: 400, description: 'Datos inválidos' })
    async createPlot(@Body() data: CreatePlotDto) {
        return this.plotService.createPlot(data);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener una parcela por ID' })
    @ApiParam({ name: 'id', description: 'ID de la parcela', type: Number })
    @ApiResponse({ status: 200, description: 'Parcela encontrada' })
    @ApiResponse({ status: 404, description: 'Parcela no encontrada' })
    async getPlotById(@Param('id') id: string) {
        return this.plotService.getPlotById(Number(id));
    }

    @Get()
    @ApiOperation({ summary: 'Obtener todas las parcelas' })
    @ApiResponse({ status: 200, description: 'Lista de parcelas' })
    async getAllPlots() {
        return this.plotService.getAllPlots();
    }

    @Put(':id')
    @ApiOperation({ summary: 'Actualizar una parcela' })
    @ApiParam({ name: 'id', description: 'ID de la parcela', type: Number })
    @ApiBody({ type: UpdatePlotDto })
    @ApiResponse({ status: 200, description: 'Parcela actualizada' })
    @ApiResponse({ status: 404, description: 'Parcela no encontrada' })
    async updatePlot(@Param('id') id: string, @Body() data: UpdatePlotDto) {
        return this.plotService.updatePlot(Number(id), data);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar una parcela' })
    @ApiParam({ name: 'id', description: 'ID de la parcela', type: Number })
    @ApiResponse({ status: 200, description: 'Parcela eliminada' })
    @ApiResponse({ status: 404, description: 'Parcela no encontrada' })
    async deletePlot(@Param('id') id: string) {
        return this.plotService.deletePlot(Number(id));
    }
}