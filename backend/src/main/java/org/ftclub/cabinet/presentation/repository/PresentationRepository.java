package org.ftclub.cabinet.presentation.repository;

import io.lettuce.core.dynamic.annotation.Param;
import java.time.LocalDate;
import java.util.Optional;
import org.ftclub.cabinet.presentation.domain.Presentation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PresentationRepository extends JpaRepository<Presentation, Long> {

	@Query("SELECT p FROM Presentation p WHERE date(p.dateTime) = :date")
	Optional<Presentation> findByDate(@Param("date") LocalDate date);
}
