package org.ftclub.cabinet.lent.repository;

import org.ftclub.cabinet.lent.domain.LentHistory;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LentRepository extends JpaRepository<LentHistory, Long> {
    Optional<LentHistory> findFirstByCabinetIdAndEndedAtIsNull(Long cabinetId);
    Optional<LentHistory> findFirstByUserIdAndEndedAtIsNull(Long userId);
    List<LentHistory> findByUserId(Long userId, Pageable pageable);
    List<LentHistory> findByCabinetId(Long cabinetId, Pageable pageable);
    @Query("select count(lh) from LentHistory lh where lh.endedAt = null and lh.userId = ?1")
    int countUserActiveLent(Long userId);
    @Query("select count(lh) from LentHistory lh where lh.endedAt = null and lh.cabinetId = ?1")
    int countCabinetActiveLent(Long cabinetId);

    @Query("select count(lh) from LentHistory lh where lh.userId = ?1")
    int countUserAllLent(Long userId);

    @Query("select count(lh) from LentHistory lh where lh.cabinetId = ?1")
    int countCabinetAllLent(Long userId);

    @Query("SELECT lh " +
            "FROM LentHistory lh " +
            "WHERE lh.cabinetId = :cabinetId and lh.endedAt = null")
    List<LentHistory> findAllActiveLentByCabinetId(Long cabinetId);
}
