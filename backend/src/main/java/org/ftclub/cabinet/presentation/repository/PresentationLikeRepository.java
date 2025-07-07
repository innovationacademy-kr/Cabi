package org.ftclub.cabinet.presentation.repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.ftclub.cabinet.presentation.domain.PresentationLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PresentationLikeRepository extends JpaRepository<PresentationLike, Long> {

	/**
	 * 특정 발표(presentation)에 대한 특정 사용자(user)의 '좋아요' 기록을 찾습니다.
	 *
	 * @param presentationId 발표의 ID
	 * @param userId         사용자의 ID
	 * @return presentationId와 userId가 모두 일치하는 PresentationLike 객체를 Optional로 감싸서 반환합니다. 일치하는 기록이
	 * 없으면 Optional.empty()를 반환합니다.
	 */
	Optional<PresentationLike> findByPresentationIdAndUserId(Long presentationId, Long userId);

	Long countByPresentationId(Long presentationId);

	boolean existsByPresentationIdAndUserId(Long presentationId, Long userId);

//	// 사용자가 누른 좋아요를 최신순으로 페이징 조회
//	Page<PresentationLike> findByUserIdOrderByPresentationStartTimeDesc(Long userId,
//			Pageable pageable);
//
//	// 여러 발표의 좋아요 개수를 한 번에 조회
//	@Query("SELECT pl.presentation.id, COUNT(pl.id) " +
//			"FROM PresentationLike pl " +
//			"WHERE pl.presentation.id IN :presentationIds " +
//			"GROUP BY pl.presentation.id")
//	List<Object[]> findLikeCountsByPresentationIds(
//			@Param("presentationIds") List<Long> presentationIds);

	// 특정 사용자가 좋아요를 누른 발표의 ID를 조회
	@Query("SELECT pl.presentation.id " +
			"FROM PresentationLike pl " +
			"WHERE pl.user.id = :userId AND pl.presentation.id IN :presentationIds")
	Set<Long> findLikedPresentationIdsByUserId(@Param("userId") Long userId,
			@Param("presentationIds") List<Long> presentationIds);
}
