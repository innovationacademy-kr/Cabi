package org.ftclub.cabinet.presentation.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.ftclub.cabinet.presentation.domain.Presentation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PresentationRepository extends JpaRepository<Presentation, Long> {

	/**
	 * 주어진 기간 안에 등록되어 있는 프레젠테이션을 시간순으로 조회합니다.
	 *
	 * @param startTime 시작 날짜(0시 0분) 포함
	 * @param endTime   종료 날짜(한달 뒤) 미포함
	 * @return 프레젠테이션 목록
	 */
	@Query("SELECT p "
			+ "FROM Presentation p "
			+ "WHERE p.startTime >= :startTime AND p.startTime < :endTime "
			+ "ORDER BY p.startTime ASC")
	List<Presentation> findAllWithinPeriod(@Param("startTime") LocalDateTime startTime,
			@Param("endTime") LocalDateTime endTime);

	/**
	 * ID에 해당하는 프레젠테이션을 조회합니다.
	 * <p>
	 * User도 Join 연산으로 함께 조회한다.
	 * </p>
	 *
	 * @param presentationId 프레젠테이션 ID
	 * @return 프레젠테이션
	 */
	@Query("SELECT p "
			+ "FROM Presentation p "
			+ "LEFT JOIN FETCH p.user "
			+ "WHERE p.id = :presentationId")
	Optional<Presentation> findByIdJoinUser(@Param("presentationId") Long presentationId);

	/**
	 * ID에 해당하는 프레젠테이션을 조회합니다.
	 * <p>
	 * Slot도 Join 연산으로 함께 조회한다.
	 * </p>
	 *
	 * @param presentationId 프레젠테이션 ID
	 * @return 프레젠테이션
	 */
	@Query("SELECT p "
			+ "FROM Presentation p "
			+ "LEFT JOIN FETCH p.slot "
			+ "WHERE p.id = :presentationId")
	Optional<Presentation> findByIdJoinSlot(@Param("presentationId") Long presentationId);
}
