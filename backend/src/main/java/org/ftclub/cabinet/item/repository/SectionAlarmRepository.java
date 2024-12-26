package org.ftclub.cabinet.item.repository;

import java.time.LocalDateTime;
import java.util.List;
import org.ftclub.cabinet.item.domain.SectionAlarm;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SectionAlarmRepository extends JpaRepository<SectionAlarm, Long> {


	@EntityGraph(attributePaths = {"cabinetPlace"})
	List<SectionAlarm> findAllByAlarmedAtIsNull();

	@Modifying(flushAutomatically = true, clearAutomatically = true)
	@Query("UPDATE SectionAlarm  s "
			+ "SET s.alarmedAt = :date "
			+ "WHERE s.id IN (:ids)")
	void updateAlarmedAtBulk(@Param("ids") List<Long> ids, @Param("date") LocalDateTime date);

	@Query("SELECT s "
			+ "FROM SectionAlarm s "
			+ "JOIN FETCH s.cabinetPlace "
			+ "WHERE s.userId = :userId "
			+ "AND s.alarmedAt IS NULL "
			+ "AND s.cabinetPlaceId in ("
			+ "     SELECT cp FROM CabinetPlace cp "
			+ "     WHERE cp.location.building = :building "
			+ "     AND cp.location.floor = :floor)")
	List<SectionAlarm> findAllByUserIdAndCabinetPlaceAndAlarmedAtIsNull(
			@Param("userId") Long userId,
			@Param("building") String building,
			@Param("floor") Integer floor);

	List<SectionAlarm> findAllByUserIdAndCabinetPlaceIdOrderByIdDesc(
			@Param("userId") Long userId,
			@Param("cabinetPlaceId") Long cabinetPlaceId);

}
