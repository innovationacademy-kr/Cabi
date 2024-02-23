package org.ftclub.cabinet.presentation.repository;

import org.ftclub.cabinet.presentation.domain.Presentation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PresentationRepository extends JpaRepository<Presentation, Long> {

}
