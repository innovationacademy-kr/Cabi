package org.ftclub.cabinet.user.repository;

import java.util.Optional;
import org.ftclub.cabinet.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    User getUser(long userId);

    Optional<User> findByName(String name);
}
