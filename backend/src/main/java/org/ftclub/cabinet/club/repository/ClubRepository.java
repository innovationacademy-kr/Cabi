package org.ftclub.cabinet.club.repository;

import io.lettuce.core.dynamic.annotation.Param;
import java.util.Optional;
import org.ftclub.cabinet.club.domain.Club;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ClubRepository extends JpaRepository<Club, Long> {

	@Query(value = "SELECT c FROM Club c WHERE c.deletedAt IS NULL",
			countQuery = "SELECT count(c) FROM Club c WHERE c.deletedAt IS NULL")
	Page<Club> findAllActiveClubs(Pageable pageable);

	@Query("SELECT c "
			+ "FROM Club c "
			+ "LEFT JOIN FETCH c.clubLentHistories "
			+ "WHERE c.id = :clubId "
			+ "AND c.deletedAt IS NULL")
	Optional<Club> findByIdAndDeletedAtIsNull(@Param("clubId") Long clubId);
}
