import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuración CORS mejorada
  app.enableCors({
    origin:  "http://localhost:5174", // Tu URL de frontend
    methods: ['GET','PUT','PATCH','POST','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    
    // Manejar solicitudes OPTIONS (preflight)
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }

    next();
});

  // Configuración Swagger
  const config = new DocumentBuilder()
    .setTitle('API app IoT')
    .setDescription('Documentación de la API para el sistema de monitoreo agrícola')
    .setVersion('1.0')
    .addTag('users')
    .addTag('plots')
    .addTag('plot-data')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3003);
}
bootstrap();