import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly repository: Model<Pokemon>
  ) { }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase()
    try {
      const pokemon = await this.repository.create(createPokemonDto)
      return pokemon;
    } catch (error: any) {
      if (error.code === 11000) {
        throw new BadRequestException(`Pokemon repetido intente con otro`);
      }
      throw new InternalServerErrorException(`No se puede crear el pokemon - revise el log del servidor`)

    }

  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {
    let pokemon:any;
    if (!isNaN(+term)) {
      pokemon = await this.repository.findOne({ no: term })
    }

    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.repository.findById(term)
    }

    if (!pokemon) {
      pokemon = await this.repository.findOne({ name: term.toLowerCase() })
    }

    if (!pokemon) throw new NotFoundException(`No resultados en la consulta`)
    return pokemon
  }

  update(id: number, updatePokemonDto: UpdatePokemonDto) {
    return `This action updates a #${id} pokemon`;
  }

  remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }
}
