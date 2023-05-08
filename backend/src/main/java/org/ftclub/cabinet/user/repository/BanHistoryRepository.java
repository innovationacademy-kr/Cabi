package org.ftclub.cabinet.user.repository;

import java.util.List;
import java.util.Optional;
import org.ftclub.cabinet.user.domain.BanHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface BanHistoryRepository extends JpaRepository<BanHistory, Long> {

    Optional<BanHistory> findFirstByUser_UserId(Long userId);

    @Query(value = "SELECT * FROM BAN_HISTORY ban WHERE USER_ID = ?1 and UNBANNED_AT > CURRENT_TIMESTAMP", nativeQuery = true)
    List<BanHistory> findUserActiveBanList(Long userId);

    @Query("SELECT ban FROM BanHistory ban WHERE ban.userId = :userId")
    List<BanHistory> findBanHistoriesByUserId(Long userId);

    @Query("SELECT ban FROM BanHistory ban WHERE ban.unbannedAt > CURRENT_TIMESTAMP ")
    List<BanHistory> findActiveBanList();
}
