import { SisgeaDbEventModel } from '@sisgea/spec';
import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import { getAppResourceTableName } from '../../../application/modules/sisgha-app-resources';

@Entity('db_event')
export class DBEventDbEntity<D = unknown> implements SisgeaDbEventModel<D> {
  @PrimaryColumn({ name: 'id', type: 'uuid' })
  id!: string;

  // ...

  @Column({ name: 'correlation_id', nullable: true, type: 'text' })
  correlationId!: string | null;

  @Column({ name: 'action', nullable: false, type: 'text' })
  action!: string;

  @Column({ name: 'table_name', nullable: false, type: 'text' })
  tableName!: string;

  @Column({ name: 'row_id', nullable: true, type: 'jsonb' })
  rowId!: unknown | null;

  @Column({ name: 'data', nullable: true, type: 'jsonb' })
  data!: D | null;

  @CreateDateColumn({ name: 'date_event', type: 'timestamptz', nullable: false })
  dateEvent!: Date;

  @Column({ name: 'log_id', nullable: false, type: 'uuid' })
  logId!: string;

  // ...

  @CreateDateColumn({ name: 'date_created', type: 'timestamptz', nullable: false })
  dateCreated!: Date;

  //

  resource!: string;

  constructor() {
    Object.defineProperty(this, 'resource', {
      enumerable: true,
      get: function () {
        return getAppResourceTableName(this.tableName) ?? this.tableName;
      },
    });
  }
}
