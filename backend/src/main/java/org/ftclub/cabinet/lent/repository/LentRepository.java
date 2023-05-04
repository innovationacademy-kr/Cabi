package org.ftclub.cabinet.lent.repository;

import java.util.Optional;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LentRepository extends JpaRepository<LentHistory, Long> {

    Optional<LentHistory> findFirstByUserIdAndEndedAtIsNull(long userId);
}
