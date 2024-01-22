package org.ftclub.cabinet.club.repository;

import org.ftclub.cabinet.club.domain.ClubRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClubRegistrationRepoitory extends JpaRepository<ClubRegistration, Long> {

}
