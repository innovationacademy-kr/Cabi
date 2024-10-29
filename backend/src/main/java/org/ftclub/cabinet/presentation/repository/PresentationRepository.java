package org.ftclub.cabinet.presentation.repository;

import java.time.LocalDateTime;
import java.util.List;
import org.ftclub.cabinet.presentation.domain.Presentation;
import org.ftclub.cabinet.presentation.domain.PresentationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PresentationRepository extends JpaRepository<Presentation, Long> {

	@EntityGraph(attributePaths = "user")
	List<Presentation> findAllByDateTimeBetweenOrderByDateTime(LocalDateTime start,
			LocalDateTime end);

	List<Presentation> findAllByDateTimeBetween(LocalDateTime start, LocalDateTime end);

	@Query("SELECT p "
			+ "FROM Presentation p "
			+ "WHERE p.user.id = :userId")
	Page<Presentation> findPaginationById(@Param("userId") Long userId, Pageable pageable);

	@EntityGraph(attributePaths = "user")
	@Query("SELECT p "
			+ "FROM Presentation p "
			+ "WHERE p.presentationStatus = :status AND "
			+ "p.dateTime BETWEEN :start AND :end")
	List<Presentation> findPresentationsWithinPeriod(
			@Param("status") PresentationStatus status,
			@Param("start") LocalDateTime start,
			@Param("end") LocalDateTime end,
			Pageable pageable);

	@Query("SELECT p "
			+ "FROM Presentation p "
			+ "WHERE p.user IS NULL AND "
			+ "p.dateTime BETWEEN :start AND :end")
	List<Presentation> findDummiesWithinPeriod(
			@Param("start") LocalDateTime start,
			@Param("end") LocalDateTime end,
			Pageable pageable);
}
