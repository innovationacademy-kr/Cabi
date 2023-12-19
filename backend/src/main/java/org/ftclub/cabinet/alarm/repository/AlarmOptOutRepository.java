package org.ftclub.cabinet.alarm.repository;

import java.util.List;
import org.ftclub.cabinet.user.domain.AlarmOptOut;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface AlarmOptOutRepository extends JpaRepository<AlarmOptOut, Long> {

	@Query("SELECT ao FROM AlarmOptOut ao WHERE ao.user.userId = :userId")
	List<AlarmOptOut> findAllByUserId(Long userId);

}
