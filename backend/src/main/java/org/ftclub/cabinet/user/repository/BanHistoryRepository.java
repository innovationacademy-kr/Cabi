package org.ftclub.cabinet.user.repository;

import java.time.LocalDateTime;
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
	@Query("SELECT b FROM BanHistory b WHERE b.user.id = :userId AND b.unbannedAt > :today")
	List<BanHistory> findByUserIdAndUnbannedAt(
			@Param("userId") Long userId, @Param("today") LocalDateTime today);

	/**
	 * 유저 아이디 리스트로 현재 기준 active한 밴 히스토리를 가져옵니다.
	 *
	 * @param userIds 유저 고유 아이디 {@link List}
	 * @param today   현재 날짜
	 * @return active {@link BanHistory} 리스트
	 */
	@Query("SELECT b FROM BanHistory b WHERE b.user.id IN :userIds AND b.unbannedAt > :today")
	List<BanHistory> findByUserIdsAndUnbannedAt(
			@Param("userIds") List<Long> userIds, @Param("today") LocalDateTime today);

	/**
	 * 유저 아이디로 밴 히스토리를 가져옵니다.
	 *
	 * @param userId 유저 고유 아이디
	 * @return {@link BanHistory} 리스트
	 */
	@Query("SELECT bh"
			+ " FROM BanHistory bh"
			+ " WHERE bh.user.id = :userId")
	List<BanHistory> findByUserId(@Param("userId") Long userId);

	/**
	 * 현재 날짜 기준 active한 ban history를 가져옵니다.
	 *
	 * @param pageable 페이징 정보
	 * @param today    현재 날짜
	 * @return active {@link BanHistory} 리스트
	 */
	@Query(value = "SELECT b FROM BanHistory b LEFT JOIN FETCH b.user WHERE b.unbannedAt > :today",
			countQuery = "SELECT count(b) FROM BanHistory b WHERE b.unbannedAt > :today")
	Page<BanHistory> findPaginationActiveBanHistoriesJoinUser(Pageable pageable,
	                                                          @Param("today") LocalDateTime today);

	/**
	 * 유저의 가장 최근 밴 히스토리를 가져옵니다.
	 *
	 * @param userId 유저 고유 아이디
	 * @return {@link BanHistory}
	 */
	// TO-DO: 현재 LIMIT 1을 사용하지 않고 있음.
	@Query("SELECT bh"
			+ " FROM BanHistory bh"
			+ " WHERE bh.user.id = :userId AND bh.unbannedAt > :now"
			+ " ORDER BY bh.unbannedAt DESC")
	List<BanHistory> findRecentBanHistoryByUserId(@Param("userId") Long userId,
	                                              @Param("now") LocalDateTime now, Pageable pageable);

	/**
	 * 유저의 가장 최근 밴 히스토리 중 현재 시간보다 나중인 값을 가져옵니다.
	 *
	 * @param userId 유저 고유 아이디
	 * @param now    현재 시간
	 * @return {@link BanHistory}
	 */
	@Query("SELECT b FROM BanHistory b WHERE b.unbannedAt = (SELECT MAX(b2.unbannedAt) FROM BanHistory b2) AND b.user.id = :userId AND b.unbannedAt > :now")
	Optional<BanHistory> findRecentActiveBanHistoryByUserId(@Param("userId") Long userId,
	                                                        @Param("now") LocalDateTime now);
}
