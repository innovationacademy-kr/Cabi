package org.ftclub.cabinet.alarm.repository;

import io.lettuce.core.dynamic.annotation.Param;
import java.util.List;
import org.ftclub.cabinet.alarm.domain.AlarmType;
import org.ftclub.cabinet.user.domain.AlarmOptIn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface AlarmOptInRepository extends JpaRepository<AlarmOptIn, Long> {

	@Query("SELECT ao FROM AlarmOptIn ao WHERE ao.user.userId = :userId")
	List<AlarmOptIn> findAllByUserId(Long userId);

	@Modifying
	@Query("DELETE FROM AlarmOptIn ao WHERE ao.user.userId = :userId AND ao.alarmType = :alarmType")
	void deleteAlarmOptInByUserAndAlarmType(@Param("userId") Long userId,
			@Param("alarmType") AlarmType alarmType);

}
