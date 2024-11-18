import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      forbidUnknownValues: true,
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('Lego Box API ')
    .setDescription('API for managing Lego boxes and pieces')
    .setVersion('1.0')
    .build();
  const swaggerCustomOptions = {
    swaggerUiEnabled: true,
    jsonDocumentUrl: '/api-json',
    yamlDocumentUrl: '/api-yaml',
  };

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, swaggerCustomOptions);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
