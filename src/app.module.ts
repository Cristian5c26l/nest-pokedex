import { join } from 'path';// paquete que ya viene en node
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PokemonModule } from './pokemon/pokemon.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({// Para servir contenido estatico
      rootPath: join(__dirname, '..', 'public'), // Servir contenido estaticoo index.html ubicado en la carpeta public
      
    }),
    MongooseModule.forRoot('mongodb://localhost:27018/nest-pokemon'),// Esta configuracion realizada (MongooseModule.forRoot('mongodb://localhost:27018/nest-pokemon')) en app.module.ts es todo para que mi aplicacion de nest ya tenga conexion a la base de datos "nest-pokemon" que vive en el motor de mongo db ofrecido por el puerto 27017 del contenedor de linux que tiene dicho motor de mongodb.
    PokemonModule, CommonModule, SeedModule
  ],
})
export class AppModule {}
