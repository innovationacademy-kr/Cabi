package org.ftclub.cabinet.presentation.repository;

import org.ftclub.cabinet.presentation.domain.PresentationLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.awt.print.Pageable;
import java.util.List;
import java.util.Optional;

@Repository
public interface PresentationLikeRepository extends JpaRepository<PresentationLike, Long> {
	void deleteByPresentationIdAndUserId(Long presentationId, Long userId);
	boolean existsByPresentationIdAndUserId(Long presentationId, Long userId);

	List<PresentationLike> findByUserId(Long presentationId,  Pageable pageable);
	Long    countByPresentationId(Long presentationId);
}
