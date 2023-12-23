import { DataSource, EntityManager } from 'typeorm';
import { DBEventDbEntity } from '../entities/db_event.db.entity';

export type IDBEventRepository = ReturnType<typeof getDBEventRepository>;

export const getDBEventRepository = (dataSource: DataSource | EntityManager) => dataSource.getRepository(DBEventDbEntity).extend({});
