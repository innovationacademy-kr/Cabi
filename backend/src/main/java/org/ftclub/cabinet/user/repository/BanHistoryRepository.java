package org.ftclub.cabinet.user.repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import org.ftclub.cabinet.user.domain.BanHistory;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BanHistoryRepository extends JpaRepository<BanHistory, Long> {

//    Optional<BanHistory> findFirstByUser_UserId(Long userId);

	//@Query(value = "SELECT * FROM BAN_HISTORY ban WHERE USER_ID = ?1 and UNBANNED_AT > ?2", nativeQuery = true)
	@Query("SELECT b FROM BanHistory b WHERE b.userId = :userId AND b.unbannedAt > :today")
	List<BanHistory> findUserActiveBanList(@Param("userId") Long userId,
			@Param("today") Date today);

	@Query("SELECT b FROM BanHistory b WHERE b.userId = :userId")
	List<BanHistory> findBanHistoriesByUserId(@Param("userId") Long userId);

	@Query("SELECT b FROM BanHistory b WHERE b.unbannedAt > :today ")
	List<BanHistory> findActiveBanList(Pageable Pageable, @Param("today") Date today);

	@Query("SELECT b FROM BanHistory b WHERE b.unbannedAt = (SELECT MAX(b2.unbannedAt) FROM BanHistory b2) AND b.userId = :userId")
	Optional<BanHistory> findRecentBanHistoryByUserId(@Param("userId") Long userId);
}
