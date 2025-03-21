import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from '../models/post-entity/post.entity';
import { PostMediaEntity } from '../models/post-entity/postMedia.entity';
import * as fs from 'fs';
import * as path from 'path';
import { CreatePostDto } from './post-dto/create-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(PostMediaEntity)
    private readonly mediaRepository: Repository<PostMediaEntity>,
  ) {}

  async createPost(userId: number, createPostDto: CreatePostDto, files: Express.Multer.File[]) {
    const post = this.postRepository.create({
      user: { id: userId },
      content: createPostDto.content || '',
    });
    await this.postRepository.save(post);
  
    if (files && files.length > 0) {
      const mediaEntities = files.map(file => {
        return this.mediaRepository.create({
          post,
          media_url: `/uploads/posts/${Date.now()}-${file.originalname}`,
          media_type: file.mimetype.startsWith('image') ? 'image' : 'video',
        });
      });
  
      await this.mediaRepository.save(mediaEntities);
    }
  
    return { message: 'Post created successfully', post };
  }  
}
