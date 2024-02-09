package org.ftclub.cabinet.club.repository;

import io.lettuce.core.dynamic.annotation.Param;
import java.util.Optional;
import org.ftclub.cabinet.club.domain.Club;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ClubRepository extends JpaRepository<Club, Long> {

	/**
	 * 삭제되지 않은 모든 동아리 목록을 조회한다.
	 *
	 * @param pageable 페이징 정보
	 * @return 모든 동아리 목록
	 */
	@Query("SELECT c FROM Club c WHERE c.deletedAt IS NULL")
	Page<Club> findPaginationByDeletedAtIsNull(Pageable pageable);

	/**
	 * 특정 동아리 정보를 조회한다.
	 * <p>
	 * ClubLentHistory도 Join 연산으로 함께 조회한다.
	 * </p>
	 *
	 * @param clubId 동아리 ID
	 * @return 동아리 정보
	 */
	@Query("SELECT DISTINCT c "
			+ "FROM Club c "
			+ "LEFT JOIN FETCH c.clubLentHistories "
			+ "WHERE c.id = :clubId "
			+ "AND c.deletedAt IS NULL")
	Optional<Club> findByIdAndDeletedAtIsNull(@Param("clubId") Long clubId);
}
