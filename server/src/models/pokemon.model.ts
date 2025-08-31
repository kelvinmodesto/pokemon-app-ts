export interface Pokemon {
  _id?: string;
  id: number;
  name: string;
  base_experience: number;
  height: number;
  is_default: boolean;
  order: number;
  weight: number;
  abilities: PokemonAbility[];
  forms: NamedAPIResource[];
  game_indices: VersionGameIndex[];
  held_items: PokemonHeldItem[];
  location_area_encounters: string;
  moves: PokemonMove[];
  species: NamedAPIResource;
  sprites: PokemonSprites;
  cries: PokemonCries;
  stats: PokemonStat[];
  types: PokemonType[];
  past_types?: PokemonTypePast[];
  past_abilities?: PokemonAbilityPast[];
}

export interface NamedAPIResource {
  name: string;
  url: string;
}

export interface PokemonAbility {
  is_hidden: boolean;
  slot: number;
  ability: NamedAPIResource;
}

export interface PokemonType {
  slot: number;
  type: NamedAPIResource;
}

export interface PokemonStat {
  stat: NamedAPIResource;
  effort: number;
  base_stat: number;
}

export interface PokemonSprites {
  front_default: string | null;
  front_shiny: string | null;
  front_female: string | null;
  front_shiny_female: string | null;
  back_default: string | null;
  back_shiny: string | null;
  back_female: string | null;
  back_shiny_female: string | null;
  other?: {
    'official-artwork'?: {
      front_default: string;
      front_shiny?: string;
    };
  };
}

export interface PokemonCries {
  latest: string;
  legacy: string;
}

export interface VersionGameIndex {
  game_index: number;
  version: NamedAPIResource;
}

export interface PokemonHeldItem {
  item: NamedAPIResource;
  version_details: any[];
}

export interface PokemonMove {
  move: NamedAPIResource;
  version_group_details: any[];
}

export interface PokemonTypePast {
  generation: NamedAPIResource;
  types: PokemonType[];
}

export interface PokemonAbilityPast {
  generation: NamedAPIResource;
  abilities: PokemonAbility[];
}

export interface PokeApiListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: NamedAPIResource[];
}

export interface CreatePokemonRequest {
  pokemonIdOrName: string | number;
}

export interface UpdatePokemonRequest {
  pokemonIdOrName?: string | number;
}

export interface PaginatedPokemonResponse {
  data: Pokemon[];
  total: number;
  page: number;
  totalPages: number;
}

export interface PokemonValidationResponse {
  exists: boolean;
  pokemon?: Pokemon;
  message: string;
}

export type CreatePokemonDto = Pokemon;
export type UpdatePokemonDto = Partial<Pokemon>;
