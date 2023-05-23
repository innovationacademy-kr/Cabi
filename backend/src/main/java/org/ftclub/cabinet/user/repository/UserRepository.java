package org.ftclub.cabinet.user.repository;

import java.util.Optional;
import org.ftclub.cabinet.user.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

	@Query("SELECT lh.name " +
			"FROM User lh " +
			"WHERE lh.userId = :userId")
	String findNameById(@Param("userId") Long userId);

	@Query("SELECT u FROM User u WHERE u.userId = :userId")
	User getUser(@Param("userId") Long userId);

	@Query("SELECT u.userId FROM User u WHERE u.name = :name")
	Long getUserIdByName(@Param("name") String name);

	@Query("SELECT u FROM User u WHERE u.name = :name")
	Optional<User> findByName(@Param("name") String name);

	@Query("SELECT u FROM User u WHERE u.name LIKE %:name%")
	Page<User> findByPartialName(@Param("name") String name, Pageable pageable);
}
