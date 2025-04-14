package org.ftclub.cabinet.presentation.repository;

import java.util.List;
import org.ftclub.cabinet.presentation.domain.PresentationComment;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PresentationCommentRepository extends JpaRepository<PresentationComment, Long> {
	@EntityGraph(attributePaths = {"user"})
	List<PresentationComment> findByPresentationIdOrderByCreatedAtAsc(Long presentationId);
}
