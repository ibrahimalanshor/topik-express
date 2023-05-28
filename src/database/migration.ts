import { Knex } from 'knex';
import { connection } from './connection';
import { createTopicMigration } from './migrations/topic.migration';
import { createChatMigration } from './migrations/chat.migration';

export interface TableMigration {
  tableName: string;
  columns: (table: Knex.TableBuilder) => void;
}

export async function runMigration() {
  const migrations: TableMigration[] = [
    createTopicMigration(),
    createChatMigration(),
  ];

  for (const migration of [...migrations].reverse()) {
    await connection.schema.dropTableIfExists(migration.tableName);
  }

  for (const migration of migrations) {
    await connection.schema.createTable(migration.tableName, migration.columns);
  }
}
