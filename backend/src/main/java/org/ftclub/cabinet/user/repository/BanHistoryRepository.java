package org.ftclub.cabinet.user.repository;

import org.ftclub.cabinet.user.domain.BanHistory;
import org.ftclub.cabinet.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BanHistoryRepository extends JpaRepository<BanHistory, Long> {
    Optional<BanHistory> findFirstByUser_UserId(Long userId);
}
