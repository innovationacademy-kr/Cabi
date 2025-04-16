package org.ftclub.cabinet.presentation.repository;

import java.util.List;
import org.ftclub.cabinet.presentation.domain.PresentationComment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PresentationCommentRepository extends JpaRepository<PresentationComment, Long> {
	List<PresentationComment> findByPresentationIdOrderByCreatedAtAsc(Long presentationId);
}
