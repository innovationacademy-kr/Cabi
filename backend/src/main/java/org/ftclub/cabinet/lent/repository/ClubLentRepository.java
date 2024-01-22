package org.ftclub.cabinet.lent.repository;

import java.util.List;
import org.ftclub.cabinet.club.domain.ClubLentHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ClubLentRepository extends JpaRepository<ClubLentHistory, Long> {

	@Query("SELECT clh "
			+ "FROM ClubLentHistory clh "
			+ "LEFT JOIN FETCH clh.club "
			+ "WHERE clh.endedAt IS NULL ")
	List<ClubLentHistory> findAllByEndedAtIsNullWithClub();
}
