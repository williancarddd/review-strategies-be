import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ZodFilter } from './commons/filters/zod.exception.filter';
import { patchNestJsSwagger } from 'nestjs-zod'
import { PrismaExceptionFilters } from './commons/filters/prisma.exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new ZodFilter());
  app.useGlobalFilters(new PrismaExceptionFilters());
  app.enableCors({
    origin: 'https://reviewstrategies.com.br',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  
  patchNestJsSwagger();
  const config = new DocumentBuilder()
    .setTitle('REVIEW STRATEGIES')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('getting-started', app, document);

  await app.listen(process.env.PORT as string);
}
bootstrap();