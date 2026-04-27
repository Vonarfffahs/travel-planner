import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const SWAGGER_BEARER_NAME = 'userAuth';

export const setupSwagger = (app: INestApplication): void => {
  const config = new DocumentBuilder()
    .setTitle('Travel Planner API')
    .setDescription('Travel planner with ACO and Greedy algorithms')
    .setVersion('1.0')
    .addTag('Algorithms', 'Endpoints for algorithms management')
    .addTag('Users', 'Operations with users for admins')
    .addTag('Trips', 'Trip creation and calculation')
    .addTag('HistoricPlaces', 'Places management')
    .addTag('Auth', 'Authorization')
    .addTag('Profile', 'Operations with users for regular users')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      SWAGGER_BEARER_NAME,
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
};
