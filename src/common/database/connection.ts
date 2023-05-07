import knex, { Knex } from 'knex';

export function createConnection(): Knex {
  return knex({
    client: 'mysql2',
    connection: {
      host: 'localhost',
      port: 3306,
      user: 'ibrahimalanshor',
      password: '1br4h1mk3c3',
      database: 'topik',
    },
  });
}
