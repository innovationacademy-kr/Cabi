package org.ftclub.cabinet.user.repository;

import java.util.Optional;
import org.ftclub.cabinet.user.domain.AdminUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AdminUserRepository extends JpaRepository<AdminUser, Long> {

	@Query("SELECT au FROM AdminUser au WHERE au.adminUserId = :adminUserId")
	AdminUser getAdminUser(@Param("adminUserId") Long adminUserId);

	@Query("SELECT au FROM AdminUser au WHERE au.email = :email")
	Optional<AdminUser> findByEmail(@Param("email") String email);
}
