package org.ftclub.cabinet.statistics.repository;

import java.util.List;
import javax.transaction.Transactional;
import org.ftclub.cabinet.cabinet.domain.Cabinet;
import org.ftclub.cabinet.cabinet.domain.CabinetStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
@Transactional
public interface StatisticsRepository extends JpaRepository<Cabinet, Long> {

	@Query("SELECT COUNT(*) FROM Cabinet c WHERE c.status = :status AND c.cabinetPlace.location.floor = :floor")
	Integer getCabinetsCountByStatus(@Param("floor") Integer floor,
			@Param("status") CabinetStatus status);

	@Query("SELECT c.cabinetId FROM Cabinet c WHERE (c.status = 'LIMITED_AVAILABLE' or c.status = 'AVAILABLE') AND c.cabinetPlace.location.floor = :floor")
	List<Long> getAvailableCabinetsId(@Param("floor") Integer floor);
}


