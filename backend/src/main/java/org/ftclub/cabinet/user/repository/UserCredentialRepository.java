package org.ftclub.cabinet.user.repository;

import org.ftclub.cabinet.user.domain.UserCredential;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserCredentialRepository extends JpaRepository<UserCredential, Long> {

}
