package org.ftclub.cabinet.club.repository;

import org.ftclub.cabinet.club.domain.Club;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClubRepository extends JpaRepository<Club, Long> {


}
