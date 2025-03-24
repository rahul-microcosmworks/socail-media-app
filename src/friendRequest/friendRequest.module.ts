import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendRequestEntity } from '../models/friend-entity/friendRequest.entity';
import { FriendRequestService } from './friendRequest.service';
import { FriendRequestController } from './friendRequest.controller';
import { UserEntity } from '../models/user-entity/user.entity';
import { AccessTokenEntity } from 'src/models/user-entity';
import { CustomLogger } from 'src/common/logger/custom-logger.service';

@Module({
  imports: [TypeOrmModule.forFeature([FriendRequestEntity, UserEntity ,AccessTokenEntity])],
  controllers: [FriendRequestController],
  providers: [FriendRequestService, CustomLogger],
})
export class FriendRequestModule {}
