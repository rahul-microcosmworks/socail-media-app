import { Controller, Post, Body, Param, Get, UseGuards, Request } from '@nestjs/common';
import { FriendRequestService } from './friendRequest.service';
import { SendFriendRequestDto } from './dto/send-friendRequest.dto';
import { RespondFriendRequestDto } from './dto/respond-friendRequest.dto';
import { AuthGuard } from '../security/middleware/authGuard.middleware';

@Controller('friends')
@UseGuards(AuthGuard)
export class FriendRequestController {
  constructor(private readonly friendRequestService: FriendRequestService) {}

  @Post('send')
  sendFriendRequest(@Request() req, @Body() sendFriendRequestDto: SendFriendRequestDto) {
    return this.friendRequestService.sendFriendRequest(req.user.id, sendFriendRequestDto);
  }

  @Post('respond')
  respondToFriendRequest(@Request() req, @Body() respondFriendRequestDto: RespondFriendRequestDto) {
    return this.friendRequestService.respondToFriendRequest(req.user.id, respondFriendRequestDto);
  }

  @Get('pending')
  getPendingRequests(@Request() req) {
    return this.friendRequestService.getPendingRequests(req.user.id);
  }
}
