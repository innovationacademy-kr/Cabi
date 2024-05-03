package org.ftclub.cabinet.item.repository;

import java.time.LocalDateTime;
import java.util.List;
import org.ftclub.cabinet.item.domain.SectionAlarm;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface SectionAlarmRepository extends JpaRepository<SectionAlarm, Long> {

	List<SectionAlarm> findAllByUserIdAndAlarmedAtIsNull(Long userId);

	@EntityGraph(attributePaths = {"cabinetPlace"})
	List<SectionAlarm> findAllByAlarmedAtIsNull();

	@Modifying(flushAutomatically = true, clearAutomatically = true)
	@Query("UPDATE SectionAlarm  s "
			+ "SET s.alarmedAt = :date "
			+ "WHERE s.id IN (:ids)")
	void updateAlarmedAtBulk(List<Long> ids, LocalDateTime date);
}
