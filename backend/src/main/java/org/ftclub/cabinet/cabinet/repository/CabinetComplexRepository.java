package org.ftclub.cabinet.cabinet.repository;

import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetPlace;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.dto.ActiveCabinetInfoEntities;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.utils.annotations.ComplexRepository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 사물함의 복잡한 쿼리를 처리하는 인터페이스입니다.
 * 어떤 Entity를 같이 조회하는지 어노테이션으로 표시합니다.
 */
@ComplexRepository(entityClass = {Cabinet.class, CabinetPlace.class, LentHistory.class, User.class})
public interface CabinetComplexRepository {

    /**
     * 해당 건물, 층에 해당하는 현재 대여중인 사물함의 정보를 반환합니다.
     *
     * @param building
     * @param floor
     * @return
     */
    List<ActiveCabinetInfoEntities> findCabinetsActiveLentHistoriesByBuildingAndFloor(
            String building, Integer floor);

    /**
     * 사물함 상태의 사물함 중 endedAt 이전에 대여기간이 만료되는 사물함을 가져온다.
     *
     * @param cabinetStatus
     * @param endedAt
     * @return
     */
    List<Cabinet> findAllCabinetsByCabinetStatusAndBeforeEndedAt(CabinetStatus cabinetStatus,
                                                                 LocalDateTime endedAt);
}
