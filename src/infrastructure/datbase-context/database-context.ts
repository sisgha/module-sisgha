import { DataSource, EntityManager } from 'typeorm';
import { getDBEventRepository } from '../database/repositories/db_event.repository';

import { getCursoRepository } from '../database/repositories/curso.repository';
import { getModalidadeRepository } from '../database/repositories/modalidade.repository';

export class DatabaseContext {
  constructor(readonly ds: DataSource | EntityManager) {}

  static new(ds: DataSource | EntityManager) {
    return new DatabaseContext(ds);
  }

  get dbEventRepository() {
    return getDBEventRepository(this.ds);
  }

  get modalidadeRepository() {
    return getModalidadeRepository(this.ds);
  }

  get cursoRepository() {
    return getCursoRepository(this.ds);
  }
}
