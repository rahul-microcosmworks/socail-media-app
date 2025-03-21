import { ArrayMaxSize, IsArray, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsOptional()
  @IsString()
  content?: string; // Content is optional since a post can be media-only

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(5, {message: 'maximum five content you select'})
  mediaUrls?: Array<string>; 
}
