import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { isValidObjectId, Model } from 'mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) { }


  async create(createPokemonDto: CreatePokemonDto){
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    
    // try {
    //   const createdPokemon = new this.pokemonModel(createPokemonDto);
    //   return createdPokemon.save();
    // } catch (error) {// Error controlado en este catch. Dicha error puede ocurrir en el metodo .save(), el cual lo podrá lanzar para que así, yo pueda atraparlo y controlarlo con el catch
    //   console.log(error);
    // }

    try {
      const createdPokemon = await this.pokemonModel.create(createPokemonDto);// Puede arrojar error
      return createdPokemon;
    } catch (error) {
      // if (error.code === 11000) {// Ya existe un pokemon en la coleccion pokemons con el mismo "name" o "no"
      //   throw new BadRequestException(`Pokemon exists in db ${JSON.stringify(error.keyValue)}`);// respuesta con codigo 400
      // }
      // // Si no ocurre el error anterior, ocurrió otro tipo de problemas, el cual hay que revisar en los logs
      // console.log(error);
      // throw new InternalServerErrorException(`Can't create Pokemon - Check server logs`);// respuesta con codigo 500

      this.handleExceptions(error);
    }
    
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    return this.pokemonModel.find()
      .skip(offset)
      .limit(limit)
      .sort({
        no: 1,// ordenar por la columna "no" de manera ascendente (1)
      })
      .select('-__v');// this.pokemonModel.find() tiene todos los registros de la coleccion "pokemons", y de esos, se saltan los primeros "offset" (skip "offset") y a partir de ahi, solo se van a traer los "limit" pokemons (limit "limit") que estan despues de esos primeros "offset" pokemons (skip "offset"). Esos "limit" pokemons traidos, estaran ordenados en funcion de la columna "no" de manera ascendente, y vendrán sin la columna o el campo "__v".
  }

  async findOne(term: string) {// term tiene mas sentido semantico, ya que por un termino numerico, o por termino de nombre, o por termino de id, se va a buscar un pokemon

    let pokemon: Pokemon | null = null;

    if (!isNaN(+term)) { // si id es un número
      pokemon = await this.pokemonModel.findOne({no: term});
      // usado findOne porque voy a buscar por la columna "no", no por la columna id (su buscara por id, usaria findOneById). El modelo pokemonModel haace la conversion respectiva al tipo de dato entity Pokemon.
    }

    //MongoID
    if (!pokemon && isValidObjectId(term)) {// si no tenemos un pokemon aun, evaluar si el termino de busqueda del pokemon es un mongo id
      pokemon = await this.pokemonModel.findById(term);
    }

    //Name
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase().trim() });
    }


    if (!pokemon)
      throw new NotFoundException(`Pokemon with id, name or no "${term}" not found`);

    
    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    
    const pokemon = await this.findOne(term);// pokemon no solo es un documento de la coleccion "pokemons" que tiene las propiedades _id, name y no (donde name va a coincidir con term si term es el nombre de un pokemon, o donde no va a coincidir con term si term es el numero de un pokemon o donde _id va a coincidir con term si term es un id de mongo (mongo id) perteneciente a un pokemon). pokemon es un objeto o modelo que podrá hacer updates, overwrite, populated, remove, replaceOne, save y todo lo que un modelo de mongoose nos ofrece.
    updatePokemonDto.name = updatePokemonDto.name?.toLowerCase();

    // Una vez encontrado el pokemon, actualizar y grabar dicho pokemon en base de datos.
    // const updatedPokemon = await pokemon.updateOne(updatePokemonDto, {new: true});// usar new: true para regresar el pokemon actualizado

    try {
      await pokemon.updateOne(updatePokemonDto);// Puede arrojar error
  
      return {
        ...pokemon.toJSON(),
        ...Object.fromEntries( Object.entries(updatePokemonDto).filter( ([_, value]) => value != undefined) ),// Sobreescribir el contenido ya esparcido POR el contenido que viene en updatePokemonDto (pero antes de ello, con Object.fromEntries, se eliminan las propiedades de updatePokemonDto que tengan como valor undefined) 
      };
    } catch (error) {
      // if (error.code === 11000) {// Ya existe un pokemon en la coleccion pokemons con el mismo "name" o "no" que se pretenden actualizar para el pokemon "pokemon" en cuestion
      //   throw new BadRequestException(`Pokemon exists in db ${JSON.stringify(error.keyValue)}`);// respuesta con codigo 400
      // }
      // // Si no ocurre el error anterior, ocurrió otro tipo de problemas, el cual hay que revisar en los logs
      // console.log(error);
      // throw new InternalServerErrorException(`Can't create Pokemon - Check server logs`);// respuesta con codigo 500
      this.handleExceptions(error);

    }

  }

  async remove(id: string) {

    // const pokemon = await this.findOne(id);
    // await pokemon.deleteOne();

    // const result = await this.pokemonModel.findByIdAndDelete(id);

    const {deletedCount} = await this.pokemonModel.deleteOne({ _id: id });// Hace la eliminacion directa del pokemon con id "id". deletedCount será 0 en caso de que no haya encontrado el pokemon con id "id" que se busca eliminar

    if (deletedCount === 0)
      throw new NotFoundException(`Pokemon with id "${id}" not found`);

    return;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(`Pokemon exists in db ${JSON.stringify(error.keyValue)}`);// respuesta con codigo 40
    }
    console.log(error);
    throw new InternalServerErrorException(`Can't create Pokemon - Check server logs`);// respuesta con codigo 500
  }
}
