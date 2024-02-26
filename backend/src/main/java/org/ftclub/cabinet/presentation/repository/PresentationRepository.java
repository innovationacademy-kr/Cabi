package org.ftclub.cabinet.presentation.repository;

import io.lettuce.core.dynamic.annotation.Param;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.ftclub.cabinet.presentation.domain.Presentation;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PresentationRepository extends JpaRepository<Presentation, Long> {

	@Query("SELECT p FROM Presentation p WHERE date(p.dateTime) = :date")
	Optional<Presentation> findByDate(@Param("date") LocalDate date);

	@EntityGraph(attributePaths = "user")
	Optional<Presentation> findFirstByDateTimeBeforeOrderByDateTimeDesc(
		LocalDateTime localDateTime);

	@EntityGraph(attributePaths = "user")
	List<Presentation> findFirst2ByDateTimeAfterAndDateTimeBeforeOrderByDateTimeAsc(
		LocalDateTime after, LocalDateTime before);
}
