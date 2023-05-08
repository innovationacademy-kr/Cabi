package org.ftclub.cabinet.user.repository;

import java.util.Optional;
import org.ftclub.cabinet.user.domain.AdminUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface AdminUserRepository extends JpaRepository<AdminUser, Long> {

    @Query("SELECT au FROM AdminUser au WHERE au.adminUserId = :adminUserId")
    AdminUser getAdminUser(Long adminUserId);

    @Query("SELECT au FROM AdminUser au WHERE au.email = :email")
    Optional<AdminUser> findByEmail(String email);
}
