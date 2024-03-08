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
	List<ClubLentHistory> findAllByEndedAtIsNullJoinClub();

	@Query("SELECT clh "
			+ "FROM ClubLentHistory clh "
			+ "LEFT JOIN FETCH clh.club "
			+ "WHERE clh.cabinetId = :cabinetId "
			+ "AND clh.endedAt IS NULL ")
	Optional<ClubLentHistory> findByCabinetIdAndEndedAtIsNullJoinClub(Long cabinetId);

	@Query("SELECT clh "
			+ "FROM ClubLentHistory clh "
			+ "LEFT JOIN FETCH clh.cabinet c "
			+ "LEFT JOIN FETCH c.cabinetPlace cp "
			+ "WHERE clh.clubId = :clubId "
			+ "AND clh.endedAt IS NULL ")
	Optional<ClubLentHistory> findByEndedAtIsNullJoinCabinet(Long clubId);

	Optional<ClubLentHistory> findByClubIdAndCabinetIdAndEndedAtIsNull(Long clubId, Long cabinetId);

	@Query("SELECT clh "
			+ "FROM ClubLentHistory clh "
			+ "LEFT JOIN FETCH clh.club "
			+ "WHERE clh.cabinetId IN :cabinetIds "
			+ "AND clh.endedAt IS NULL ")
	Optional<List<ClubLentHistory>> findByEndedAtIsNullJoinCabinets(List<Long> cabinetIds);

	Optional<ClubLentHistory> findByClubIdAndEndedAtIsNull(Long clubId);
}
