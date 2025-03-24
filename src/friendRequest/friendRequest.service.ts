import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FriendRequestEntity, FriendRequestStatus } from '../models/friend-entity/friendRequest.entity';
import { UserEntity } from '../models/user-entity/user.entity';
import { SendFriendRequestDto } from './dto/send-friendRequest.dto';
import { RespondFriendRequestDto } from './dto/respond-friendRequest.dto';

@Injectable()
export class FriendRequestService {
  constructor(
    @InjectRepository(FriendRequestEntity)
    private friendRequestRepository: Repository<FriendRequestEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async sendFriendRequest(senderId: number, sendFriendRequestDto: SendFriendRequestDto) {
    const { receiverId } = sendFriendRequestDto;

    if (senderId === receiverId) {
      throw new BadRequestException('You cannot send a friend request to yourself.');
    }
  
    // Check for existing friend requests
    const existingRequest = await this.friendRequestRepository.findOne({
      where: [
        { sender: { id: senderId }, receiver: { id: receiverId } },
        { sender: { id: receiverId }, receiver: { id: senderId } },
      ],
    });
  
    // If a request already exists
      if (existingRequest) {
        if (existingRequest.status === FriendRequestStatus.PENDING) {
          // return await existingRequest.updatedAt('cancel')
          existingRequest.status = FriendRequestStatus.CANCELLED;
          existingRequest.updatedAt = new Date(); // Update timestamp
          await this.friendRequestRepository.save(existingRequest);
          return { message: 'Friend request cancelled successfully.' };
        } 
        
        // else if (existingRequest.status === FriendRequestStatus.ACCEPTED) {
        //   throw new BadRequestException('You are already friends.');
        // } else if (existingRequest.status === FriendRequestStatus.REJECTED) {
        //   // If previously rejected, allow sending a new request by deleting the old one
        //   await this.friendRequestRepository.remove(existingRequest);
        // }
      }
  
    // Create new friend request
    const friendRequest = this.friendRequestRepository.create({
      sender: { id: senderId },
      receiver: { id: receiverId },
      status: FriendRequestStatus.PENDING,
    });
  
    await this.friendRequestRepository.save(friendRequest);
  
    return { message: 'Friend request sent successfully.' };
  }
  
  async respondToFriendRequest(userId: number, respondFriendRequestDto: RespondFriendRequestDto) {
    const { requestId, status } = respondFriendRequestDto;
  
    const friendRequest = await this.friendRequestRepository.findOne({
      where: { id: requestId },
      relations: ['sender', 'receiver'],
    });
  
    if (!friendRequest) {
      throw new NotFoundException('Friend request not found.');
    }
  
    if (friendRequest.receiver.id !== userId) {
      throw new BadRequestException('You are not authorized to respond to this friend request.');
    }
  
    if (friendRequest.status === FriendRequestStatus.ACCEPTED) {
      throw new BadRequestException('This friend request has already been accepted.');
    }
  
    friendRequest.status = status as FriendRequestStatus;
    await this.friendRequestRepository.save(friendRequest);
  
    return { message: `Friend request ${status} successfully.` };
  }
  
  async getPendingRequests(userId: number) {
    return this.friendRequestRepository.find({
      where: { receiver: { id: userId }, status: FriendRequestStatus.PENDING },
      relations: ['sender'],
    });
  }
}
