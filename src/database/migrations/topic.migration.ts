import { Knex } from 'knex';
import { TableMigration } from '../migration';

export function createTopicMigration(): TableMigration {
  return {
    tableName: 'topics',
    columns: (table: Knex.TableBuilder) => {
      table.increments();
      table.string('name');
      table.timestamps(true, true);
    },
  };
}
