import { UserDto } from 'src/dto/user.dto';
import { CabinetDto } from './cabinet.dto';
import { ApiProperty } from '@nestjs/swagger';
import LentType from 'src/enums/lent.type.enum';
import CabinetStatusType from 'src/enums/cabinet.status.type.enum';

export class UserCabinetInfoDto {
  @ApiProperty({
    description: '유저 정보 배열',
    example: [
      {
        user_id: 1,
        intra_id: 'sichoi',
      },
      {
        user_id: 2,
        intra_id: 'sanan',
      },
      {
        user_id: 3,
        intra_id: 'eunbikim',
      },
    ],
  })
  userInfo?: UserDto[];

  @ApiProperty({
    description: '해당 유저들이 대여중인 사물함 정보',
    example: {
      cabinet_id: 1,
      cabinet_num: 81,
      lent_type: LentType.SHARE,
      cabinet_title: '푸주와 아이들이 사용하는 사물함입니다',
      max_user: 3,
      status: CabinetStatusType.SET_EXPIRE_FULL,
      section: 'Oasis',
    },
  })
  cabinetInfo?: CabinetDto;
}
