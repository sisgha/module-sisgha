export interface DBEvent<D = unknown> {
  id: string;

  // ...

  correlationId: string | null;
  action: string;
  tableName: string;
  rowId: unknown;
  data: D | null;
  dateEvent: Date;

  logId: string;

  // ...

  dateCreated: Date;

  //

  resource: string;
}
