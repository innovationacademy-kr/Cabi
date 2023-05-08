package org.ftclub.cabinet.user.service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import javax.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.Validate;
import org.ftclub.cabinet.cabinet.domain.LentType;
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
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final AdminUserRepository adminUserRepository;
    private final BanHistoryRepository banHistoryRepository;
    private final BanPolicy banPolicy;
    private final UserExceptionHandlerService userExceptionHandlerService;

    @Override
    public boolean checkUserExists(String name) {
        Optional<User> user = userRepository.findByName(name);
        return user.isPresent();
    }

    @Override
    public void createUser(String name, String email, Date blackholedAt, UserRole role) {
        if (role == UserRole.USER) {
            Validate.notNull(email, "email must not be null");
        }
        if (!checkUserExists(name)) {
            User user = User.of(name, email, blackholedAt, role);
            userRepository.save(user);
        }
    }

    @Override
    public boolean checkAdminUserExists(String email) {
        Optional<AdminUser> adminUser = adminUserRepository.findByEmail(email);
        return adminUser.isPresent();
    }

    @Override
    public void createAdminUser(String email) {
        if (!checkAdminUserExists(email)) {
            AdminUser adminUser = AdminUser.of(email, AdminRole.NONE);
            adminUserRepository.save(adminUser);
        }
    }

    @Override
    public void deleteUser(Long userId) {
        User user = userExceptionHandlerService.getUser(userId);
        user.setDeletedAt(new Date());
        userRepository.save(user);
    }

    @Override
    public void deleteAdminUser(Long adminUserId) {
        AdminUser adminUser = userExceptionHandlerService.getAdminUser(adminUserId);
        adminUserRepository.delete(adminUser);
    }

    @Override
    public void updateUserBlackholedAtById(Long userId, Date newBlackholedAt) {
        User user = userExceptionHandlerService.getUser(userId);
        user.changeBlackholedAt(newBlackholedAt);
        userRepository.save(user);
    }

    @Override
    public void updateAdminUserRole(Long adminUserId, AdminRole role) {
        AdminUser adminUser = userExceptionHandlerService.getAdminUser(adminUserId);
        adminUser.changeAdminRole(role);
        adminUserRepository.save(adminUser);
    }

    @Override
    public void banUser(Long userId, LentType lentType, Date startedAt, Date endedAt,
            Date expiredAt) {
        BanType banType = banPolicy.verifyForBanType(lentType, startedAt, endedAt, expiredAt);
        if (banType == BanType.NONE) {
            return;
        }
        Date banDate = banPolicy.getBanDate(banType, endedAt, expiredAt);
        BanHistory banHistory = BanHistory.of(endedAt, DateUtil.addDaysToDate(banDate,
                        getAccumulateOverdueDaysByUserId(userId).intValue()),
                banType, userId);
        banHistoryRepository.save(banHistory);
    }

    // 이런 식으로 변경하는 건 어떠신가요..
    @Override
    public void unbanUser(Long userId) {
        BanHistory banHistory = banHistoryRepository.findRecentBanHistoryByUserId(userId);
        if (banPolicy.isActiveBanHistory(banHistory.getUnbannedAt(), new Date())) {
            banHistoryRepository.delete(banHistory);
        }
    }

    @Override
    public Long getAccumulateOverdueDaysByUserId(Long userId) {
        List<BanHistory> banHistories = banHistoryRepository.findBanHistoriesByUserId(userId);
        Long accumulateDays = (long) 0;
        for (BanHistory history : banHistories) {
            accumulateDays += DateUtil.calculateTwoDateDiffAbs(history.getBannedAt(),
                    history.getUnbannedAt());
        }
        return accumulateDays;
    }

    /*
     * Active한 banHistory를 List로 받아와야하나 싶긴한데 lent 쪽에서 주석에 써놓으신 것 보고 동일하게 처리했습니다.
     * */
    @Override
    public boolean checkUserIsBanned(Long userId) {
        List<BanHistory> banHistory = banHistoryRepository.findUserActiveBanList(userId);
        return (banHistory.size() != 0);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
