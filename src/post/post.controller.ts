import { Controller, Post, UseInterceptors, UploadedFiles, Body, Request, UseGuards } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { getMulterMediaOptions} from '../utils/multer.utils';
import {AllowedMixEntensions} from '../utils/allowedExtensions.utils';
import { PostService } from './post.service';
import { CreatePostDto } from './post-dto/create-post.dto';
import { AuthGuard } from '../security/middleware/authGuard.middleware';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('create')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FilesInterceptor('media', 5, getMulterMediaOptions({ fileExtensions: AllowedMixEntensions }))
  )
  async createPost(
    @Request() req,
    @Body() createPostDto: CreatePostDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    console.log('User making request:', req.user); // Debugging

    if (!req.user || !req.user.id) {
      throw new Error('Unauthorized: User ID not found in request');
    }
    return this.postService.createPost(req.user.id, createPostDto, files);
  }
}
