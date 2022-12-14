import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose/dist';
import { isValidObjectId, Model } from 'mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';

import { PaginationDto } from '../common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {

  private defaultLimit:number

  constructor( 
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService
    ) {
      this.defaultLimit = this.configService.get<number>("default_limit")
    }

  async  create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {
      
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;

    } catch (error) {
      this.handleException(error)
    }

  }

  findAll(paginationDto: PaginationDto) {

    const { limit = this.defaultLimit, offset = 0 } = paginationDto;

    return this.pokemonModel.find()
      .limit(limit)
      .skip(offset)
      .sort({
        no: 1
      })
      .select('-__v')
  }

  async  findOne(termino: string) {
    
    let pokemon: Pokemon;
    
    if(!isNaN(+termino)) pokemon = await this.pokemonModel.findOne({no: termino})

    // MongoId
    if( !pokemon && isValidObjectId(termino) ) pokemon = await this.pokemonModel.findById( termino );

    // Name
    if(!pokemon) pokemon = await this.pokemonModel.findOne({name: termino.toLowerCase().trim()})
    
    // Error si no se encontraron resultados
    if(!pokemon) throw new NotFoundException(`El pokemon con el id, nombre o no "${termino}", no fué encontrado`)

    return pokemon;
  }

  async update(termino: string, updatePokemonDto: UpdatePokemonDto) {
    
    const pokemon = await this.findOne(termino);

    if(updatePokemonDto.name) updatePokemonDto.name = updatePokemonDto.name.toLowerCase();

    try {

      await pokemon.updateOne(updatePokemonDto);
      return {...pokemon.toJSON(), ...updatePokemonDto};
      
    } catch (error) {
      this.handleException(error);
    }


    

  }

  async remove(id: string) {
    // const pokemon = await this.findOne(id);
    // await pokemon.deleteOne();
    // this.pokemonModel.findByIdAndDelete( id );

    // const result = await this.pokemonModel.findByIdAndDelete(id);

    const {deletedCount} = await this.pokemonModel.deleteOne({_id: id})
  
    if (deletedCount === 0) {
      throw new BadRequestException(`No se encontró un pokemon con el id "${id}"`)
    }

    return;
  }



  private handleException(error: any) {
    if (error.code === 11000){
      throw new BadRequestException(`El pokemon ${ JSON.stringify(error.keyValue) } existe en la Base de datos`)
    }
    console.log(error);
    throw new InternalServerErrorException(`No se puede crear el pokemon - ver el log`)
  }
}
