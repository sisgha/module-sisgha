import { SisghaCursoModel } from '@sisgea/spec';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ModalidadeDbEntity } from './modalidade.db.entity';

@Entity('curso')
export class CursoDbEntity implements SisghaCursoModel {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: string;

  // ...

  @Column({ name: 'nome', nullable: false, type: 'text' })
  nome!: string;

  @Column({ name: 'nome_abreviado', nullable: false, type: 'text' })
  nomeAbreviado!: string;

  // ...

  @CreateDateColumn({ name: 'date_created', type: 'timestamptz', nullable: false })
  dateCreated!: Date;

  @UpdateDateColumn({ name: 'date_updated', type: 'timestamptz', nullable: false })
  dateUpdated!: Date;

  @Column({ name: 'date_deleted', type: 'timestamptz', nullable: true })
  dateDeleted!: Date | null;

  // ...

  @ManyToOne(() => ModalidadeDbEntity)
  @JoinColumn({ name: 'id_modalidade_fk' })
  modalidade!: ModalidadeDbEntity;
}
