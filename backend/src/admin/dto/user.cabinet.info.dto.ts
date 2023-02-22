import { ApiProperty } from '@nestjs/swagger';
import LentType from 'src/enums/lent.type.enum';
import CabinetStatusType from 'src/enums/cabinet.status.type.enum';
import { CabinetLocationFloorDto } from './cabinet.location.floor.dto';
import { BlockedUserInfoDto } from './blocked.user.info.dto';

export class UserCabinetInfoDto {
  @ApiProperty({
    description: '유저 정보 배열',
    example: [
      {
        user_id: 1,
        intra_id: 'sichoi',
        banned_date: '2023-02-19T00:00:00.000Z',
        unbanned_date: '2023-02-21T00:00:00.000Z',
      },
      {
        user_id: 2,
        intra_id: 'sichoi2',
      },
      {
        user_id: 3,
        intra_id: 'sichoi3',
        banned_date: '2023-02-19T00:00:00.000Z',
        unbanned_date: '2023-02-21T00:00:00.000Z',
      },
    ] as BlockedUserInfoDto[],
  })
  userInfo?: BlockedUserInfoDto[];

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
      location: '새롬관',
      floor: 2,
      lent_info: [
        {
          user_id: 1,
          intra_id: 'sichoi',
          lent_id: 1,
          lent_time: '2022-08-24T13:03:03.000Z',
          expire_time: '2022-08-24T13:03:03.000Z',
        },
        {
          user_id: 4,
          intra_id: 'sanan',
          lent_id: 2,
          lent_time: '2022-08-24T13:03:03.000Z',
          expire_time: '2022-08-24T13:03:03.000Z',
        },
        {
          user_id: 5,
          intra_id: 'eunbikim',
          lent_id: 3,
          lent_time: '2022-08-24T13:03:03.000Z',
          expire_time: '2022-08-24T13:03:03.000Z',
        },
      ],
    },
  })
  cabinetInfo?: CabinetLocationFloorDto;
}
