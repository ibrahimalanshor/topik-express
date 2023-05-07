import knex, { Knex } from 'knex';
import { databaseConfig } from '../../config/database.config';

export function createConnection(): Knex {
  return knex({
    client: 'mysql2',
    connection: databaseConfig,
  });
}
