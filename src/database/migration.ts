import { Knex } from 'knex';
import { connection } from './connection';
import { createTopicMigration } from './migrations/topic.migration';

export interface TableMigration {
  tableName: string;
  columns: (table: Knex.TableBuilder) => void;
}

export async function runMigration() {
  const migrations: TableMigration[] = [createTopicMigration()];

  for (const migration of migrations) {
    await connection.schema.createTable(migration.tableName, migration.columns);
  }
}
