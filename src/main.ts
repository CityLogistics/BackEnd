import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
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
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
