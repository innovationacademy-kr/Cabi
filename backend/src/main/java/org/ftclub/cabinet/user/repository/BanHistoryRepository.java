package org.ftclub.cabinet.user.repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import org.ftclub.cabinet.user.domain.BanHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BanHistoryRepository extends JpaRepository<BanHistory, Long> {

	@Query("SELECT b FROM BanHistory b WHERE b.userId = :userId AND b.unbannedAt > :today")
	List<BanHistory> findUserActiveBanList(
			@Param("userId") Long userId,
			@Param("today") Date today);

	@Query("SELECT b FROM BanHistory b WHERE b.userId = :userId")
	List<BanHistory> findBanHistoriesByUserId(@Param("userId") Long userId);

	@Query("SELECT b FROM BanHistory b WHERE b.unbannedAt > :today ")
	Page<BanHistory> findActiveBanList(Pageable pageable, @Param("today") Date today);

	@Query("SELECT b FROM BanHistory b WHERE b.unbannedAt = (SELECT MAX(b2.unbannedAt) FROM BanHistory b2) AND b.userId = :userId")
	Optional<BanHistory> findRecentBanHistoryByUserId(@Param("userId") Long userId);
}
