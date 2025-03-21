import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReactionEntity } from '../../models/post-entity/reaction.entity';
import { ReactionService } from './reaction.service';
import { ReactionController } from './reaction.controller';
import { PostEntity } from '../../models/post-entity/post.entity';
import { UserEntity } from '../../models/user-entity/user.entity';
import { CustomLogger } from '../../common/logger/custom-logger.service';
import { AccessTokenEntity } from '../../models/user-entity/accessToken.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReactionEntity, PostEntity, UserEntity, AccessTokenEntity])],
  controllers: [ReactionController],
  providers: [ReactionService, CustomLogger],
})
export class ReactionModule {}
