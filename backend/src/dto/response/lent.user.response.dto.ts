import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../user.dto';

/**
 * 유저 정보와 렌트 관련 정보
 * @extends UserDto
 */
export class UserLentResponseDto extends UserDto {
  @ApiProperty({
    description: '사물함 고유 ID (대여하지 않았을 경우 -1)',
    example: 123,
  })
  cabinet_id: number; // 사물함 ID
}
