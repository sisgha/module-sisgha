import { Module } from '@nestjs/common';
import { SisghaCursoResolver } from './adapters/graphql/sisgha-curso.resolver';
import { SisghaCursoService } from './sisgha-curso.service';
import { SisghaModalidadeModule } from '../sisgha-modalidade/sisgha-modalidade.module';

@Module({
  imports: [
    // ...
    SisghaModalidadeModule,
  ],
  exports: [
    // ...
    SisghaCursoService,
  ],
  providers: [
    // ...
    SisghaCursoService,
    SisghaCursoResolver,
  ],
})
export class SisghaCursoModule {}
