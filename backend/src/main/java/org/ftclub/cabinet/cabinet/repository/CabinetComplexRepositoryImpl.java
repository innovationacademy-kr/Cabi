package org.ftclub.cabinet.cabinet.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.dto.ActiveCabinetInfoEntities;
import org.ftclub.cabinet.dto.QActiveCabinetInfoEntities;

import java.time.LocalDateTime;
import java.util.List;

import static org.ftclub.cabinet.cabinet.domain.QCabinet.cabinet;
import static org.ftclub.cabinet.cabinet.domain.QCabinetPlace.cabinetPlace;
import static org.ftclub.cabinet.lent.domain.QLentHistory.lentHistory;
import static org.ftclub.cabinet.user.domain.QUser.user;

@RequiredArgsConstructor
public class CabinetComplexRepositoryImpl implements CabinetComplexRepository {

    private final JPAQueryFactory queryFactory;

    /**
     * 해당 건물의 층에 해당하는 현재 대여중인 사물함의 정보를 반환합니다.
     *
     * @param building 건물 이름
     * @param floor    층
     * @return
     */
    @Override
    public List<ActiveCabinetInfoEntities> findCabinetsActiveLentHistoriesByBuildingAndFloor(
            String building, Integer floor) {
        return queryFactory.selectDistinct(
                        new QActiveCabinetInfoEntities(cabinet, lentHistory, user))
                .from(cabinet)
                .join(cabinetPlace)
                .on(cabinet.cabinetPlace.id.eq(cabinetPlace.id))
                .join(lentHistory)
                .on(cabinet.id.eq(lentHistory.cabinet.id))
                .join(user)
                .on(lentHistory.user.id.eq(user.id))
                .where(cabinetPlace.location.building
                        .eq(building)
                        .and(cabinetPlace.location.floor.eq(floor))
                        .and(lentHistory.endedAt.isNull())
                )
                .fetch();
    }

    /**
     * 사물함 상태의 사물함 중 currentDate 이전에 대여기간이 만료되는 사물함을 가져온다.
     *
     * @param cabinetStatus
     * @param currentDate
     * @return
     */
    @Override
    public List<Cabinet> findAllCabinetsByCabinetStatusAndBeforeEndedAt(CabinetStatus cabinetStatus,
                                                                        LocalDateTime currentDate) {
        return queryFactory.selectFrom(cabinet)
                .join(lentHistory)
                .on(cabinet.id.eq(lentHistory.cabinet.id))
                .where(cabinet.status.eq(cabinetStatus)
                        .and(lentHistory.endedAt
                                .before(currentDate)
                        )
                ).fetch();
    }
}
