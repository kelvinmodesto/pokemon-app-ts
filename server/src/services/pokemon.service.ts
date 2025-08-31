import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  Db,
  Collection,
  ObjectId,
  Filter,
  FindOneAndUpdateOptions,
  DeleteResult,
} from 'mongodb';
import {
  Pokemon,
  PaginatedPokemonResponse,
  PokeApiListResponse,
  PokemonValidationResponse,
} from '@models/pokemon.model';
import { MONGO_PROVIDER } from '@db/mongo.module';

@Injectable()
export class PokemonService {
  private pokemonCollection: Collection<Pokemon>;

  constructor(@Inject(MONGO_PROVIDER as string) private db: Db) {
    this.pokemonCollection = this.db.collection<Pokemon>('pokemons');
  }

  async validatePokemon(pokemonIdOrName: string | number): Promise<Pokemon> {
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonIdOrName}`,
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new NotFoundException(
            `Pokemon '${pokemonIdOrName}' not found in PokeAPI`,
          );
        }
        throw new BadRequestException(
          `Failed to validate Pokemon '${pokemonIdOrName}' with PokeAPI`,
        );
      }

      const pokeApiData: Pokemon = (await response.json()) as Pokemon;
      return pokeApiData;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Unable to validate Pokemon '${pokemonIdOrName}': ${(error as Error).message}`,
      );
    }
  }

  async validateAndStorePokemon(
    pokemonIdOrName: string | number,
  ): Promise<Pokemon> {
    const validatedPokemon = await this.validatePokemon(pokemonIdOrName);

    const existingPokemon = await this.pokemonCollection.findOne({
      id: validatedPokemon.id,
    });

    if (existingPokemon) {
      return {
        ...existingPokemon,
        _id: existingPokemon._id?.toString(),
      };
    }

    const result = await this.pokemonCollection.insertOne(validatedPokemon);
    const pokemon = await this.pokemonCollection.findOne({
      _id: result.insertedId,
    });

    if (!pokemon) {
      throw new Error('Failed to store pokemon after validation');
    }

    return {
      ...pokemon,
      _id: pokemon._id?.toString(),
    };
  }

  async create(pokemonIdOrName: string | number): Promise<Pokemon> {
    return this.validateAndStorePokemon(pokemonIdOrName);
  }

  async findAll(
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedPokemonResponse> {
    const skip = (page - 1) * limit;

    const [pokemons, total] = await Promise.all([
      this.pokemonCollection
        .find({})
        .skip(skip)
        .limit(limit)
        .sort({ id: 1 })
        .toArray(),
      this.pokemonCollection.countDocuments({}),
    ]);

    return {
      data: pokemons.map((pokemon) => ({
        ...pokemon,
        _id: pokemon._id?.toString(),
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Pokemon> {
    let pokemon: Pokemon | null;

    if (ObjectId.isValid(id)) {
      pokemon = await this.pokemonCollection.findOne({
        _id: new ObjectId(id),
      } as unknown as Filter<Pokemon>);
    } else {
      const numericId = parseInt(id, 10);
      if (!isNaN(numericId)) {
        pokemon = await this.pokemonCollection.findOne({ id: numericId });
      } else {
        pokemon = await this.pokemonCollection.findOne({
          name: new RegExp(`^${id}$`, 'i'),
        });
      }
    }

    if (!pokemon) {
      throw new NotFoundException(
        `Pokemon with ID ${id} not found in database`,
      );
    }

    return {
      ...pokemon,
      _id: pokemon._id?.toString(),
    };
  }

  async update(
    id: string,
    pokemonIdOrName?: string | number,
  ): Promise<Pokemon> {
    let updateData: Partial<Pokemon> = {};

    if (pokemonIdOrName) {
      const validatedPokemon = await this.validatePokemon(pokemonIdOrName);
      updateData = { ...validatedPokemon };
      delete updateData._id;
    }

    let result: any;

    if (ObjectId.isValid(id)) {
      result = await this.pokemonCollection.findOneAndUpdate(
        { _id: new ObjectId(id) } as unknown as Filter<Pokemon>,
        { $set: updateData },
        { returnDocument: 'after' } as FindOneAndUpdateOptions,
      );
    } else {
      const numericId = parseInt(id, 10);
      if (!isNaN(numericId)) {
        result = await this.pokemonCollection.findOneAndUpdate(
          { id: numericId },
          { $set: updateData },
          { returnDocument: 'after' },
        );
      } else {
        result = await this.pokemonCollection.findOneAndUpdate(
          { name: new RegExp(`^${id}$`, 'i') },
          { $set: updateData },
          { returnDocument: 'after' },
        );
      }
    }

    if (!result || !result.value) {
      throw new NotFoundException(`Pokemon with ID ${id} not found`);
    }

    const pokemon = result.value;
    return {
      ...pokemon,
      _id: pokemon._id?.toString(),
    } as Pokemon;
  }

  async remove(id: string): Promise<{ deleted: boolean; message: string }> {
    let result: DeleteResult;

    if (ObjectId.isValid(id)) {
      result = await this.pokemonCollection.deleteOne({
        _id: new ObjectId(id),
      } as unknown as Filter<Pokemon>);
    } else {
      const numericId = parseInt(id, 10);
      if (!isNaN(numericId)) {
        result = await this.pokemonCollection.deleteOne({ id: numericId });
      } else {
        result = await this.pokemonCollection.deleteOne({
          name: new RegExp(`^${id}$`, 'i'),
        });
      }
    }

    if (!result || result.deletedCount === 0) {
      throw new NotFoundException(`Pokemon with ID ${id} not found`);
    }

    return {
      deleted: true,
      message: `Pokemon with ID ${id} has been deleted`,
    };
  }

  async fetchPokemonListFromAPI(
    limit: number = 20,
    offset: number = 0,
  ): Promise<PokeApiListResponse> {
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offset}`,
      );

      if (!response.ok) {
        throw new BadRequestException('Failed to fetch from PokeAPI');
      }

      return (await response.json()) as PokeApiListResponse;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to fetch Pokemon list from PokeAPI: ${(error as Error).message}`,
      );
    }
  }

  async checkPokemonExists(
    pokemonIdOrName: string | number,
  ): Promise<PokemonValidationResponse> {
    try {
      const pokemon = await this.validatePokemon(pokemonIdOrName);
      return {
        exists: true,
        pokemon,
        message: `Pokemon '${pokemonIdOrName}' is valid`,
      };
    } catch (error) {
      return {
        exists: false,
        message: `Pokemon '${pokemonIdOrName}' not found: ${(error as Error).message}`,
      };
    }
  }
}
