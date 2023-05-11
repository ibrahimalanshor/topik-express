import { Knex } from 'knex';
import { TableMigration } from '../migration';

export function createChatMigration(): TableMigration {
  return {
    tableName: 'chats',
    columns: (table: Knex.TableBuilder) => {
      table.increments();
      table.string('content');
      table.integer('topic_id').unsigned();
      table.foreign('topic_id').references('topics.id').onDelete('SET NULL');
      table.timestamps(true, true);
    },
  };
}
