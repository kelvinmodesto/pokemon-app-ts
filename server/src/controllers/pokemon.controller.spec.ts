import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { PokemonController } from './pokemon.controller';
import { PokemonService } from '../services/pokemon.service';
import type {
  Pokemon,
  PaginatedPokemonResponse,
  PokeApiListResponse,
  PokemonValidationResponse,
  CreatePokemonRequest,
  UpdatePokemonRequest,
} from '@models/pokemon.model';

describe('PokemonController', () => {
  let controller: PokemonController;
  let service: PokemonService;

  const mockPokemon: Pokemon = {
    _id: '507f1f77bcf86cd799439011',
    id: 25,
    name: 'pikachu',
    base_experience: 112,
    height: 4,
    weight: 60,
    is_default: true,
    order: 35,
    abilities: [
      {
        is_hidden: false,
        slot: 1,
        ability: {
          name: 'static',
          url: 'https://pokeapi.co/api/v2/ability/9/',
        },
      },
    ],
    forms: [
      {
        name: 'pikachu',
        url: 'https://pokeapi.co/api/v2/pokemon-form/25/',
      },
    ],
    game_indices: [],
    held_items: [],
    location_area_encounters: '/api/v2/pokemon/25/encounters',
    moves: [],
    species: {
      name: 'pikachu',
      url: 'https://pokeapi.co/api/v2/pokemon-species/25/',
    },
    sprites: {
      front_default:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
      front_shiny: null,
      front_female: null,
      front_shiny_female: null,
      back_default: null,
      back_shiny: null,
      back_female: null,
      back_shiny_female: null,
      other: {
        'official-artwork': {
          front_default:
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
        },
      },
    },
    cries: {
      latest:
        'https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/25.ogg',
      legacy:
        'https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/legacy/25.ogg',
    },
    stats: [
      {
        base_stat: 90,
        effort: 0,
        stat: {
          name: 'speed',
          url: 'https://pokeapi.co/api/v2/stat/6/',
        },
      },
    ],
    types: [
      {
        slot: 1,
        type: {
          name: 'electric',
          url: 'https://pokeapi.co/api/v2/type/13/',
        },
      },
    ],
  };

  const mockPaginatedResponse: PaginatedPokemonResponse = {
    data: [mockPokemon],
    total: 1,
    page: 1,
    totalPages: 1,
  };

  const mockPokeApiListResponse: PokeApiListResponse = {
    count: 1281,
    next: 'https://pokeapi.co/api/v2/pokemon/?offset=20&limit=20',
    previous: null,
    results: [
      {
        name: 'bulbasaur',
        url: 'https://pokeapi.co/api/v2/pokemon/1/',
      },
      {
        name: 'pikachu',
        url: 'https://pokeapi.co/api/v2/pokemon/25/',
      },
    ],
  };

  const mockValidationResponse: PokemonValidationResponse = {
    exists: true,
    pokemon: mockPokemon,
    message: "Pokemon 'pikachu' is valid",
  };

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      fetchPokemonListFromAPI: jest.fn(),
      checkPokemonExists: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PokemonController],
      providers: [
        {
          provide: PokemonService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<PokemonController>(PokemonController);
    service = module.get<PokemonService>(PokemonService);
  });

  describe('create', () => {
    it('should create a pokemon', async () => {
      const createRequest: CreatePokemonRequest = {
        pokemonIdOrName: 'pikachu',
      };
      (service.create as jest.Mock).mockResolvedValue(mockPokemon);

      const result = await controller.create(createRequest);

      expect(service.create).toHaveBeenCalledWith('pikachu');
      expect(result).toEqual(mockPokemon);
    });

    it('should handle create errors', async () => {
      const createRequest: CreatePokemonRequest = {
        pokemonIdOrName: 'fakemon',
      };
      (service.create as jest.Mock).mockRejectedValue(
        new NotFoundException("Pokemon 'fakemon' not found in PokeAPI"),
      );

      await expect(controller.create(createRequest)).rejects.toThrow(
        new NotFoundException("Pokemon 'fakemon' not found in PokeAPI"),
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated pokemon list with default params', async () => {
      (service.findAll as jest.Mock).mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalledWith(1, 20);
      expect(result).toEqual(mockPaginatedResponse);
    });

    it('should return paginated pokemon list with custom params', async () => {
      (service.findAll as jest.Mock).mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findAll('2', '10');

      expect(service.findAll).toHaveBeenCalledWith(2, 10);
      expect(result).toEqual(mockPaginatedResponse);
    });

    it('should handle invalid page/limit params', async () => {
      (service.findAll as jest.Mock).mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findAll('invalid', 'invalid');

      expect(service.findAll).toHaveBeenCalledWith(1, 20);
      expect(result).toEqual(mockPaginatedResponse);
    });
  });

  describe('getPokemonListFromAPI', () => {
    it('should return pokemon list from PokeAPI with default params', async () => {
      (service.fetchPokemonListFromAPI as jest.Mock).mockResolvedValue(
        mockPokeApiListResponse,
      );

      const result = await controller.getPokemonListFromAPI();

      expect(service.fetchPokemonListFromAPI).toHaveBeenCalledWith(20, 0);
      expect(result).toEqual(mockPokeApiListResponse);
    });

    it('should return pokemon list from PokeAPI with custom params', async () => {
      (service.fetchPokemonListFromAPI as jest.Mock).mockResolvedValue(
        mockPokeApiListResponse,
      );

      const result = await controller.getPokemonListFromAPI('50', '100');

      expect(service.fetchPokemonListFromAPI).toHaveBeenCalledWith(50, 100);
      expect(result).toEqual(mockPokeApiListResponse);
    });

    it('should handle API errors', async () => {
      (service.fetchPokemonListFromAPI as jest.Mock).mockRejectedValue(
        new BadRequestException('Failed to fetch from PokeAPI'),
      );

      await expect(controller.getPokemonListFromAPI()).rejects.toThrow(
        new BadRequestException('Failed to fetch from PokeAPI'),
      );
    });
  });

  describe('validatePokemon', () => {
    it('should validate pokemon successfully', async () => {
      (service.checkPokemonExists as jest.Mock).mockResolvedValue(
        mockValidationResponse,
      );

      const result = await controller.validatePokemon('pikachu');

      expect(service.checkPokemonExists).toHaveBeenCalledWith('pikachu');
      expect(result).toEqual(mockValidationResponse);
    });

    it('should return validation failure for invalid pokemon', async () => {
      const invalidResponse: PokemonValidationResponse = {
        exists: false,
        message:
          "Pokemon 'fakemon' not found: Pokemon 'fakemon' not found in PokeAPI",
      };
      (service.checkPokemonExists as jest.Mock).mockResolvedValue(
        invalidResponse,
      );

      const result = await controller.validatePokemon('fakemon');

      expect(service.checkPokemonExists).toHaveBeenCalledWith('fakemon');
      expect(result).toEqual(invalidResponse);
    });
  });

  describe('findOne', () => {
    it('should return a pokemon by id', async () => {
      (service.findOne as jest.Mock).mockResolvedValue(mockPokemon);

      const result = await controller.findOne('25');

      expect(service.findOne).toHaveBeenCalledWith('25');
      expect(result).toEqual(mockPokemon);
    });

    it('should return a pokemon by name', async () => {
      (service.findOne as jest.Mock).mockResolvedValue(mockPokemon);

      const result = await controller.findOne('pikachu');

      expect(service.findOne).toHaveBeenCalledWith('pikachu');
      expect(result).toEqual(mockPokemon);
    });

    it('should handle not found errors', async () => {
      (service.findOne as jest.Mock).mockRejectedValue(
        new NotFoundException('Pokemon with ID 999 not found in database'),
      );

      await expect(controller.findOne('999')).rejects.toThrow(
        new NotFoundException('Pokemon with ID 999 not found in database'),
      );
    });
  });

  describe('update', () => {
    it('should update a pokemon', async () => {
      const updateRequest: UpdatePokemonRequest = {
        pokemonIdOrName: 'charizard',
      };
      const updatedPokemon = { ...mockPokemon, name: 'charizard', id: 6 };
      (service.update as jest.Mock).mockResolvedValue(updatedPokemon);

      const result = await controller.update('25', updateRequest);

      expect(service.update).toHaveBeenCalledWith('25', 'charizard');
      expect(result).toEqual(updatedPokemon);
    });

    it('should update without new pokemon data', async () => {
      const updateRequest: UpdatePokemonRequest = {};
      (service.update as jest.Mock).mockResolvedValue(mockPokemon);

      const result = await controller.update('25', updateRequest);

      expect(service.update).toHaveBeenCalledWith('25', undefined);
      expect(result).toEqual(mockPokemon);
    });

    it('should handle update errors', async () => {
      const updateRequest: UpdatePokemonRequest = {
        pokemonIdOrName: 'charizard',
      };
      (service.update as jest.Mock).mockRejectedValue(
        new NotFoundException('Pokemon with ID 999 not found'),
      );

      await expect(controller.update('999', updateRequest)).rejects.toThrow(
        new NotFoundException('Pokemon with ID 999 not found'),
      );
    });
  });

  describe('remove', () => {
    it('should remove a pokemon', async () => {
      const deleteResponse = {
        deleted: true,
        message: 'Pokemon with ID 25 has been deleted',
      };
      (service.remove as jest.Mock).mockResolvedValue(deleteResponse);

      const result = await controller.remove('25');

      expect(service.remove).toHaveBeenCalledWith('25');
      expect(result).toEqual(deleteResponse);
    });

    it('should handle remove errors', async () => {
      (service.remove as jest.Mock).mockRejectedValue(
        new NotFoundException('Pokemon with ID 999 not found'),
      );

      await expect(controller.remove('999')).rejects.toThrow(
        new NotFoundException('Pokemon with ID 999 not found'),
      );
    });
  });
});
