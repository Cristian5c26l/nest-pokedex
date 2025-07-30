import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Pokemon, PokemonSchema } from './entities/pokemon.entity';

@Module({
  controllers: [PokemonController],
  providers: [PokemonService],
  imports: [
    ConfigModule,// Importar el modulo ConfigModule que contiene el ConfigService, el cual, ya viene configurado para que pueda acceder a las variables devueltas por el objeto devuelto por EnvConfiguration. Dichas variables son el resultado de mapear las variables de entorno del archivo .env cargadas por ConfigModule.forRoot() en AppModule. 
    MongooseModule.forFeature(// Importacion de modulo de mongoose para que pueda, todo lo que pertenezca al modulo o "feature" PokemonModule, pueda usar el array de modelos de mongo especificado abajo. En este caso, PokemonModule va a poder interactuar (y crear cuando se levanta la aplicacion) un modelo completo de mongoose, es decir, con una colección llamada Pokemon.name, la cual estará construida basada en las reglas del "PokemonSchema" (reglas como que el campo name y no son unique (unicos)) definidas en la clase."Pokemon", la cual, al mismo tiempo, servirá para que de dicha clase nazca una instancia la cual pueda añadirse como documento a la coleccion mencionada.
      [ 
        {// Modelo de mongoose para los pokemons (name es el nombre de la coleccion.... schema es dicha coleccion construida en base a reglas especificadas a los campos (como name y no) de dicha coleccion, las cuales estan especificadas, en este caso, en la clase o esquema Pokemon)
          name: Pokemon.name,// name no viene de la clase Pokemon, si no de la que extiende, que es "Document". La coleccion se llamará asi: "NombreDeLaClaseQueExtiendeDeDocument" + "s". Como en este caso, la clase se llama "Pokemon", entonces, la coleccion se va a llamar "pokemons.".... Creo que esto ultimo mencionado es lo que al final de cuentas tiene "Pokemon.name".
          schema: PokemonSchema,
        }
      ]
    ),
  ],
  exports: [// modelo de mongo "Pokemon" exportado por el PokemonModule
    MongooseModule
  ]
})
export class PokemonModule { }



// schema: PokemonSchema// // Importar el --modulo de mongoose de pokemon (el cual va a un array que contendrá modelos de mongoose que serán objetos literales con propiedades "name" y "schema". En este caso, se añadirá a dicho array un modelo cuya propiedad name tendrá el valor de Pokemon.names (donde la propiedade name viene de "Document"), mientras que su propiedad schema va a tener el valor de PokemonSchema. De esta manera, se va a crear la coleccion llamada "pokemons" la cual tendrá documentos (instancias de Pokemon) los cuales están basados en el Schema (reglas aplicadas a los campos especificados) aplicado a Pokemon)-- para el modulo Pokemon
