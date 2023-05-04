package org.ftclub.cabinet.user.repository;

import java.util.Optional;
import org.ftclub.cabinet.user.domain.BanHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BanHistoryRepository extends JpaRepository<BanHistory, Long> {

    Optional<BanHistory> findFirstByUser_UserId(Long userId);
}
