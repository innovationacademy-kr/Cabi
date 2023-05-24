package org.ftclub.cabinet.user.repository;

import java.util.Optional;
import org.ftclub.cabinet.user.domain.AdminUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AdminUserRepository extends JpaRepository<AdminUser, Long> {

	/**
	 * 관리자 아이디로 관리자 정보를 가져옵니다.
	 *
	 * @param adminUserId 관리자 고유 Id
	 * @return {@link AdminUser}
	 */
	@Query("SELECT au FROM AdminUser au WHERE au.adminUserId = :adminUserId")
	AdminUser getAdminUser(@Param("adminUserId") Long adminUserId);

	/**
	 * 관리자 이메일로 관리자 정보를 가져옵니다.
	 *
	 * @param email 관리자 이메일
	 * @return {@link AdminUser}
	 */
	@Query("SELECT au FROM AdminUser au WHERE au.email = :email")
	Optional<AdminUser> findByEmail(@Param("email") String email);
}
