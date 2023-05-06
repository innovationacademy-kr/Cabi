package org.ftclub.cabinet.lent.repository;

import java.util.List;
import java.util.Optional;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface LentRepository extends JpaRepository<LentHistory, Long> {

	Optional<LentHistory> findFirstByCabinetIdAndEndedAtIsNull(Long cabinetId);

	Optional<LentHistory> findFirstByUserIdAndEndedAtIsNull(Long userId);

	List<LentHistory> findByUserId(Long userId, Pageable pageable);

	List<LentHistory> findByCabinetId(Long cabinetId, Pageable pageable);

	@Query("SELECT count(lh) " +
			"FROM LentHistory lh " +
			"WHERE lh.endedAt = null and lh.userId = :userId")
	int countUserActiveLent(Long userId);

	@Query("SELECT count(lh) " +
			"FROM LentHistory lh " +
			"WHERE lh.endedAt = null and lh.cabinetId = :cabinetId")
	int countCabinetActiveLent(Long cabinetId);

	@Query("SELECT count(lh) " +
			"FROM LentHistory lh " +
			"WHERE lh.userId = :userId")
	int countUserAllLent(Long userId);

	@Query("SELECT count(lh)" +
			"FROM LentHistory lh " +
			"WHERE lh.cabinetId = :userId")
	int countCabinetAllLent(Long userId);

	@Query("SELECT lh " +
			"FROM LentHistory lh " +
			"WHERE lh.cabinetId = :cabinetId and lh.endedAt = null")
	List<LentHistory> findAllActiveLentByCabinetId(Long cabinetId);
}
