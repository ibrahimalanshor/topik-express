import { Knex } from 'knex';

export const databaseConfig: Knex.MySql2ConnectionConfig = {
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  port: +(process.env.DATABASE_PORT || 3306),
};
