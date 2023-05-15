package org.ftclub.cabinet.user.repository;

import java.util.List;
import java.util.Optional;
import org.ftclub.cabinet.user.domain.BanHistory;
import org.ftclub.cabinet.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface BanHistoryRepository extends JpaRepository<BanHistory, Long> {

	Optional<BanHistory> findFirstByUser_UserId(Long userId);

	@Query(value = "SELECT * FROM BAN_HISTORY WHERE USER_ID = ?1 and UNBANNED_AT > CURRENT_TIMESTAMP", nativeQuery = true)
	List<BanHistory> findUserActiveBanList(Long userId);

	@Query(value = "SELECT count(*) FROM BAN_HISTORY WHERE USER_ID = ?1 and UNBANNED_AT > CURRENT_TIMESTAMP", nativeQuery = true)
	Long countUserActiveBan(Long userId);

	@Query("select bh from BanHistory bh where bh.user = ?1 and bh.unbannedAt > CURRENT_TIMESTAMP()")
	List<BanHistory> findUserActiveBanList(User user);

	@Query(value = "SELECT * FROM BAN_HISTORY WHERE USER_ID = ?1 ORDER BY UNBANNED_AT DESC LIMIT 1", nativeQuery = true)
	BanHistory findFirstBanHistory(Long userId);
    @Query("SELECT b FROM BanHistory b WHERE b.userId = :userId")
    List<BanHistory> findBanHistoriesByUserId(Long userId);

    @Query("SELECT b FROM BanHistory b WHERE b.unbannedAt > CURRENT_TIMESTAMP ")
    List<BanHistory> findActiveBanList();

    @Query("SELECT b FROM BanHistory b WHERE b.unbannedAt = (SELECT MAX(b2.unbannedAt) FROM BanHistory b2) AND b.userId = :userId")
    BanHistory findRecentBanHistoryByUserId(Long userId);
}
