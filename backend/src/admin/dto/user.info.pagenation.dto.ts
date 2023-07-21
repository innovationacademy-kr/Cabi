import { ApiProperty } from '@nestjs/swagger';
import { UserInfoDto } from './user.info.dto';

export class UserInfoPagenationDto {
  @ApiProperty({
    description: '유저 정보 배열',
    type: [UserInfoDto],
  })
  result: UserInfoDto[]; // 유저 정보 배열

  @ApiProperty({
    description: 'DB에 저장된 총 결과의 길이',
    example: 42,
  })
  total_length: number; // DB에 저장된 총 결과의 길이
}
