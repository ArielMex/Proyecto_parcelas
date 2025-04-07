import { WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Server } from "socket.io";
import { Injectable } from "@nestjs/common";

@WebSocketGateway({ cors: true })
@Injectable()
export class PlotDataGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  // Emitir datos actualizados cuando cambie la base de datos
  emitUpdate(data: any) {
    this.server.emit("updatePlotData", data);
  }

  afterInit() {
    console.log("✅ WebSocket iniciado");
  }

  handleConnection() {
    console.log("📡 Cliente conectado");
  }

  handleDisconnect() {
    console.log("❌ Cliente desconectado");
  }

  emitPlotDataUpdate() {
    this.server.emit('plotDataUpdated'); // 🔥 Emite el evento cuando hay cambios
  }
}
