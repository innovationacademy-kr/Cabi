package org.ftclub.cabinet.club.repository;

import org.ftclub.cabinet.club.domain.Club;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ClubRepository extends JpaRepository<Club, Long> {

	@Query(value = "select c from Club c where c.deletedAt IS NULL", countQuery = "select count(c) from Club c where c.deletedAt IS NULL")
	Page<Club> findAllActiveClubs(Pageable pageable);
}
