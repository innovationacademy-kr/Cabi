package org.ftclub.cabinet.alarm.repository;

import io.lettuce.core.dynamic.annotation.Param;
import java.util.Optional;
import org.ftclub.cabinet.user.domain.AlarmStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface AlarmStatusRepository extends JpaRepository<AlarmStatus, Long> {

	@Query("SELECT als FROM AlarmStatus as als WHERE als.user.userId = :userId")
	Optional<AlarmStatus> findByUserId(@Param("userId") Long userId);

	@Query("SELECT a "
			+ "FROM AlarmStatus a "
			+ "JOIN FETCH a.user u "
			+ "WHERE u.userId = (:userId)")
	Optional<AlarmStatus> findByUserIdJoinUser(@Param("userId") Long userId);
}
