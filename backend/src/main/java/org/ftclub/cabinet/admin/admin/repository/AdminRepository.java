package org.ftclub.cabinet.admin.admin.repository;

import org.ftclub.cabinet.admin.admin.domain.Admin;
import org.ftclub.cabinet.admin.admin.domain.AdminRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface AdminRepository extends JpaRepository<Admin, Long> {

	/**
	 * 관리자 아이디로 관리자 정보를 가져옵니다.
	 *
	 * @param adminUserId 관리자 고유 Id
	 * @return {@link Admin}
	 */
	@Query("SELECT au FROM Admin au WHERE au.id = :adminUserId")
	Optional<Admin> findById(@Param("adminUserId") Long adminUserId);

	/**
	 * 관리자 이메일로 관리자 정보를 가져옵니다.
	 *
	 * @param email 관리자 이메일
	 * @return {@link Admin}
	 */
	@Query("SELECT au FROM Admin au WHERE au.email = :email")
	Optional<Admin> findByEmail(@Param("email") String email);

	/**
	 * 유저의 이메일로 어드민 유저를 찾고 어드민 유저의 권한을 반환합니다.
	 *
	 * @param email
	 * @return {@link AdminRole}
	 */
	@Query("SELECT au.role FROM Admin au WHERE au.email = :email")
	Optional<AdminRole> findAdminRoleByEmail(@Param("email") String email);
}
