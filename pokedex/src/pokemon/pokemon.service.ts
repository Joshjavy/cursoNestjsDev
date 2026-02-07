import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { json } from 'stream/consumers';

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
      this.handleExceptions(error);

    }

  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {
    let pokemon: any;
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

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    try {
      const pokemon = await this.findOne(term);
      if (updatePokemonDto.name)
        updatePokemonDto.name = updatePokemonDto.name.toLowerCase()
      await pokemon.updateOne(updatePokemonDto)

      return { ...pokemon.toJSON(), ...updatePokemonDto };

    } catch (error: any) {
      this.handleExceptions(error);

    }

  }

  async remove(id: string) {
    
    // const pokemon = await this.findOne(id);
    // await pokemon.deleteOne();
    const result = await this.repository.findByIdAndDelete(id)
    return result;
    
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(`Pokemon repetido intente con otro`);
    }
    throw new InternalServerErrorException(`No se puede crear el pokemon - revise el log del servidor`)


  }
}
