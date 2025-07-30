import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);// "app" es la aplicacion de nest

  // app.setGlobalPrefix('api');// Usado para que se puedan atender a peticiones como "/api/pokemon". En caso de que no se use el prefijo "api" ni ningun otro, se tendria que hacer las peticion a "/pokemon" como comunmente se haria.
  app.setGlobalPrefix('api/v2');// Usado para que se puedan atender a peticiones como "/api/v2/pokemon". En caso de que no se use el prefijo "api/v2" ni ningun otro, se tendria que hacer las peticion a "/pokemon" como comunmente se haria.

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // limpiar bodys que viajen en las peticiones, los cuales tengan propiedades de más que las especificadas en los dtos
    forbidNonWhitelisted: true, // Arrojar bad request en caso de que en los bodys de las peticiones vengan propiedades de más que las especificadas en los dtos
    transform: true,// Para que la informacion que fluye por los DTOs (como los query parameters que fluyen por el DTO PaginationDto), antes de ser validada por los DTOs, se transforme
    transformOptions: {
      enableImplicitConversion: true,// Habilitar la transformacion implicita de la informacion que fluye por los DTOs (como los query parameters que fluyen por el DTO PaginationDto)
    }
  }));

  await app.listen(process.env.PORT ?? 3000);// PORT de .env, se carga a process.env gracias a ConfigModule

  console.log(`App running on port ${process.env.PORT}`);
}
bootstrap();
