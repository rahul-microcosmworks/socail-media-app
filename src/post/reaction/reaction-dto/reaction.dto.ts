import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

export enum ReactionType {
  LIKE = 'like',
  LOVE = 'love',
  LAUGH = 'laugh',
  ANGRY = 'angry',
  SAD = 'sad',
}

export class ReactionDto {
  @IsNotEmpty()
  @IsNumber()
  postId: number;

  @IsNotEmpty()
  @IsEnum(ReactionType, { message: 'Invalid reaction type' })
  type: ReactionType;
}
