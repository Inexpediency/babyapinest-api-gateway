import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

async function bootstrap() {
    const logger = new Logger(bootstrap.name);

    const app = await NestFactory.create(AppModule);

    const options = new DocumentBuilder()
        .setTitle('Baby API on NestJS!')
        .setDescription('The baby API description')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('aboutapi', app, document);

    await app.listen(process.env.PORT);
    logger.log('Babyapinest API Gateway service has started!');
}
bootstrap();
