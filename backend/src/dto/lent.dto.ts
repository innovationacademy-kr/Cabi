import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsDate, IsNumber, ValidateNested } from 'class-validator';
import { UserDto } from './user.dto';

/**
 * 기본적인 사물함 대여 정보
 */
export class LentDto {
  @ApiProperty({
    description: '대여 고유 ID',
    example: 1234,
  })
  @IsNumber()
  lent_id: number; // 대여 고유 ID

  @ApiProperty({
    description: '해당 사물함을 사용하고 있는 유저들',
    type: [UserDto],
  })
  @ValidateNested({each:true})
  users: UserDto[]; // 해당 사물함을 사용하고 있는 유저들

  @ApiProperty({
    description: '대여한 시간',
    example: '2022-08-24 13:03:03',
  })
  @IsDate()
  lent_time: Date; // 대여한 시간

  @ApiProperty({
    description: '대여한 시간',
    example: '2022-08-24 13:03:03',
  })
  @IsDate()
  expire_time: Date; // 만료 시간

  @ApiProperty({
    description: '연체 되었는지 아닌지의 여부',
    example: false,
  })
  @IsBoolean()
  is_expired: boolean; // 연체 되었는지 아닌지의 여부
}
