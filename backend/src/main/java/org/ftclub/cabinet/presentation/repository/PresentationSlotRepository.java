package org.ftclub.cabinet.presentation.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.ftclub.cabinet.presentation.domain.PresentationSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PresentationSlotRepository extends JpaRepository<PresentationSlot, Long> {

	/**
	 * 주어진 시간 범위와 겹치는 프레젠테이션 슬롯을 조회합니다.
	 *
	 * @param startTime 시작 시간
	 * @param endTime   종료 시간
	 * @return 겹치는 {@link PresentationSlot} 리스트
	 */
	@Query("SELECT ps "
			+ "FROM PresentationSlot ps "
			+ "WHERE ps.startTime > :startTime AND ps.startTime < :endTime")
	List<PresentationSlot> findByStartTimeBetween(@Param("startTime") LocalDateTime startTime,
			@Param("endTime") LocalDateTime endTime);

	/**
	 * 슬롯 아이디에 해당하는 프레젠테이션 슬롯을 조회합니다.
	 */
	@Query("SELECT ps FROM PresentationSlot ps WHERE ps.id = :slotId")
	Optional<PresentationSlot> findById(@Param("slotId") Long slotId);
}
