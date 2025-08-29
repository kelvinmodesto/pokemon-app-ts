import { Module, Global } from '@nestjs/common';
import { MongoClient } from 'mongodb';

const MONGO_PROVIDER = 'MONGO_CONNECTION';

@Global()
@Module({
  providers: [
    {
      provide: MONGO_PROVIDER,
      useFactory: async () => {
        const client = new MongoClient('mongodb://localhost:27017');
        await client.connect();
        return client.db('nest_demo');
      },
    },
  ],
  exports: [MONGO_PROVIDER],
})
export class MongoDBModule {}
