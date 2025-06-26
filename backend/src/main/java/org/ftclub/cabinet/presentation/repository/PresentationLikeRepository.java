package org.ftclub.cabinet.presentation.repository;

import org.ftclub.cabinet.presentation.domain.PresentationLike;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PresentationLikeRepository extends CrudRepository<PresentationLike, Long> {
	void deleteByPresentationIdAndUserId(Long presentationId, Long userId);
	boolean existsByPresentationIdAndUserId(Long presentationId, Long userId);

	Optional<Object> countByid(Long id);
	Long    countByPresentationId(Long presentationId);
}
