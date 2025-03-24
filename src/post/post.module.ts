import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from '../models/post-entity/post.entity';
import { PostMediaEntity } from '../models/post-entity/postMedia.entity';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { AccessTokenEntity } from '../models/user-entity/accessToken.entity';
import { CustomLogger } from '../common/logger/custom-logger.service';
import { UserEntity } from '../models/user-entity/user.entity';
import { ReactionEntity } from '../models/post-entity/reaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity, PostMediaEntity, AccessTokenEntity, UserEntity, ReactionEntity])],
  controllers: [PostController],
  providers: [PostService, CustomLogger],
  exports: [PostService],
})
export class PostModule {}
