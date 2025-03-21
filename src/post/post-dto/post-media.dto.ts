import { IsString, IsNotEmpty } from 'class-validator';

export class PostMediaDto {
  @IsString()
  @IsNotEmpty()
  media_url: string;
}
