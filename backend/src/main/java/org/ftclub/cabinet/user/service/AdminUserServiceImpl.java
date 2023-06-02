package org.ftclub.cabinet.user.service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.lent.repository.LentRepository;
import org.ftclub.cabinet.user.domain.AdminRole;
import org.ftclub.cabinet.user.domain.AdminUser;
import org.ftclub.cabinet.user.repository.AdminUserRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminUserServiceImpl implements AdminUserService {

    private final AdminUserRepository adminUserRepository;
    private final LentRepository lentRepository;

    public void promoteUserToAdmin(String email) {
        Optional<AdminUser> user = adminUserRepository.findByEmail(email);
        if (user.isPresent()) {
            user.get().changeAdminRole(AdminRole.ADMIN);
        }
    }
}
