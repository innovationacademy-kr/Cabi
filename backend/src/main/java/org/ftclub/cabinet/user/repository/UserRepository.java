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

	/**
	 * 유저 고유 아이디로 유저의 이름을 가져옵니다.
	 *
	 * @param userId 유저 고유 아이디
	 * @return 유저 이름
	 */
	@Query("SELECT lh.name " +
			"FROM User lh " +
			"WHERE lh.userId = :userId")
	String findNameById(@Param("userId") Long userId);

	/**
	 * 유저 고유 아이디로 유저를 가져옵니다.
	 *
	 * @param userId 유저 고유 아이디
	 * @return {@link User}
	 */
	@Query("SELECT u FROM User u WHERE u.userId = :userId")
	User getUser(@Param("userId") Long userId);

	/**
	 * 유저 이름으로 유저를 가져옵니다.
	 *
	 * @param name 유저 이름
	 * @return {@link User}
	 */
	@Query("SELECT u FROM User u WHERE u.name = :name")
	User getUserByName(@Param("name") String name);

	/**
	 * 유저 이름으로 유저를 찾습니다.
	 *
	 * @param name 유저 이름
	 * @return {@link User}
	 */
	@Query("SELECT u FROM User u WHERE u.name = :name")
	Optional<User> findByName(@Param("name") String name);

	/**
	 * 유저의 이메일로 유저를 찾습니다.
	 *
	 * @param email     유저 이메일
	 * @return {@link User}
	 */
	@Query("SELECT u FROM User u WHERE u.email = :email")
	Optional<User> findByEmail(@Param("email") String email);

	/**
	 * 유저의 이름 일부분으로 유저를 찾습니다.
	 *
	 * @param name     유저 이름 일부분
	 * @param pageable 페이징 정보
	 * @return {@link User} 리스트
	 */
	@Query("SELECT u FROM User u WHERE u.name LIKE %:name%")
	Page<User> findByPartialName(@Param("name") String name, Pageable pageable);
}
