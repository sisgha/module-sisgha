import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class TableModalidade1702911302712 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'modalidade',

        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },

          // ...

          {
            name: 'slug',
            type: 'text',
            isNullable: false,
          },

          {
            name: 'nome',
            type: 'text',
            isNullable: false,
          },

          // ...

          {
            name: 'date_created',
            type: 'timestamptz',
            default: 'now()',
            isNullable: false,
          },

          {
            name: 'date_updated',
            type: 'timestamptz',
            default: 'now()',
            isNullable: false,
          },

          {
            name: 'date_deleted',
            type: 'timestamptz',
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.query(`
    CREATE TRIGGER db_modalidade_change_date_updated 
      BEFORE UPDATE ON modalidade FOR EACH ROW EXECUTE PROCEDURE 
      update_date_updated_column();
  `);

    await queryRunner.query(`
    CREATE TRIGGER db_modalidade_track 
      AFTER INSERT OR UPDATE OR DELETE ON modalidade
      FOR EACH ROW EXECUTE PROCEDURE change_trigger();
  `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('modalidade', true);
  }
}
