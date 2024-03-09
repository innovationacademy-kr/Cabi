package org.ftclub.cabinet.presentation.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.ftclub.cabinet.presentation.domain.Presentation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PresentationRepository extends JpaRepository<Presentation, Long> {

	@Query("SELECT p "
		+ "FROM Presentation p "
		+ "WHERE p.dateTime >= :now "
		+ "AND p.dateTime < :end")
	List<Presentation> findByDateTime(@Param("now") LocalDateTime now,
		@Param("end") LocalDateTime end);

	@Query("SELECT p "
		+ "FROM Presentation p "
		+ "WHERE p.dateTime "
		+ "BETWEEN :start AND :end")
	Optional<Presentation> findByDate(@Param("start") LocalDateTime start,
		@Param("end") LocalDateTime end);

	@EntityGraph(attributePaths = "user")
	List<Presentation> findByDateTimeBetweenOrderByDateTime(LocalDateTime start, LocalDateTime end);

	@EntityGraph(attributePaths = "user")
	List<Presentation> findByDateTimeBeforeOrderByDateTimeDesc(LocalDateTime start,
		Pageable pageable);

	@EntityGraph(attributePaths = "user")
	List<Presentation> findByDateTimeBetweenOrderByDateTimeAsc(LocalDateTime start,
		LocalDateTime end, Pageable pageable);

	@Query("SELECT p "
		+ "FROM Presentation p "
		+ "WHERE p.user.id = :userId")
	Page<Presentation> findPaginationById(@Param("userId") Long userId, Pageable pageable);
}
