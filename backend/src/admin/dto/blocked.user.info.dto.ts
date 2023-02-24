import { ApiProperty } from '@nestjs/swagger';

export class BlockedUserInfoDto {
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

  @ApiProperty({
    description: '차단당한 시간',
    example: new Date(),
  })
<<<<<<< HEAD
  banned_date?: Date; // 차단당한 시간
=======
  location: string;
>>>>>>> f7d890132cc803845ae972d38cecc978501b923c

  @ApiProperty({
    description: '차단 풀리는 시간',
    example: new Date(),
  })
<<<<<<< HEAD
  unbanned_date?: Date; // 차단 풀리는 시간
=======
  overdueDays: number;

>>>>>>> f7d890132cc803845ae972d38cecc978501b923c
}
