import { Module, Global } from '@nestjs/common';
import { MongoClient, Db } from 'mongodb';

const MONGO_PROVIDER = 'MONGO_CONNECTION';

@Global()
@Module({
  providers: [
    {
      provide: MONGO_PROVIDER,
      useFactory: async (): Promise<Db> => {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
        const dbName = process.env.MONGODB_DB_NAME || 'pokemon_center';

        const client = new MongoClient(mongoUri);
        await client.connect();

        return client.db(dbName);
      },
    },
  ],
  exports: [MONGO_PROVIDER],
})
export class MongoDBModule {}

export { MONGO_PROVIDER };
