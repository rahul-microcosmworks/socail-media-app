import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ReactionService } from './reaction.service';
import { ReactionDto } from './reaction-dto/reaction.dto';
import { AuthGuard } from '../../security/middleware/authGuard.middleware';

@Controller('reactions')
export class ReactionController {
  constructor(private readonly reactionService: ReactionService) {}

  @Post('toggle')
  @UseGuards(AuthGuard)
  async toggleReaction(@Request() req, @Body() reactionDto: ReactionDto) {
    return this.reactionService.toggleReaction(req.user, reactionDto);
  }
}
