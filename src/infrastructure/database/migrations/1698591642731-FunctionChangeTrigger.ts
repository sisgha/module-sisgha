import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Special thanks for <https://www.cybertec-postgresql.com/en/tracking-changes-in-postgresql/>
 */

export class FunctionChangeTrigger1698591642731 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    CREATE FUNCTION change_trigger() RETURNS trigger AS $$
    BEGIN
        IF      TG_OP = 'INSERT'
        THEN
            INSERT INTO logging.t_history (tabname, schemaname, operation, new_val)
                VALUES (TG_RELNAME, TG_TABLE_SCHEMA, TG_OP, row_to_json(NEW));
                RETURN NEW;
        ELSIF   TG_OP = 'UPDATE'
        THEN
            INSERT INTO logging.t_history (tabname, schemaname, operation, new_val, old_val)
                VALUES (TG_RELNAME, TG_TABLE_SCHEMA, TG_OP,
                    row_to_json(NEW), row_to_json(OLD));
            RETURN NEW;
        ELSIF   TG_OP = 'DELETE'
        THEN
            INSERT INTO logging.t_history (tabname, schemaname, operation, old_val)
                VALUES (TG_RELNAME, TG_TABLE_SCHEMA, TG_OP, row_to_json(OLD));
            RETURN OLD;
        END IF;
    END;
    $$ LANGUAGE 'plpgsql' SECURITY DEFINER;
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP FUNCTION change_trigger;');
  }
}
