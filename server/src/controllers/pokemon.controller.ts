import { Controller, Get } from '@nestjs/common';
import { PokemonService } from '@services/pokemon.service';

@Controller()
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get()
  listAllPokemons(): string {
    return this.pokemonService.getHello();
  }
}
