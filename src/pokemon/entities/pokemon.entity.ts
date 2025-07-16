import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()//Usar este decorador para que la clase o entidad Pokemon pueda especificar las reglas que va a tener, en este caso, los campos (que seran identificadores unicos (unique: true)... esto es una regla) "name" y "no" de un documento "Pokemon" de la coleccion "pokemons"*
export class Pokemon extends Document{

    //id: string; // Mongo me lo da


    @Prop({
        unique: true,// unique true, para que no haya mas de un documento "pokemon" en la coleccion "pokemons", que tenga el mismo name
        index: true,//Index en true para que, por name, se pueda obtener rapidamente el documento "pokemon" cuyo name sea un name especifico
    })
    name: string;

    @Prop({
        unique: true,
        index: true,
    })
    no: number;

}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);// Exportacion del esque PokemonSchema basado en el esquema Pokemon (que tambien... la instancia de Pokemon, funciona como un documento que se podrá añadir a la coleccion "pokemons"). Este esquema es el que le va a decir, cuando estemos iniciando la base de datos, que ciertas definiciones (reglas, columnas y otras cosas) son las que se van a usar.... En resumen, en este caso, con export const PokemonSchema = SchemaFactory.createForClass(Pokemon);, se especifica que PokemonSchema estará basado en las reglas de los campos de la clase (o esquema, gracias a @Schema) Pokemon.