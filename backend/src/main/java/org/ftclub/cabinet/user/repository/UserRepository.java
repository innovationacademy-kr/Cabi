package org.ftclub.cabinet.user.repository;

import java.util.Optional;
import org.ftclub.cabinet.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    @Query("SELECT lh.name " +
            "FROM User lh " +
            "WHERE lh.userId = :userId")
    String findNameById(Long userId);

    User getUser(long userId);

    Optional<User> findByName(String name);
}
