package org.ftclub.cabinet.user.service;

import org.ftclub.cabinet.user.domain.AdminUser;

public interface AdminUserService {

    void promoteUserToAdmin(String email);
}
