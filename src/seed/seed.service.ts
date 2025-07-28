import { Injectable} from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';


@Injectable()
export class SeedService {
  

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter,
  ) {}
  
  async executeSeed() {

    await this.pokemonModel.deleteMany({});// delete * from pokemons;

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');

    const pokemonToInsert: { name: string; no: number; }[] = [];

    data.results.forEach(({ name, url }) => {
      
      const segments = url.split('/');
      const no = +segments[segments.length - 2];
    
      pokemonToInsert.push({ name, no });

    });

    await this.pokemonModel.insertMany(pokemonToInsert);// Manera más eficiente de realizar la insercion de muchos registros a la coleccion "pokemons" haciendo solo UNA insercion. this.pokemonModel.insertMany(pokemonToInsert); es equivalente a insert into pokemon (name, no) ("p 1", 1), ("p 2", 2),...,("p 650", 650) 

    return 'Seed Executed';
  }
}
