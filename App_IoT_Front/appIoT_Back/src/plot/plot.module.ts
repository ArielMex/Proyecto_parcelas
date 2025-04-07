import { Module } from "@nestjs/common";
import { PlotController } from "./plot.controller";
import { PlotService } from "./plot.service";
import { PrismaService } from "src/prisma/prisma.service";
import { PlotDataService } from "src/plot-data/plot-data.service";

@Module({
    controllers: [PlotController],
    providers: [PlotService, PlotDataService, PrismaService]
})
export class PlotModule {}