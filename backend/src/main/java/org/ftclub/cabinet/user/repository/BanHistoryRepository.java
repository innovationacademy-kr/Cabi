package org.ftclub.cabinet.user.repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import org.ftclub.cabinet.user.domain.BanHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BanHistoryRepository extends JpaRepository<BanHistory, Long> {

	/**
	 * 유저 아이디로 현재 기준 active한 밴 히스토리를 가져옵니다.
	 *
	 * @param userId 유저 고유 아이디
	 * @param today  현재 날짜
	 * @return active {@link BanHistory} 리스트
	 */
	@Query("SELECT b FROM BanHistory b WHERE b.userId = :userId AND b.unbannedAt > :today")
	List<BanHistory> findUserActiveBanList(
			@Param("userId") Long userId,
			@Param("today") Date today);

	/**
	 * 유저 아이디로 밴 히스토리를 가져옵니다.
	 *
	 * @param userId 유저 고유 아이디
	 * @return {@link BanHistory} 리스트
	 */
	@Query("SELECT b FROM BanHistory b WHERE b.userId = :userId")
	List<BanHistory> findBanHistoriesByUserId(@Param("userId") Long userId);

	/**
	 * 현재 날짜 기준 active한 ban history를 가져옵니다.
	 *
	 * @param pageable 페이징 정보
	 * @param today    현재 날짜
	 * @return active {@link BanHistory} 리스트
	 */
	@Query("SELECT b FROM BanHistory b WHERE b.unbannedAt > :today ")
	Page<BanHistory> findPaginationActiveBanHistories(Pageable pageable,
			@Param("today") Date today);

	/**
	 * 유저의 가장 최근 밴 히스토리를 가져옵니다.
	 *
	 * @param userId 유저 고유 아이디
	 * @return {@link BanHistory}
	 */
	// TO-DO: 현재 LIMIT 1을 사용하지 않고 있음.
	@Query("SELECT bh"
			+ " FROM BanHistory bh"
			+ " WHERE bh.userId = :userId AND bh.unbannedAt IS NOT NULL"
			+ " ORDER BY bh.unbannedAt DESC")
	Optional<BanHistory> findRecentBanHistoryByUserId(@Param("userId") Long userId);

	/**
	 * 유저의 가장 최근 밴 히스토리 중 현재 시간보다 나중인 값을 가져옵니다.
	 *
	 * @param userId 유저 고유 아이디
	 * @param now    현재 시간
	 * @return {@link BanHistory}
	 */
	@Query("SELECT b FROM BanHistory b WHERE b.unbannedAt = (SELECT MAX(b2.unbannedAt) FROM BanHistory b2) AND b.userId = :userId AND b.unbannedAt > :now")
	Optional<BanHistory> findRecentActiveBanHistoryByUserId(@Param("userId") Long userId,
			@Param("now") Date now);
}
