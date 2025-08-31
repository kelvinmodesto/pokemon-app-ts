db = db.getSiblingDB(process.env.MONGODB_DB_NAME || 'pokemon_center');

db.createUser({
  user: process.env.MONGODB_USERNAME || 'pokemon_user',
  pwd: process.env.MONGODB_PASSWORD || 'pokemon_pass',
  roles: [
    {
      role: 'readWrite',
      db: process.env.MONGODB_DB_NAME || 'pokemon_center'
    }
  ]
});

db.createCollection('pokemons');

db.pokemons.createIndex({ id: 1 }, { unique: true });
db.pokemons.createIndex({ name: 1 });
db.pokemons.createIndex({ 'types.type.name': 1 });
db.pokemons.createIndex({ 'abilities.ability.name': 1 });

print('Database initialized with user and indexes created');
