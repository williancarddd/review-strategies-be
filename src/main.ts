import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ZodFilter } from './commons/filters/zod.exception.filter';
import { patchNestJsSwagger } from 'nestjs-zod'
import { PrismaExceptionFilters } from './commons/filters/prisma.exception.filter';
import { json, urlencoded } from 'express';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalFilters(new ZodFilter());
  app.useGlobalFilters(new PrismaExceptionFilters());
  
  app.use(
    json({
      verify: (req: any, res, buf: Buffer, encoding: string) => {
        // Check if the request is to the Stripe webhook endpoint
        if (req.originalUrl === '/webhooks/stripe') {
          req.rawBody = buf.toString();
        }
      },
    }),
  );

  // If you use urlencoded payloads, add this as well
  app.use(
    urlencoded({
      extended: true,
      verify: (req: any, res, buf: Buffer, encoding: string) => {
        if (req.originalUrl === '/webhooks/stripe') {
          req.rawBody = buf.toString();
        }
      },
    }),
  );


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