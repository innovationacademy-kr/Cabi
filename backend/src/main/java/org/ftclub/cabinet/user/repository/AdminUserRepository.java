package org.ftclub.cabinet.user.repository;

import org.ftclub.cabinet.admin.domain.AdminUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminUserRepository extends JpaRepository<AdminUser, Long> {

    AdminUser getAdminUser(long adminUserId);
}
