import { Module, Provider } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { IFusedCharacterRepository } from 'src/domain/repositories/fused-character.repository';
import { PrismaFusedCharactedRepository } from './repositories/prisma-fused-character.repository';
import { ICustomRepository } from 'src/domain/repositories/custom.repository';
import { PrismaCustomRepostory } from './repositories/prisma-custom.repository';

const providers: Provider[] = [
  PrismaService,
  {
    provide: IFusedCharacterRepository,
    useClass: PrismaFusedCharactedRepository,
  },
  {
    provide: ICustomRepository,
    useClass: PrismaCustomRepostory,
  },
];

@Module({
  imports: [],
  controllers: [],
  providers: providers,
  exports: providers,
})
export class PrismaModule {}
