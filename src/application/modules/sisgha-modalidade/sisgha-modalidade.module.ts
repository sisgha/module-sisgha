import { Module } from '@nestjs/common';
import { SisghaModalidadeResolver } from './adapters/graphql/sisgha-modalidade.resolver';
import { SisghaModalidadeService } from './sisgha-modalidade.service';

@Module({
  imports: [
    // ...
  ],
  exports: [
    // ...
    SisghaModalidadeService,
  ],
  providers: [
    // ...
    SisghaModalidadeService,
    SisghaModalidadeResolver,
  ],
})
export class SisghaModalidadeModule {}
