package org.ftclub.cabinet.lent.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface LentRepository extends JpaRepository<LentHistory, Long> {
    @Query("select count(lh) from LentHistory lh where lh.userId = ?1 and lh.endedAt is null")
    public Long userActiveLentCount(Long userId);
}
