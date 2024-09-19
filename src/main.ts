import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
    rawBody: true,
  });
  const config = new DocumentBuilder()
    .setTitle('City logistics')
    .setDescription('City logistics API documentaion')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,

      transformOptions: {
        enableImplicitConversion: true, // <- This line here
      },
    }),
  );
  app.enableCors({
    origin: [
      'https://mycitylogistics.ca',
      'http://mycitylogistics.ca',

      'https://mycitylogistics.com',
      'http://mycitylogistics.com',

      'https://admin.mycitylogistics.ca',
      'http://admin.mycitylogistics.ca',

      'https://admin.mycitylogistics.com',
      'http://admin.mycitylogistics.com',
      'http://localhost:5173',
    ],
    methods: 'GET,PUT,POST,DELETE,UPDATE,OPTIONS,PATCH',
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
