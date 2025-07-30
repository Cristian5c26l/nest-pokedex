import { join } from 'path';// paquete que ya viene en node
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { PokemonModule } from './pokemon/pokemon.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { EnvConfiguration } from './config/env.config';
import { JoiValidationSchema } from './config/joi.validation';

@Module({
  imports: [
    // ConfigModule.forRoot(),// Cargar las variables de entorno del archivo de variables de entorno .env a process.env
    ConfigModule.forRoot({
      load: [EnvConfiguration],// para mapear las variables de entorno del archivo .env, ya cargadas a process.env como variables con sus valores como string, a un objeto literal el cual sus propiedades son accesibles desde ConfigService
      validationSchema: JoiValidationSchema, // Lo que hará el ValidationSchema, segun su configuracion, es verificar que dicho archivo .env tenga de forma obligada la variable de entorno MONGODB. Tambien, va a verificar que dicho archivo .env tenga las variables de entorno PORT y DEFAULT_LIMIT con valores numericos. En caso de que no esten estas 2 variables en dicho archivo .env, se crearán de manera automatica dentro de ese archivo con los valores 3005 y 6, respectivamente, para que, despues, ConfigModule se encargue de cargarlas a process.env, donde despues va a actuar EnvConfiguration.
    }),// Cargar las variables de entorno del archivo de variables de entorno .env a process.env
    ServeStaticModule.forRoot({// Para servir contenido estatico
      rootPath: join(__dirname, '..', 'public'), // Servir contenido estaticoo index.html ubicado en la carpeta public
      
    }),
    MongooseModule.forRoot(process.env.MONGODB ?? 'mongodb://localhost:27018/nest-pokemon', {dbName: 'pokemonsdb'} ),// Esta configuracion realizada (MongooseModule.forRoot('mongodb://localhost:27018/nest-pokemon')) en app.module.ts es todo para que mi aplicacion de nest ya tenga conexion a la base de datos "nest-pokemon" que vive en el motor de mongo db ofrecido por el puerto 27017 del contenedor de linux que tiene dicho motor de mongodb. Se esta usando MONGODB la cual es una variable de entorno del archivo .env cargada a process.env gracias a ConfigModule.forRoot()
    PokemonModule, CommonModule, SeedModule
  ],
})
export class AppModule {}
