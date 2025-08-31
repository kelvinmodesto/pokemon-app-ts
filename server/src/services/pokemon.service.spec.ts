import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { MONGO_PROVIDER } from '@db/mongo.module';

describe('PokemonService', () => {
  let service: PokemonService;
  let mockCollection: any;
  let mockDb: any;

  const mockPokemon = {
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

  const mockPokeApiResponse = {
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

  beforeEach(async () => {
    mockCollection = {
      findOne: jest.fn(),
      find: jest.fn(),
      insertOne: jest.fn(),
      findOneAndUpdate: jest.fn(),
      deleteOne: jest.fn(),
      countDocuments: jest.fn(),
    };

    mockDb = {
      collection: jest.fn().mockReturnValue(mockCollection),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PokemonService,
        {
          provide: MONGO_PROVIDER,
          useValue: mockDb,
        },
      ],
    }).compile();

    service = module.get<PokemonService>(PokemonService);

    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('validatePokemon', () => {
    it('should validate a pokemon successfully', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockPokemon),
      });

      const result = await service.validatePokemon('pikachu');

      expect(global.fetch).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon/pikachu',
      );
      expect(result).toEqual(mockPokemon);
    });

    it('should throw NotFoundException when pokemon not found', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(service.validatePokemon('fakemon')).rejects.toThrow(
        new NotFoundException("Pokemon 'fakemon' not found in PokeAPI"),
      );
    });

    it('should throw BadRequestException on API error', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(service.validatePokemon('pikachu')).rejects.toThrow(
        new BadRequestException(
          "Failed to validate Pokemon 'pikachu' with PokeAPI",
        ),
      );
    });

    it('should handle fetch errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Network error'),
      );

      await expect(service.validatePokemon('pikachu')).rejects.toThrow(
        new BadRequestException(
          "Unable to validate Pokemon 'pikachu': Network error",
        ),
      );
    });
  });

  describe('create', () => {
    it('should create a new pokemon', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockPokemon),
      });

      mockCollection.findOne.mockResolvedValueOnce(null);
      mockCollection.insertOne.mockResolvedValueOnce({
        insertedId: '507f1f77bcf86cd799439011',
      });
      mockCollection.findOne.mockResolvedValueOnce(mockPokemon);

      const result = await service.create('pikachu');

      expect(result).toEqual({
        ...mockPokemon,
        _id: '507f1f77bcf86cd799439011',
      });
    });

    it('should return existing pokemon if already stored', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockPokemon),
      });

      mockCollection.findOne.mockResolvedValueOnce(mockPokemon);

      const result = await service.create('pikachu');

      expect(result).toEqual({
        ...mockPokemon,
        _id: '507f1f77bcf86cd799439011',
      });
      expect(mockCollection.insertOne).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return paginated pokemon list', async () => {
      const mockPokemons = [mockPokemon];
      mockCollection.find.mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        toArray: jest.fn().mockResolvedValueOnce(mockPokemons),
      });
      mockCollection.countDocuments.mockResolvedValueOnce(1);

      const result = await service.findAll(1, 20);

      expect(result).toEqual({
        data: [{ ...mockPokemon, _id: '507f1f77bcf86cd799439011' }],
        total: 1,
        page: 1,
        totalPages: 1,
      });
    });

    it('should handle empty results', async () => {
      mockCollection.find.mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        toArray: jest.fn().mockResolvedValueOnce([]),
      });
      mockCollection.countDocuments.mockResolvedValueOnce(0);

      const result = await service.findAll(1, 20);

      expect(result).toEqual({
        data: [],
        total: 0,
        page: 1,
        totalPages: 0,
      });
    });
  });

  describe('findOne', () => {
    it('should find pokemon by numeric id', async () => {
      mockCollection.findOne.mockResolvedValueOnce(mockPokemon);

      const result = await service.findOne('25');

      expect(result).toEqual({
        ...mockPokemon,
        _id: '507f1f77bcf86cd799439011',
      });
      expect(mockCollection.findOne).toHaveBeenCalledWith({ id: 25 });
    });

    it('should find pokemon by name', async () => {
      mockCollection.findOne.mockResolvedValueOnce(mockPokemon);

      const result = await service.findOne('pikachu');

      expect(result).toEqual({
        ...mockPokemon,
        _id: '507f1f77bcf86cd799439011',
      });
      expect(mockCollection.findOne).toHaveBeenCalledWith({
        name: new RegExp('^pikachu$', 'i'),
      });
    });

    it('should throw NotFoundException when pokemon not found', async () => {
      mockCollection.findOne.mockResolvedValueOnce(null);
      mockCollection.findOne.mockResolvedValueOnce(null);

      await expect(service.findOne('999')).rejects.toThrow(
        new NotFoundException('Pokemon with ID 999 not found in database'),
      );
    });
  });

  describe('update', () => {
    it('should update pokemon with new validated data', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockPokemon),
      });

      mockCollection.findOneAndUpdate.mockResolvedValueOnce({
        value: mockPokemon,
      });

      const result = await service.update('25', 'pikachu');

      expect(result).toEqual({
        ...mockPokemon,
        _id: '507f1f77bcf86cd799439011',
      });
    });

    it('should throw NotFoundException when pokemon to update not found', async () => {
      // Mock the fetch call for validation since we're passing pokemonIdOrName
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockPokemon),
      });

      mockCollection.findOneAndUpdate.mockResolvedValueOnce({
        value: null,
      });

      await expect(service.update('999', 'pikachu')).rejects.toThrow(
        new NotFoundException('Pokemon with ID 999 not found'),
      );
    });
  });

  describe('remove', () => {
    it('should remove pokemon successfully', async () => {
      mockCollection.deleteOne.mockResolvedValueOnce({
        deletedCount: 1,
      });

      const result = await service.remove('25');

      expect(result).toEqual({
        deleted: true,
        message: 'Pokemon with ID 25 has been deleted',
      });
    });

    it('should throw NotFoundException when pokemon to delete not found', async () => {
      mockCollection.deleteOne.mockResolvedValueOnce({
        deletedCount: 0,
      });

      await expect(service.remove('999')).rejects.toThrow(
        new NotFoundException('Pokemon with ID 999 not found'),
      );
    });
  });

  describe('fetchPokemonListFromAPI', () => {
    it('should fetch pokemon list from PokeAPI', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockPokeApiResponse),
      });

      const result = await service.fetchPokemonListFromAPI(20, 0);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon/?limit=20&offset=0',
      );
      expect(result).toEqual(mockPokeApiResponse);
    });

    it('should throw BadRequestException on API error', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(service.fetchPokemonListFromAPI()).rejects.toThrow(
        new BadRequestException('Failed to fetch from PokeAPI'),
      );
    });

    it('should handle fetch errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Network error'),
      );

      await expect(service.fetchPokemonListFromAPI()).rejects.toThrow(
        new BadRequestException(
          'Failed to fetch Pokemon list from PokeAPI: Network error',
        ),
      );
    });
  });

  describe('checkPokemonExists', () => {
    it('should return exists true for valid pokemon', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockPokemon),
      });

      const result = await service.checkPokemonExists('pikachu');

      expect(result).toEqual({
        exists: true,
        pokemon: mockPokemon,
        message: "Pokemon 'pikachu' is valid",
      });
    });

    it('should return exists false for invalid pokemon', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const result = await service.checkPokemonExists('fakemon');

      expect(result.exists).toBe(false);
      expect(result.message).toContain("Pokemon 'fakemon' not found");
    });
  });
});
