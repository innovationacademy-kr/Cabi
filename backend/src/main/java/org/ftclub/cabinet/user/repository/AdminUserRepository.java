package org.ftclub.cabinet.user.repository;

import java.util.Optional;
import org.ftclub.cabinet.user.domain.AdminUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminUserRepository extends JpaRepository<AdminUser, Long> {

    AdminUser getAdminUser(Long adminUserId);

    Optional<AdminUser> findByEmail(String email);
}
