import Knex from 'knex';
//criar a tabela
export async function up(knex: Knex) {
  return knex.schema.createTable('point_items', (table) => {
    table.increments('id').primary();
    table.string('point_id').notNullable().references('id').inTable('points');
    table.string('item_id').notNullable().references('id').inTable('items');
  });
}
//deleta a tabela
export async function down(knex: Knex) {
  return knex.schema.dropTable('point');
}
