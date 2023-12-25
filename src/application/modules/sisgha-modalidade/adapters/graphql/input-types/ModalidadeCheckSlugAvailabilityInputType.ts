import { Field, ID, InputType } from '@nestjs/graphql';
import { IModalidadeCheckSlugAvailabilityInput } from '@sisgea/spec';

@InputType('ModalidadeCheckSlugAvailabilityInput')
export class ModalidadeCheckSlugAvailabilityInputType implements IModalidadeCheckSlugAvailabilityInput {
  @Field(() => String)
  slug!: string;

  @Field(() => ID, { nullable: true })
  modalidadeId!: string | null;
}
