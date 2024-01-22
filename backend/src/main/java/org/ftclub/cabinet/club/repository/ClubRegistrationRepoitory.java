package org.ftclub.cabinet.club.repository;

import io.lettuce.core.dynamic.annotation.Param;
import java.util.List;
import java.util.Optional;
import org.ftclub.cabinet.club.domain.ClubRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClubRegistrationRepoitory extends JpaRepository<ClubRegistration, Long> {

	List<ClubRegistration> findAllByClubId(@Param("clubId") Long clubId);

	Optional<ClubRegistration> findByUserId(@Param("userId") Long userId);
}
