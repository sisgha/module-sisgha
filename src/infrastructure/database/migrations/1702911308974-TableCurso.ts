import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class TableCurso1702911308974 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'curso',

        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },

          // ...

          {
            name: 'nome',
            type: 'text',
            isNullable: false,
          },

          {
            name: 'nome_abreviado',
            type: 'text',
            isNullable: false,
          },

          {
            name: 'id_modalidade_fk',
            type: 'uuid',
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
        foreignKeys: [
          {
            name: 'FK_curso_modalidade',
            columnNames: ['id_modalidade_fk'],
            referencedTableName: 'modalidade',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );

    await queryRunner.query(`
    CREATE TRIGGER db_curso_change_date_updated 
      BEFORE UPDATE ON curso FOR EACH ROW EXECUTE PROCEDURE 
      update_date_updated_column();
  `);

    await queryRunner.query(`
    CREATE TRIGGER db_curso_track 
      AFTER INSERT OR UPDATE OR DELETE ON curso
      FOR EACH ROW EXECUTE PROCEDURE change_trigger();
  `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('curso', true, true);
  }
}
