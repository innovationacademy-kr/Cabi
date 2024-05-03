package org.ftclub.cabinet.item.repository;

import java.util.List;
import org.ftclub.cabinet.item.domain.SectionAlarm;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SectionAlarmRepository extends JpaRepository<SectionAlarm, Long> {

	List<SectionAlarm> findAllByUserIdAndAlarmedAtIsNull(Long userId);

	@EntityGraph(attributePaths = {"cabinetPlace"})
	List<SectionAlarm> findAllByAlarmedAtIsNull();
}
