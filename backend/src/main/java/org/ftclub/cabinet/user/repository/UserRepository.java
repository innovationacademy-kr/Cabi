package org.ftclub.cabinet.user.repository;

import java.util.Optional;
import org.ftclub.cabinet.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

<<<<<<< HEAD
    @Query("SELECT lh.name " +
            "FROM User lh " +
            "WHERE lh.userId = :userId")
    String findNameById(Long userId);

    @Query("SELECT u FROM User u WHERE u.userId = :userId")
    User getUser(Long userId);

    @Query("SELECT u FROM User u WHERE u.name = :name")
=======
    User getUser(long userId);

>>>>>>> e1d6a71c ([BE] FEAT : banPolicy 추가 및 기타 userService 메서드 추가 #1038)
    Optional<User> findByName(String name);
}
