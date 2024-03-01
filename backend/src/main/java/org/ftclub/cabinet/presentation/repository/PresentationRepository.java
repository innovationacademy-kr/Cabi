package org.ftclub.cabinet.presentation.repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
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
		+ "WHERE DATE(p.dateTime) >= :now "
		+ "AND DATE(p.dateTime) < :end")
	List<Presentation> findByDateTime(@Param("now") Date now,
		@Param("end") Date end);

	@Query("SELECT p "
			+ "FROM Presentation p "
			+ "WHERE DATE(p.dateTime) = :date")
	Optional<Presentation> findByDate(@Param("date") LocalDate date);

	@EntityGraph(attributePaths = "user")
	@Query("SELECT p "
		+ "FROM Presentation p "
		+ "WHERE DATE(p.dateTime) < :date "
		+ "ORDER BY p.dateTime DESC, p.id DESC")
	List<Presentation> findLatestPastPresentations(@Param("date") Date now, Pageable pageable);

	@EntityGraph(attributePaths = "user")
	@Query("SELECT p "
		+ "FROM Presentation p "
		+ "WHERE DATE(p.dateTime) >= :start "
		+ "AND DATE(p.dateTime) < :end "
		+ "ORDER BY p.dateTime ASC")
	List<Presentation> findUpcomingPresentations(
		@Param("start") Date start,
		@Param("end") Date end,
		Pageable pageable);

	@EntityGraph(attributePaths = "user")
	List<Presentation> findByDateTimeBetween(LocalDateTime start, LocalDateTime end);

	Optional<Presentation> findById(Long formId);
}
