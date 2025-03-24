import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from '../models/post-entity/post.entity';
import { PostMediaEntity } from '../models/post-entity/postMedia.entity';
import * as fs from 'fs';
import * as path from 'path';
import { CreatePostDto } from './post-dto/create-post.dto';
import { ReactionEntity } from '../models/post-entity/reaction.entity';
import { UserEntity } from '../models/user-entity/user.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(PostMediaEntity)
    private readonly mediaRepository: Repository<PostMediaEntity>,
    @InjectRepository(ReactionEntity)
    private readonly reactionRepository: Repository<ReactionEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createPost(userId: number, createPostDto: CreatePostDto, files: Express.Multer.File[]) {
    // Step 1: Create the post
    const post = this.postRepository.create({
      user: { id: userId },
      content: createPostDto.content || '',
    });
    await this.postRepository.save(post);
  
    let mediaEntities = [];

    if (files && files.length > 0) {
      const uploadDir = path.join(__dirname, '..', '..', 'uploads', 'posts');

      // Ensure uploads directory exists
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      mediaEntities = files.map(file => {
        const uniqueFilename = `${Date.now()}-${file.originalname}`;
        const filePath = path.join(uploadDir, uniqueFilename);
        
        // Save file to disk
        fs.writeFileSync(filePath, file.buffer);

        return this.mediaRepository.create({
          post,
          media_url: `/uploads/posts/${uniqueFilename}`,
          media_type: file.mimetype.startsWith('image') ? 'image' : 'video',
        });
      });

      await this.mediaRepository.save(mediaEntities);
    }
  
    return {
      message: 'Post created successfully',
      post: {
        id: post.id,
        content: post.content,
        user: { id: userId },
        media: mediaEntities.map(media => ({
          media_url: media.media_url,
          media_type: media.media_type,
        })),
      },
    };
  }

  async deletePost(postId: number){
    const post = await this.postRepository.findOne({
      where: {id: postId, is_deleted: false}
    })
    
    if(!post){
      throw new BadRequestException('Post Not Found');
    }

    // post
    post.is_deleted = true;
    await this.postRepository.save(post);

    await this.reactionRepository.update(
      {post: {id: postId}},
      {is_deleted: true}
    );
    
    return{
      message: 'Post Deleted Successfully'
    };
  }


  
  async getUserPostsWithReactions(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId, isDeleted: false },
      relations: ['posts'],
    });

    if (!user) {
      throw new Error('User not found');
    }

    const posts = await this.postRepository.find({
      where: { user: { id: userId }, is_deleted: false },
      relations: ['media'],
    });

    const postDetails = await Promise.all(
      posts.map(async (post) => {
        const reactions = await this.reactionRepository.find({
          where: { post: { id: post.id }, is_deleted: false },
        });

        const reactionCount = {
          like: 0,
          love: 0,
          laugh: 0,
          angry: 0,
          sad: 0,
        };

        reactions.forEach((reaction) => {
          if (reaction.type in reactionCount) {
            reactionCount[reaction.type]++;
          }
        });

        return {
          id: post.id,
          content: post.content,
          created_at: post.created_at,
          media: post.media.map((m) => ({
            media_url: m.media_url,
            media_type: m.media_type,
          })),
          totalReactions: reactions.length,
          reactionCount,
        };
      })
    );

    // const totalReactionSummary = postDetails.reduce(
    //   (acc, post) => {
    //     Object.keys(post.reactionCount).forEach((key) => {
    //       acc[key] += post.reactionCount[key];
    //     });
    //     return acc;
    //   },
    //   { like: 0, love: 0, laugh: 0, angry: 0, sad: 0 }
    // );

    return {
      totalPosts: postDetails.length,
      posts: postDetails,
      // totalReactions: totalReactionSummary,
    };
  }
}
