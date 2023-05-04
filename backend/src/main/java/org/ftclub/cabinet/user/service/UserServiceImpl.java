package org.ftclub.cabinet.user.service;

import java.util.Date;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.Validate;
import org.ftclub.cabinet.dto.MyProfileResponseDto;
import org.ftclub.cabinet.dto.UserSessionDto;
import org.ftclub.cabinet.lent.domain.LentHistory;
import org.ftclub.cabinet.lent.repository.LentRepository;
import org.ftclub.cabinet.user.domain.AdminRole;
import org.ftclub.cabinet.user.domain.AdminUser;
import org.ftclub.cabinet.user.domain.BanHistory;
import org.ftclub.cabinet.user.domain.BanPolicy;
import org.ftclub.cabinet.user.domain.BanType;
import org.ftclub.cabinet.user.domain.User;
import org.ftclub.cabinet.user.domain.UserRole;
import org.ftclub.cabinet.user.repository.AdminUserRepository;
import org.ftclub.cabinet.user.repository.BanHistoryRepository;
import org.ftclub.cabinet.user.repository.UserRepository;
import org.ftclub.cabinet.utils.DateUtil;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final AdminUserRepository adminUserRepository;
    private final BanHistoryRepository banHistoryRepository;
    private final BanPolicy banPolicy;
    private final LentRepository lentRepository;

    @Override
    public boolean checkUserExists(String name) {
        Optional<User> user = userRepository.findByName(name);
        return user.isPresent();
    }

    @Override
    public void createUser(String name, String email, Date blackholedAt, UserRole role) {
        Validate.notNull(name, "name must not be null");
        Validate.notNull(role, "role must not be null");
        if (role == UserRole.USER) {
            Validate.notNull(email, "email must not be null");
        }
        if (!checkUserExists(name)) {
            User user = new User(name, email, blackholedAt, role);
            userRepository.save(user);
        }
    }

    @Override
    public boolean checkAmdinUserExists(String name) {
        Optional<AdminUser> adminUser = adminUserRepository.findByEmail(name);
        return adminUser.isPresent();
    }

    @Override
    public void createAdminUser(String email) {
        Validate.notNull(email, "email must not be null");
        if (!checkAmdinUserExists(email)) {
            AdminUser adminUser = new AdminUser(email, AdminRole.NONE);
            adminUserRepository.save(adminUser);
        }
    }

    @Override
    public void deleteUser(long userId) {
        User user = userRepository.getUser(userId);
        userRepository.delete(user);
    }

    @Override
    public void deleteAdminUser(long adminUserId) {
        AdminUser adminUser = adminUserRepository.getAdminUser(adminUserId);
        adminUserRepository.delete(adminUser);
    }

    @Override
    public void updateUserBlackholedAtById(long userId, Date newBlackholedAt) {
        Validate.notNull(newBlackholedAt, "newBlackholedAt must not be null");
        User user = userRepository.getUser(userId);
        user.changeBlackholedAt(newBlackholedAt);
        userRepository.save(user);
    }

    @Override
    public void updateAdminUserRole(long adminUserId, AdminRole role) {
        AdminUser adminUser = adminUserRepository.getAdminUser(adminUserId);
        adminUser.changeAdminRole(role);
        adminUserRepository.save(adminUser);
    }

    /* cabinetId를 제외하고 우선 구현.
     * cabinetId를 banHistory에 넣어야한다면 LentHistory 자체를 인자로 받는 것이 좋을 듯 하다.
     * */
    @Override
    public void banUser(long userId, Date expiredAt, Date endedAt) {
        Validate.notNull(expiredAt, "expiredAt must not be null");
        Validate.notNull(endedAt, "endedAt must not be null");
        int banDays = banPolicy.checkBan(expiredAt, endedAt);
        if (banDays == -1) {
            return;
        }
        //cabinetId 임시값 0
        BanHistory banHistory = new BanHistory((long) 0, endedAt,
                DateUtil.addDaysToDate(endedAt, banDays), BanType.PRIVATE, userId);
        banHistoryRepository.save(banHistory);
    }

//    void unbanUser(long userId);

    public MyProfileResponseDto getMyProfile(UserSessionDto user) {
        Optional<LentHistory> lentHistory = lentRepository.findFirstByUserIdAndEndedAtIsNull(
                user.getUserId());
        Long cabinetId;
        if (lentHistory.isPresent()) {
            cabinetId = lentHistory.get().getCabinetId();
        } else {
            cabinetId = (long) -1;
        }
        return new MyProfileResponseDto(user.getUserId(), user.getName(), cabinetId);
    }

//    public List<BlockedUserPaginationDto> getAllBanUsers() {
//
//    }
}
