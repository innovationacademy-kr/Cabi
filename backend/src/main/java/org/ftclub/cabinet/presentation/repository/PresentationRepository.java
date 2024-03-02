package org.ftclub.cabinet.presentation.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.ftclub.cabinet.presentation.domain.Presentation;
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
		+ "WHERE p.dateTime BETWEEN :start AND :end")
	Optional<Presentation> findByDate(@Param("start") LocalDateTime start,
		@Param("end") LocalDateTime end);

	@EntityGraph(attributePaths = "user")
	@Query("SELECT p "
		+ "FROM Presentation p "
		+ "WHERE p.dateTime < :date "
		+ "ORDER BY p.dateTime DESC, p.id DESC")
	List<Presentation> findLatestPastPresentations(@Param("date") LocalDateTime startOfDate,
		Pageable pageable);

	@EntityGraph(attributePaths = "user")
	@Query("SELECT p "
		+ "FROM Presentation p "
		+ "WHERE p.dateTime >= :start "
		+ "AND p.dateTime < :end "
		+ "ORDER BY p.dateTime ASC")
	List<Presentation> findUpcomingPresentations(
		@Param("start") LocalDateTime start,
		@Param("end") LocalDateTime end,
		Pageable pageable);

	@EntityGraph(attributePaths = "user")
	List<Presentation> findByDateTimeBetween(LocalDateTime start, LocalDateTime end);

	Optional<Presentation> findById(Long formId);
}
