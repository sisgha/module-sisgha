import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class TableDBEvent1698604344961 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'db_event',

        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },

          //

          {
            name: 'correlation_id',
            type: 'text',
            isNullable: true,
          },

          {
            name: 'action',
            type: 'text',
            isNullable: false,
          },

          {
            name: 'table_name',
            type: 'text',
            isNullable: false,
          },

          {
            name: 'row_id',
            type: 'jsonb',
            isNullable: false,
          },

          {
            name: 'data',
            type: 'jsonb',
            isNullable: true,
          },

          {
            name: 'date_event',
            type: 'timestamptz',
            isNullable: false,
          },

          {
            name: 'log_id',
            type: 'uuid',
            isNullable: true,
          },

          //

          {
            name: 'date_created',
            type: 'timestamptz',
            default: 'now()',
            isNullable: false,
          },
        ],
      }),
    );

    await queryRunner.query(`
    CREATE FUNCTION db_event_from_t_history() RETURNS trigger AS $$
    BEGIN
        IF      NEW.operation = 'INSERT'
        THEN
            INSERT INTO db_event (log_id, correlation_id, action, table_name, row_id, data, date_event)
              VALUES (NEW.id, NEW.correlation_id, 'create', NEW.tabname, to_json(NEW.new_val->'id'), NEW.new_val, NEW.tstamp);
            RETURN NEW;
        ELSIF   NEW.operation = 'UPDATE'
        THEN
            INSERT INTO db_event (log_id, correlation_id, action, table_name, row_id, data, date_event)
              VALUES (NEW.id, NEW.correlation_id, 'update', NEW.tabname, to_json(NEW.new_val->'id'), NEW.new_val, NEW.tstamp);
            RETURN NEW;
        ELSIF   NEW.operation = 'DELETE'
        THEN
          INSERT INTO db_event (log_id, correlation_id, action, table_name, row_id, data, date_event)
            VALUES (NEW.id, NEW.correlation_id, 'delete', NEW.tabname, to_json(NEW.old_val->'id'), null, NEW.tstamp);
          RETURN NEW;
        END IF;
    END;
    $$ LANGUAGE 'plpgsql' SECURITY DEFINER;
`);

    await queryRunner.query(`
      CREATE TRIGGER logging_thistory_on_insert_to_db_event 
        AFTER INSERT ON logging.t_history FOR EACH ROW EXECUTE PROCEDURE 
        db_event_from_t_history();
    `);

    await queryRunner.query(`
    CREATE FUNCTION handle_db_event_insert() RETURNS trigger AS $$
    BEGIN
      NOTIFY "dbEvent";
      RETURN NULL;
    END;
    $$ LANGUAGE 'plpgsql' SECURITY DEFINER;
`);

    await queryRunner.query(`
      CREATE TRIGGER track_db_event_insert 
        AFTER INSERT ON db_event FOR EACH ROW EXECUTE PROCEDURE 
        handle_db_event_insert();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('db_event', true);
    await queryRunner.query('DROP FUNCTION IF EXISTS handle_db_event_insert CASCADE;');
    await queryRunner.query('DROP FUNCTION IF EXISTS db_event_from_t_history CASCADE;');
  }
}
