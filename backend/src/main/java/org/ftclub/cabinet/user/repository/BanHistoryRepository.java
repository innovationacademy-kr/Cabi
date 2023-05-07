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

    @Query("select bh from BanHistory bh where bh.user = ?1 and bh.unbannedAt > CURRENT_TIMESTAMP()")
    List<BanHistory> findUserActiveBanList(User user);

    List<BanHistory> findBanHistoriesByUserId(Long userId);
}
