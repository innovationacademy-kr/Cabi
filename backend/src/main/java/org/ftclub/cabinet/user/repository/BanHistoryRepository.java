package org.ftclub.cabinet.user.repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import org.ftclub.cabinet.user.domain.BanHistory;
import org.ftclub.cabinet.user.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BanHistoryRepository extends JpaRepository<BanHistory, Long> {

	@Query(value = "SELECT * FROM BAN_HISTORY WHERE USER_ID = ?1 and UNBANNED_AT > CURRENT_TIMESTAMP", nativeQuery = true)
	List<BanHistory> findUserActiveBanList(Long userId);

	@Query(value = "SELECT count(*) FROM BAN_HISTORY WHERE USER_ID = ?1 and UNBANNED_AT > CURRENT_TIMESTAMP", nativeQuery = true)
	Long countUserActiveBan(Long userId);

	@Query(value = "SELECT * FROM BAN_HISTORY WHERE USER_ID = ?1 ORDER BY UNBANNED_AT DESC LIMIT 1", nativeQuery = true)
	BanHistory findFirstBanHistory(Long userId);
	
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
	Page<BanHistory> findActiveBanList(Pageable pageable, @Param("today") Date today);

	/**
	 * 유저의 가장 최근 밴 히스토리를 가져옵니다.
	 *
	 * @param userId 유저 고유 아이디
	 * @return {@link BanHistory}
	 */
	@Query("SELECT b FROM BanHistory b WHERE b.unbannedAt = (SELECT MAX(b2.unbannedAt) FROM BanHistory b2) AND b.userId = :userId")
	Optional<BanHistory> findRecentBanHistoryByUserId(@Param("userId") Long userId);
}
