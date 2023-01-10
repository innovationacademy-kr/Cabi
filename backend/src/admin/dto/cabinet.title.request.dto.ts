import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CabinetTitleRequestDto {
  @ApiProperty({
    description: '사물함의 title',
  })
  @IsString()
  title: string;
}
