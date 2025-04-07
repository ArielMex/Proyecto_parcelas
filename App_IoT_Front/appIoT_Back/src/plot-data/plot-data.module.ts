import { Module } from "@nestjs/common";
import { PlotDataController } from "./plot-data.controller";
import { PlotDataService } from "./plot-data.service";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
    controllers: [PlotDataController],
    providers: [PlotDataService, PrismaService]
})
export class PlotDataModule {}