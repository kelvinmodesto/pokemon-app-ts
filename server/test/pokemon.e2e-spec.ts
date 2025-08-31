import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PokemonModule } from '@/pokemon.module';
import { MONGO_PROVIDER } from '@db/mongo.module';

describe('Pokemon API (e2e)', () => {
  let app: INestApplication;
  let mockDb: any;
  let mockCollection: any;

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

  const mockPokeApiListResponse = {
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

  beforeAll(async () => {
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

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PokemonModule],
    })
      .overrideProvider(MONGO_PROVIDER)
      .useValue(mockDb)
      .compile();

    app = moduleFixture.createNestApplication();
    app.enableCors();
    await app.init();

    global.fetch = jest.fn();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('/pokemons (POST)', () => {
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

      const response = await request(app.getHttpServer())
        .post('/pokemons')
        .send({ pokemonIdOrName: 'pikachu' })
        .expect(201);

      expect(response.body).toEqual({
        ...mockPokemon,
        _id: '507f1f77bcf86cd799439011',
      });
    });

    it('should return 404 when pokemon not found in PokeAPI', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await request(app.getHttpServer())
        .post('/pokemons')
        .send({ pokemonIdOrName: 'fakemon' })
        .expect(404);
    });

    it('should return 400 when no pokemonIdOrName provided', async () => {
      await request(app.getHttpServer()).post('/pokemons').send({}).expect(400);
    });
  });

  describe('/pokemons (GET)', () => {
    it('should return paginated pokemon list', async () => {
      mockCollection.find.mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        toArray: jest.fn().mockResolvedValueOnce([mockPokemon]),
      });
      mockCollection.countDocuments.mockResolvedValueOnce(1);

      const response = await request(app.getHttpServer())
        .get('/pokemons')
        .expect(200);

      expect(response.body).toEqual({
        data: [{ ...mockPokemon, _id: '507f1f77bcf86cd799439011' }],
        total: 1,
        page: 1,
        totalPages: 1,
      });
    });

    it('should return paginated pokemon list with custom params', async () => {
      mockCollection.find.mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        toArray: jest.fn().mockResolvedValueOnce([]),
      });
      mockCollection.countDocuments.mockResolvedValueOnce(0);

      const response = await request(app.getHttpServer())
        .get('/pokemons?page=2&limit=10')
        .expect(200);

      expect(response.body).toEqual({
        data: [],
        total: 0,
        page: 2,
        totalPages: 0,
      });
    });
  });

  describe('/pokemons/pokeapi/list (GET)', () => {
    it('should return pokemon list from PokeAPI', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockPokeApiListResponse),
      });

      const response = await request(app.getHttpServer())
        .get('/pokemons/pokeapi/list')
        .expect(200);

      expect(response.body).toEqual(mockPokeApiListResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon/?limit=20&offset=0',
      );
    });

    it('should return pokemon list from PokeAPI with custom params', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockPokeApiListResponse),
      });

      await request(app.getHttpServer())
        .get('/pokemons/pokeapi/list?limit=50&offset=100')
        .expect(200);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon/?limit=50&offset=100',
      );
    });

    it('should handle PokeAPI errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await request(app.getHttpServer())
        .get('/pokemons/pokeapi/list')
        .expect(400);
    });
  });

  describe('/pokemons/validate/:pokemonIdOrName (GET)', () => {
    it('should validate existing pokemon', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockPokemon),
      });

      const response = await request(app.getHttpServer())
        .get('/pokemons/validate/pikachu')
        .expect(200);

      expect(response.body).toEqual({
        exists: true,
        pokemon: mockPokemon,
        message: "Pokemon 'pikachu' is valid",
      });
    });

    it('should validate non-existing pokemon', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const response = await request(app.getHttpServer())
        .get('/pokemons/validate/fakemon')
        .expect(200);

      expect(response.body.exists).toBe(false);
      expect(response.body.message).toContain("Pokemon 'fakemon' not found");
    });
  });

  describe('/pokemons/:id (GET)', () => {
    it('should return a pokemon by id', async () => {
      mockCollection.findOne.mockResolvedValueOnce(mockPokemon);

      const response = await request(app.getHttpServer())
        .get('/pokemons/25')
        .expect(200);

      expect(response.body).toEqual({
        ...mockPokemon,
        _id: '507f1f77bcf86cd799439011',
      });
    });

    it('should return a pokemon by name', async () => {
      mockCollection.findOne.mockResolvedValueOnce(mockPokemon);

      const response = await request(app.getHttpServer())
        .get('/pokemons/pikachu')
        .expect(200);

      expect(response.body).toEqual({
        ...mockPokemon,
        _id: '507f1f77bcf86cd799439011',
      });
    });

    it('should return 404 when pokemon not found', async () => {
      mockCollection.findOne.mockResolvedValueOnce(null);
      mockCollection.findOne.mockResolvedValueOnce(null);

      await request(app.getHttpServer()).get('/pokemons/999').expect(404);
    });
  });

  describe('/pokemons/:id (PATCH)', () => {
    it('should update a pokemon', async () => {
      const updatedPokemon = { ...mockPokemon, name: 'charizard', id: 6 };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(updatedPokemon),
      });

      mockCollection.findOneAndUpdate.mockResolvedValueOnce({
        value: updatedPokemon,
      });

      const response = await request(app.getHttpServer())
        .patch('/pokemons/25')
        .send({ pokemonIdOrName: 'charizard' })
        .expect(200);

      expect(response.body).toEqual({
        ...updatedPokemon,
        _id: '507f1f77bcf86cd799439011',
      });
    });

    it('should return 404 when pokemon to update not found', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockPokemon),
      });

      mockCollection.findOneAndUpdate.mockResolvedValueOnce({
        value: null,
      });

      await request(app.getHttpServer())
        .patch('/pokemons/999')
        .send({ pokemonIdOrName: 'pikachu' })
        .expect(404);
    });
  });

  describe('/pokemons/:id (DELETE)', () => {
    it('should delete a pokemon', async () => {
      mockCollection.deleteOne.mockResolvedValueOnce({
        deletedCount: 1,
      });

      const response = await request(app.getHttpServer())
        .delete('/pokemons/25')
        .expect(200);

      expect(response.body).toEqual({
        deleted: true,
        message: 'Pokemon with ID 25 has been deleted',
      });
    });

    it('should return 404 when pokemon to delete not found', async () => {
      mockCollection.deleteOne.mockResolvedValueOnce({
        deletedCount: 0,
      });

      await request(app.getHttpServer()).delete('/pokemons/999').expect(404);
    });
  });

  describe('Error handling', () => {
    it('should handle invalid JSON in request body', async () => {
      await request(app.getHttpServer())
        .post('/pokemons')
        .send('invalid json')
        .set('Content-Type', 'application/json')
        .expect(400);
    });

    it('should handle network errors during PokeAPI calls', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Network error'),
      );

      await request(app.getHttpServer())
        .post('/pokemons')
        .send({ pokemonIdOrName: 'pikachu' })
        .expect(400);
    });

    it('should handle database errors gracefully', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockPokemon),
      });

      mockCollection.findOne.mockRejectedValueOnce(
        new Error('Database connection failed'),
      );

      await request(app.getHttpServer())
        .post('/pokemons')
        .send({ pokemonIdOrName: 'pikachu' })
        .expect(500);
    });
  });

  describe('CORS and Headers', () => {
    it('should handle CORS preflight requests', async () => {
      await request(app.getHttpServer()).options('/pokemons').expect(204);
    });

    it('should return proper content-type headers', async () => {
      mockCollection.find.mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        toArray: jest.fn().mockResolvedValueOnce([]),
      });
      mockCollection.countDocuments.mockResolvedValueOnce(0);

      const response = await request(app.getHttpServer())
        .get('/pokemons')
        .expect(200);

      expect(response.headers['content-type']).toMatch(/application\/json/);
    });
  });

  describe('Input validation', () => {
    it('should handle empty pokemon name', async () => {
      await request(app.getHttpServer())
        .post('/pokemons')
        .send({ pokemonIdOrName: '' })
        .expect(400);
    });

    it('should handle null pokemon name', async () => {
      await request(app.getHttpServer())
        .post('/pokemons')
        .send({ pokemonIdOrName: null })
        .expect(400);
    });

    it('should handle extremely long pokemon names', async () => {
      const longName = 'a'.repeat(1000);
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await request(app.getHttpServer())
        .post('/pokemons')
        .send({ pokemonIdOrName: longName })
        .expect(404);
    });
  });
});
