package org.ftclub.cabinet.user.repository;

import org.ftclub.cabinet.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    User getUser(long userId);
}
