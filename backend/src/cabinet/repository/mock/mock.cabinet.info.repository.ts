import { Injectable } from "@nestjs/common";
import { ICabinetInfoRepository } from "src/cabinet/repository/cabinet.info.interface.repository";
import { LentDto } from "src/dto/lent.dto";
import CabinetStatusType from "src/enums/cabinet.status.type.enum";
import LentType from "src/enums/lent.type.enum";

@Injectable()
export class MockCabinetInfoRepository implements ICabinetInfoRepository {
    MockCabinetInfoEntity: any[] = [];
    MockLentEntity: any[] = [];

    constructor () {
        this.MockCabinetInfoEntity.push({
            cabinet_id: 1,
            cabinet_num: 100,
            location: '새롬관',
            floor: 1,
            section: 'Oasis',
            cabinet_status: CabinetStatusType.AVAILABLE,
            lent_type: LentType.CIRCLE,
            max_user: 1,
            min_user: 0,
            title: 'Cabi팀 최고1',
            status_note: '난 너를 믿었던 만큼 난 내 친구도 믿었기에',
        });
        this.MockCabinetInfoEntity.push({
            cabinet_id: 2,
            cabinet_num: 42,
            location: '마루관',
            floor: 2,
            section: 'Terrace',
            cabinet_status: CabinetStatusType.BROKEN,
            lent_type: LentType.PRIVATE,
            max_user: 1,
            min_user: 0,
            title: 'Cabi팀 최고2',
            status_note: '난 너를 믿었던 만큼 난 내 친구도 믿었기에',
        });
        this.MockCabinetInfoEntity.push({
            cabinet_id: 3,
            cabinet_num: 84,
            location: '강민관',
            floor: 3,
            section: 'Universe',
            cabinet_status: CabinetStatusType.AVAILABLE,
            lent_type: LentType.SHARE,
            max_user: 3,
            min_user: 0,
            title: 'Cabi팀 최고3',
            status_note: '난 너를 믿었던 만큼 난 내 친구도 믿었기에',
        });
        this.MockCabinetInfoEntity.push({
            cabinet_id: 4,
            cabinet_num: 21,
            location: '새롬관',
            floor: 4,
            section: 'Cluster',
            cabinet_status: CabinetStatusType.BANNED,
            lent_type: LentType.PRIVATE,
            max_user: 1,
            min_user: 0,
            title: 'Cabi팀 최고4',
            status_note: '난 너를 믿었던 만큼 난 내 친구도 믿었기에',
        });
        //LentRepository를 Mocking 합니다.
        this.MockLentEntity.push({
            user_id: 131541,
            intra_id: 'sanan',
            lent_id: 1234,
            lent_time: '2023-01-13 19:00:00',
            expire_time: '2023-01-13 20:00:00',
            is_expired: false,
        });
        this.MockLentEntity.push({
            user_id: 131541,
            intra_id: 'sanan',
            lent_id: 4321,
            lent_time: '2023-01-13 19:00:00',
            expire_time: '2023-01-13 20:00:00',
            is_expired: true,
        });
        this.MockLentEntity.push({
            user_id: 424242,
            intra_id: 'eunbikim',
            lent_id: 1235,
            lent_time: '2023-01-13 20:00:00',
            expire_time: '2023-01-13 21:00:00',
            is_expired: false,
        });
        this.MockLentEntity.push({
            user_id: 424242,
            intra_id: 'eunbikim',
            lent_id: 5321,
            lent_time: '2023-01-13 20:00:00',
            expire_time: '2023-01-13 21:00:00',
            is_expired: true,
        });
    }

}