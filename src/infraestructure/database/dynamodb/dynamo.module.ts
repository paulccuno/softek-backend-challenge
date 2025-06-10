import { Module, Provider } from '@nestjs/common';
import { IFusedCharacterRepository } from 'src/domain/repositories/fused-character.repository';
import { ICustomRepository } from 'src/domain/repositories/custom.repository';
import { IUserRepository } from 'src/domain/repositories/user.repository';
import { DynamoFusedCharacterRepository } from './repositories/dynamo-fused-character.repository';
import { DynamoCustomRepostory } from './repositories/dynamo-custom.repository';
import { DynamoUserRepository } from './repositories/dynamo-user.repository';
import { DynamoDBService } from './dynamodb.service';

const providers: Provider[] = [
  DynamoDBService,
  {
    provide: IFusedCharacterRepository,
    useClass: DynamoFusedCharacterRepository,
  },
  {
    provide: ICustomRepository,
    useClass: DynamoCustomRepostory,
  },
  {
    provide: IUserRepository,
    useClass: DynamoUserRepository,
  },
];

@Module({
  imports: [],
  controllers: [],
  providers: providers,
  exports: providers,
})
export class DynamoDBModule {}
