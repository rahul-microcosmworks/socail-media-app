import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReactionEntity } from '../../models/post-entity/reaction.entity';
import { UserEntity } from '../../models/user-entity/user.entity';
import { PostEntity } from '../../models/post-entity/post.entity';
import { ReactionDto } from './reaction-dto/reaction.dto';

@Injectable()
export class ReactionService {
  constructor(
    @InjectRepository(ReactionEntity)
    private readonly reactionRepo: Repository<ReactionEntity>,

    @InjectRepository(PostEntity)
    private readonly postRepo: Repository<PostEntity>,
  ) {}

  async toggleReaction(user: UserEntity, reactionDto: ReactionDto) {
    const { postId, type } = reactionDto;

    // Check if post exists
    const post = await this.postRepo.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');

    // Find if user has already reacted to this post (including soft deleted ones)
    let existingReaction = await this.reactionRepo.findOne({
      where: { user: { id: user.id }, post: { id: postId } },
      relations: ['user', 'post'],
    });

    if (existingReaction) {
      if (existingReaction.type === type && !existingReaction.is_deleted) {
        // If the same reaction type is clicked again, soft delete it
        existingReaction.is_deleted = true;
        await this.reactionRepo.save(existingReaction);
        return { message: `${type} reaction removed` };
      } else {
        if (existingReaction.is_deleted) {
          // If previously deleted, reactivate it
          existingReaction.is_deleted = false;
          existingReaction.type = type; // Update reaction type if needed
          await this.reactionRepo.save(existingReaction);
          return { message: `Reaction restored as ${type}` };
        } else {
          // If switching reactions, update type and keep active
          existingReaction.type = type;
          await this.reactionRepo.save(existingReaction);
          return { message: `Reaction changed to ${type}` };
        }
      }
    } else {
      // If no reaction exists, create a new one
      const newReaction = this.reactionRepo.create({ user, post, type });
      await this.reactionRepo.save(newReaction);
      return { message: `${type} reaction added` };
    }
  }
}
