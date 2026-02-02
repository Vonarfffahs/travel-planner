import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      whitelist: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Travel Planner API')
    .setDescription('Travel planner with ACO and Greedy algorithms')
    .setVersion('1.0')
    .addTag('Algorithms', 'Endpoints for algorithms management')
    .addTag('Users', 'Operations with users')
    .addTag('Trips', 'Trip creation and calculation')
    .addTag('HistoricPlaces', 'Places management')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
