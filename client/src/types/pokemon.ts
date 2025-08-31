export interface Pokemon {
  _id?: string;
  id: number;
  name: string;
  base_experience: number;
  height: number;
  weight: number;
  is_default: boolean;
  order: number;
  abilities: Ability[];
  forms: PokemonForm[];
  game_indices: GameIndex[];
  held_items: HeldItem[];
  location_area_encounters: string;
  moves: Move[];
  species: Species;
  sprites: Sprites;
  cries: Cries;
  stats: Stat[];
  types: Type[];
}

export interface Ability {
  is_hidden: boolean;
  slot: number;
  ability: {
    name: string;
    url: string;
  };
}

export interface PokemonForm {
  name: string;
  url: string;
}

export interface GameIndex {
  game_index: number;
  version: {
    name: string;
    url: string;
  };
}

export interface HeldItem {
  item: {
    name: string;
    url: string;
  };
  version_details: VersionDetail[];
}

export interface VersionDetail {
  rarity: number;
  version: {
    name: string;
    url: string;
  };
}

export interface Move {
  move: {
    name: string;
    url: string;
  };
  version_group_details: VersionGroupDetail[];
}

export interface VersionGroupDetail {
  level_learned_at: number;
  move_learn_method: {
    name: string;
    url: string;
  };
  version_group: {
    name: string;
    url: string;
  };
}

export interface Species {
  name: string;
  url: string;
}

export interface Sprites {
  front_default: string | null;
  front_shiny: string | null;
  front_female: string | null;
  front_shiny_female: string | null;
  back_default: string | null;
  back_shiny: string | null;
  back_female: string | null;
  back_shiny_female: string | null;
  other: {
    'official-artwork': {
      front_default: string;
    };
  };
}

export interface Cries {
  latest: string;
  legacy: string;
}

export interface Stat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface Type {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PaginatedPokemonResponse {
  data: Pokemon[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CreatePokemonRequest {
  pokemonIdOrName: string | number;
}

export interface UpdatePokemonRequest {
  pokemonIdOrName?: string | number;
}
