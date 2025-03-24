import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

export class RespondFriendRequestDto {
  @IsNotEmpty()
  @IsNumber()
  requestId: number;

  @IsEnum(['accepted', 'rejected'])
  status: 'accepted' | 'rejected';
}
