import { Module } from '@nestjs/common';
import { MongoDBModule } from './db/mongo.module';
import { PokemonController } from './controllers/pokemon.controller';
import { PokemonService } from './services/pokemon.service';

@Module({
  imports: [MongoDBModule],
  controllers: [PokemonController],
  providers: [PokemonService],
})
export class PokemonModule {}
