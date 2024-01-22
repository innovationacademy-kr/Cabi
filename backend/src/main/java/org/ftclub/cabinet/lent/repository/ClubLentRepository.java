package org.ftclub.cabinet.lent.repository;

import java.util.List;
import java.util.Optional;
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

	@Query("SELECT clh "
			+ "FROM ClubLentHistory clh "
			+ "LEFT JOIN FETCH clh.club "
			+ "WHERE clh.cabinetId = :cabinetId "
			+ "AND clh.endedAt IS NULL ")
	Optional<ClubLentHistory> findByCabinetIdAndEndedAtIsNullWithClub(Long cabinetId);
}
