package org.ftclub.cabinet.presentation.repository;

import io.lettuce.core.dynamic.annotation.Param;
import java.time.LocalDateTime;
import java.util.List;
import org.ftclub.cabinet.presentation.domain.Presentation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PresentationRepository extends JpaRepository<Presentation, Long> {

	@Query("SELECT p "
			+ "FROM Presentation p "
			+ "WHERE p.dateTime > :now "
			+ "AND p.dateTime < :end")
	List<Presentation> findByDateTime(@Param("now") LocalDateTime now,
			@Param("end") LocalDateTime end);
}
