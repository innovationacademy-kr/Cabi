import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CabinetStatusNoteRequestDto {
  @ApiProperty({
    description: '사물함의 status_note',
  })
  @IsString()
  status_note: string;
}
