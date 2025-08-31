import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PokemonService } from '@services/pokemon.service';
import type {
  Pokemon,
  PaginatedPokemonResponse,
  PokeApiListResponse,
  CreatePokemonRequest,
  UpdatePokemonRequest,
  PokemonValidationResponse,
} from '@models/pokemon.model';

@Controller('pokemons')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreatePokemonRequest): Promise<Pokemon> {
    const { pokemonIdOrName } = body;
    return this.pokemonService.create(pokemonIdOrName);
  }

  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ): Promise<PaginatedPokemonResponse> {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    return this.pokemonService.findAll(pageNum, limitNum);
  }

  @Get('pokeapi/list')
  async getPokemonListFromAPI(
    @Query('limit') limit: string = '20',
    @Query('offset') offset: string = '0',
  ): Promise<PokeApiListResponse> {
    const limitNum = parseInt(limit, 10) || 20;
    const offsetNum = parseInt(offset, 10) || 0;
    return this.pokemonService.fetchPokemonListFromAPI(limitNum, offsetNum);
  }

  @Get('validate/:pokemonIdOrName')
  async validatePokemon(
    @Param('pokemonIdOrName') pokemonIdOrName: string,
  ): Promise<PokemonValidationResponse> {
    return this.pokemonService.checkPokemonExists(pokemonIdOrName);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Pokemon> {
    return this.pokemonService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdatePokemonRequest,
  ): Promise<Pokemon> {
    const { pokemonIdOrName } = body;
    return this.pokemonService.update(id, pokemonIdOrName);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id') id: string,
  ): Promise<{ deleted: boolean; message: string }> {
    return this.pokemonService.remove(id);
  }
}
