import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * 유저의 기본적인 정보를 저장
 */
export class UserDto {
  @ApiProperty({
    description: '42 고유 ID',
    example: 12345,
  })
  user_id: number; // 42 고유 ID

  @ApiProperty({
    description: '42 로그인 ID',
    example: 'joopark',
  })
  intra_id: string; // 42 로그인 ID

  @ApiPropertyOptional({
    description: '42 이메일 ID (확장성을 위해 옵셔널 필드로 지정)',
    example: 'joopark@student.42seoul.kr',
  })
  email?: string; // 42 이메일 ID (확장성을 위해 옵셔널 필드로 지정)
}
