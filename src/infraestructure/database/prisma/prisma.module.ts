import { Module, Provider } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { IFusedCharacterRepository } from 'src/domain/repositories/fused-character.repository';
import { PrismaFusedCharactedRepository } from '../../database/prisma/repositories/prisma-fused-character.repository';
import { ICustomRepository } from 'src/domain/repositories/custom.repository';
import { PrismaCustomRepostory } from '../../database/prisma/repositories/prisma-custom.repository';
import { PrismaUserRepository } from './repositories/prisma-user.repository';
import { IUserRepository } from 'src/domain/repositories/user.repository';

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
  {
    provide: IUserRepository,
    useClass: PrismaUserRepository,
  },
];

@Module({
  imports: [],
  controllers: [],
  providers: providers,
  exports: providers,
})
export class PrismaModule {}
