package org.ftclub.cabinet.statistics.repository;

import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.ftclub.cabinet.dto.CabinetFloorStatisticsResponseDto;
import org.hibernate.mapping.Table;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Repository
@Transactional
public interface StatisticsRepository extends JpaRepository<Cabinet, Long> {

    @Query("SELECT COUNT(*) FROM cabinet c WHERE c.cabinet_status = status && c.floor = floor")
    Integer getCabinetsCountByStatus(Integer floor, CabinetStatus status);

    @Query("SELECT cabinet_id FROM cabinet c WHERE c.cabinet_status = \"SET_EXPIRE_AVAILABLE\" or c.cabinet_status = \"AVAILABLE\"")
    List<Long> getAvailableCabinetsId();

    @Query("SELECT lent_time FROM lent")
    List<Date> getLents();

    @Query("SELECT return_time FROM lent_log")
    List<Date> getReturns();

    @Query("SELECT banned_date FROM ban_log")
    Date getBannedAt(Pageable pageable);

    @Query("SELECT unbanned_date FROM ban_log")
    Date getUnbannedAt(Pageable pageable);

    @Query("SELECT ban_user_id, banned_date, unbanned_date FROM ban_log")
    Page<Object[]> getUsersBannedInfo(Pageable pageable);

    @Query("SELECT cabinet_id, location FROM cabinet WHERE cabinet_status = \"EXPIRED\"")
    Page<Object[]> getOverdueUsers(Pageable pageable);

    @Query("SELECT lent_user_id FROM lent l WHERE l.lent_cabinet_id = cabinetId")
    Long getUserIdByCabinetId(Long cabinetId);

    @Query("SELECT expire_time FROM lent l WHERE l.lent_cabinet_id = cabinetId")
    Date getExpiredDateByCabinetId(Long cabinetId);
}


