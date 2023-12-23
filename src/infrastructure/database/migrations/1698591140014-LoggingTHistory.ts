import { MigrationInterface, QueryRunner, Table } from 'typeorm';

/**
 * Special thanks for <https://www.cybertec-postgresql.com/en/tracking-changes-in-postgresql/>
 */

export class LoggingTHistory1698591140014 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createSchema('logging');

    await queryRunner.createTable(
      new Table({
        schema: 'logging',

        name: 't_history',

        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },

          {
            name: 'tstamp',
            type: 'timestamptz',
            default: 'now()',
            isNullable: false,
          },

          {
            name: 'correlation_id',
            type: 'text',
            isNullable: true,
          },

          // ...

          {
            name: 'schemaname',
            type: 'text',
            isNullable: false,
          },

          {
            name: 'tabname',
            type: 'text',
            isNullable: false,
          },

          {
            name: 'operation',
            type: 'text',
            isNullable: false,
          },

          {
            name: 'who',
            type: 'text',
            isNullable: false,
            default: 'current_user',
          },

          {
            name: 'new_val',
            type: 'jsonb',
            isNullable: true,
          },

          {
            name: 'old_val',
            type: 'jsonb',
            isNullable: true,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const t_history = await queryRunner.getTable('logging.t_history');

    t_history && (await queryRunner.dropTable(t_history, true));

    await queryRunner.dropSchema('logging', true, true);
  }
}
